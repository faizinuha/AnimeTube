import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { processYouTubeResponse } from "./content-filter";

const API = "https://www.googleapis.com/youtube/v3";

async function yt(path: string, params: Record<string, string | number | undefined>) {
  
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) throw new Error("YOUTUBE_API_KEY not configured");
  const url = new URL(`${API}/${path}`);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== "") url.searchParams.set(k, String(v));
  });
  url.searchParams.set("key", key);
  const res = await fetch(url.toString());
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`YouTube API ${res.status}: ${text.slice(0, 200)}`);
  }
  return res.json();
}

/** Parse ISO 8601 duration to total seconds */
function parseDurationSec(iso: string | undefined): number {
  if (!iso) return 0;
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!m) return 0;
  return (parseInt(m[1] || "0") * 3600) + (parseInt(m[2] || "0") * 60) + parseInt(m[3] || "0");
}

/**
 * Smart ranking algorithm:
 * - Boosts videos with high view/like ratio (engagement)
 * - Penalizes very short clips < 30s (likely spam/preview)
 * - Boosts medium-length (4–25 min) for episode content
 * - Boosts recent uploads (last 7 days)
 * - Boosts videos with high comment count (community engagement)
 */
function smartRank(items: any[]): any[] {
  const now = Date.now();
  return items
    .map((v) => {
      const views = parseInt(v.statistics?.viewCount || "0");
      const likes = parseInt(v.statistics?.likeCount || "0");
      const comments = parseInt(v.statistics?.commentCount || "0");
      const durSec = parseDurationSec(v.contentDetails?.duration);
      const ageMs = now - new Date(v.snippet?.publishedAt || 0).getTime();
      const ageDays = ageMs / (1000 * 60 * 60 * 24);

      // Engagement ratio (likes per 1000 views)
      const engagementRate = views > 0 ? (likes / views) * 1000 : 0;

      // Duration score: penalize < 30s, boost 4–25 min
      let durScore = 1;
      if (durSec < 30) durScore = 0.1;
      else if (durSec < 60) durScore = 0.5;
      else if (durSec >= 240 && durSec <= 1500) durScore = 1.4; // 4–25 min sweet spot
      else if (durSec > 3600) durScore = 0.8; // very long, slight penalty

      // Recency boost: last 7 days = 1.5x, last 30 days = 1.2x
      let recencyScore = 1;
      if (ageDays <= 7) recencyScore = 1.5;
      else if (ageDays <= 30) recencyScore = 1.2;

      // Comment activity boost
      const commentBoost = comments > 100 ? 1.2 : comments > 10 ? 1.1 : 1;

      const score =
        Math.log10(views + 1) * durScore * recencyScore * commentBoost * (1 + engagementRate * 0.1);

      return { ...v, _score: score };
    })
    .sort((a, b) => b._score - a._score)
    .map(({ _score: _, ...v }) => v);
}

export const searchVideos = createServerFn({ method: "GET" })
  .inputValidator(
    z.object({
      q: z.string().default("anime"),
      maxResults: z.number().min(1).max(50).default(24),
      order: z.enum(["relevance", "date", "viewCount", "rating"]).default("relevance"),
      videoDuration: z.enum(["any", "short", "medium", "long"]).default("any"),
      pageToken: z.string().optional(),
      channelId: z.string().optional(),
      eventType: z.enum(["completed", "live", "upcoming"]).optional(),
    }).parse,
  )
  .handler(async ({ data }) => {
    const json = await yt("search", {
      part: "snippet",
      type: "video",
      q: data.q,
      maxResults: data.maxResults,
      order: data.order,
      videoDuration: data.videoDuration,
      pageToken: data.pageToken,
      channelId: data.channelId,
      eventType: data.eventType,
      regionCode: "US",
      relevanceLanguage: "en",
      safeSearch: "strict",
    });
    const ids = (json.items || []).map((i: any) => i.id?.videoId).filter(Boolean).join(",");
    let details: any = { items: [] };
    if (ids) {
      details = await yt("videos", {
        part: "snippet,statistics,contentDetails",
        id: ids,
      });
    }
    const filtered = processYouTubeResponse(details.items || []);
    const ranked = smartRank(filtered);
    return {
      items: ranked,
      nextPageToken: json.nextPageToken,
      prevPageToken: json.prevPageToken,
    };
  });

export const trendingAnime = createServerFn({ method: "GET" })
  .inputValidator(
    z.object({
      maxResults: z.number().min(1).max(50).default(20),
      q: z.string().default("anime"),
      pageToken: z.string().optional(),
    }).parse,
  )
  .handler(async ({ data }) => {
    const publishedAfter = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const json = await yt("search", {
      part: "snippet",
      type: "video",
      q: data.q,
      maxResults: data.maxResults,
      order: "viewCount",
      publishedAfter,
      pageToken: data.pageToken,
      regionCode: "US",
      relevanceLanguage: "en",
      safeSearch: "strict",
    });
    const ids = (json.items || []).map((i: any) => i.id?.videoId).filter(Boolean).join(",");
    if (!ids) return { items: [], nextPageToken: undefined };
    const details = await yt("videos", {
      part: "snippet,statistics,contentDetails",
      id: ids,
    });
    const filtered = processYouTubeResponse(details.items || []);
    const ranked = smartRank(filtered);
    return { items: ranked, nextPageToken: json.nextPageToken };
  });

export const getVideo = createServerFn({ method: "GET" })
  .inputValidator(z.object({ id: z.string().min(3).max(64) }).parse)
  .handler(async ({ data }) => {
    const json = await yt("videos", {
      part: "snippet,statistics,contentDetails",
      id: data.id,
    });
    const filtered = processYouTubeResponse(json.items || []);
    return { item: filtered[0] || null };
  });

export const getComments = createServerFn({ method: "GET" })
  .inputValidator(z.object({ videoId: z.string() }).parse)
  .handler(async ({ data }) => {
    try {
      const json = await yt("commentThreads", {
        part: "snippet",
        videoId: data.videoId,
        maxResults: 20,
        order: "relevance",
      });
      return { items: json.items || [], disabled: false };
    } catch {
      return { items: [], disabled: true };
    }
  });

export const getRelated = createServerFn({ method: "GET" })
  .inputValidator(z.object({ q: z.string(), excludeId: z.string().optional() }).parse)
  .handler(async ({ data }) => {
    // YouTube deprecated relatedToVideoId — use search by topic keyword fallback
    const json = await yt("search", {
      part: "snippet",
      type: "video",
      q: data.q,
      maxResults: 16,
      order: "relevance",
      safeSearch: "strict",
    });
    const ids = (json.items || [])
      .map((i: any) => i.id?.videoId)
      .filter((id: string) => id && id !== data.excludeId)
      .slice(0, 15)
      .join(",");
    if (!ids) return { items: [] };
    const details = await yt("videos", {
      part: "snippet,statistics,contentDetails",
      id: ids,
    });
    const filteredItems = processYouTubeResponse(details.items || []);
    return { items: filteredItems };
  });

export const getChannel = createServerFn({ method: "GET" })
  .inputValidator(z.object({ id: z.string() }).parse)
  .handler(async ({ data }) => {
    const json = await yt("channels", {
      part: "snippet,statistics,brandingSettings",
      id: data.id,
    });
    return { channel: json.items?.[0] || null };
  });

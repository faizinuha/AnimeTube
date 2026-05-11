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
    const filteredItems = processYouTubeResponse(details.items || []);
    return {
      items: filteredItems,
      nextPageToken: json.nextPageToken,
      prevPageToken: json.prevPageToken,
    };
  });

export const trendingAnime = createServerFn({ method: "GET" })
  .inputValidator(
    z.object({
      maxResults: z.number().min(1).max(50).default(20),
      q: z.string().default("anime"),
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
      regionCode: "US",
      relevanceLanguage: "en",
      safeSearch: "strict",
    });
    const ids = (json.items || []).map((i: any) => i.id?.videoId).filter(Boolean).join(",");
    if (!ids) return { items: [] };
    const details = await yt("videos", {
      part: "snippet,statistics,contentDetails",
      id: ids,
    });
    const filteredItems = processYouTubeResponse(details.items || []);
    return { items: filteredItems };
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

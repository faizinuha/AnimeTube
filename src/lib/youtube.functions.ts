import { getRegion, REGIONS } from "@/hooks/use-region";
import { processYouTubeResponse } from "./content-filter";

// Proxy endpoint — API key disimpan di server Vercel, tidak exposed ke browser
const PROXY = "/api/youtube";

function getRegionParams() {
  const code = getRegion();
  const r = REGIONS.find((x) => x.code === code) ?? REGIONS[0];
  return { regionCode: r.code, relevanceLanguage: r.lang };
}

async function yt(path: string, params: Record<string, string | number | undefined>) {
  const url = new URL(PROXY, window.location.origin);
  url.searchParams.set("path", path);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== "") url.searchParams.set(k, String(v));
  });

  const res = await fetch(url.toString());
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    let message = `YouTube API ${res.status}`;
    if (res.status === 403) {
      message = "quota|403: Quota habis atau API key bermasalah";
    } else if (res.status === 429) {
      message = "quota|429: Quota harian habis (10.000 units/hari)";
    }
    throw new Error(message + ": " + JSON.stringify(data).slice(0, 200));
  }
  return res.json();
}

/** Parse ISO 8601 duration to total seconds */
function parseDurationSec(iso: string | undefined): number {
  if (!iso) return 0;
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!m) return 0;
  return parseInt(m[1] || "0") * 3600 + parseInt(m[2] || "0") * 60 + parseInt(m[3] || "0");
}

function smartRank(items: any[]): any[] {
  const now = Date.now();
  return items
    .map((v) => {
      const views = parseInt(v.statistics?.viewCount || "0");
      const likes = parseInt(v.statistics?.likeCount || "0");
      const comments = parseInt(v.statistics?.commentCount || "0");
      const durSec = parseDurationSec(v.contentDetails?.duration);
      const ageDays = (now - new Date(v.snippet?.publishedAt || 0).getTime()) / 86400000;
      const engagementRate = views > 0 ? (likes / views) * 1000 : 0;
      let durScore = 1;
      if (durSec < 30) durScore = 0.1;
      else if (durSec < 60) durScore = 0.5;
      else if (durSec >= 240 && durSec <= 1500) durScore = 1.4;
      else if (durSec > 3600) durScore = 0.8;
      const recencyScore = ageDays <= 7 ? 1.5 : ageDays <= 30 ? 1.2 : 1;
      const commentBoost = comments > 100 ? 1.2 : comments > 10 ? 1.1 : 1;
      const score = Math.log10(views + 1) * durScore * recencyScore * commentBoost * (1 + engagementRate * 0.1);
      return { ...v, _score: score };
    })
    .sort((a, b) => b._score - a._score)
    .map(({ _score: _, ...v }) => v);
}

export type SearchParams = {
  q?: string;
  maxResults?: number;
  order?: "relevance" | "date" | "viewCount" | "rating";
  videoDuration?: "any" | "short" | "medium" | "long";
  pageToken?: string;
  channelId?: string;
  eventType?: "completed" | "live" | "upcoming";
};

export async function searchVideos(params: SearchParams = {}) {
  const {
    q = "anime", maxResults = 24, order = "relevance",
    videoDuration = "any", pageToken, channelId, eventType,
  } = params;
  const { regionCode, relevanceLanguage } = getRegionParams();
  const json = await yt("search", {
    part: "snippet", type: "video", q, maxResults, order,
    videoDuration, pageToken, channelId, eventType,
    regionCode, relevanceLanguage, safeSearch: "strict",
  });
  const ids = (json.items || []).map((i: any) => i.id?.videoId).filter(Boolean).join(",");
  let details: any = { items: [] };
  if (ids) {
    details = await yt("videos", { part: "snippet,statistics,contentDetails", id: ids });
  }
  const ranked = smartRank(processYouTubeResponse(details.items || []));
  return { items: ranked, nextPageToken: json.nextPageToken as string | undefined };
}

export async function trendingAnime(params: { maxResults?: number; q?: string; pageToken?: string } = {}) {
  const { maxResults = 20, q = "anime", pageToken } = params;
  const { regionCode, relevanceLanguage } = getRegionParams();
  const publishedAfter = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const json = await yt("search", {
    part: "snippet", type: "video", q, maxResults, order: "viewCount",
    publishedAfter, pageToken, regionCode, relevanceLanguage, safeSearch: "strict",
  });
  const ids = (json.items || []).map((i: any) => i.id?.videoId).filter(Boolean).join(",");
  if (!ids) return { items: [], nextPageToken: undefined };
  const details = await yt("videos", { part: "snippet,statistics,contentDetails", id: ids });
  const ranked = smartRank(processYouTubeResponse(details.items || []));
  return { items: ranked, nextPageToken: json.nextPageToken as string | undefined };
}

export async function getVideo(id: string) {
  const json = await yt("videos", { part: "snippet,statistics,contentDetails", id });
  const filtered = processYouTubeResponse(json.items || []);
  return { item: filtered[0] || null };
}

export async function getComments(videoId: string) {
  try {
    const json = await yt("commentThreads", {
      part: "snippet", videoId, maxResults: 20, order: "relevance",
    });
    return { items: json.items || [], disabled: false };
  } catch {
    return { items: [], disabled: true };
  }
}

export async function getRelated(q: string, excludeId?: string) {
  const json = await yt("search", {
    part: "snippet", type: "video", q, maxResults: 16, order: "relevance", safeSearch: "strict",
  });
  const ids = (json.items || [])
    .map((i: any) => i.id?.videoId)
    .filter((id: string) => id && id !== excludeId)
    .slice(0, 15)
    .join(",");
  if (!ids) return { items: [] };
  const details = await yt("videos", { part: "snippet,statistics,contentDetails", id: ids });
  return { items: processYouTubeResponse(details.items || []) };
}

export async function getChannel(id: string) {
  const json = await yt("channels", { part: "snippet,statistics,brandingSettings", id });
  return { channel: json.items?.[0] || null };
}

// Real popular anime channels — refreshed weekly
const REAL_ANIME_CHANNELS = [
  "UCVTyTA7-g9nopHeHbeuvpRA", // Crunchyroll
  "UCoqWQehkMEBqBFkFGa-IQKA", // Muse Asia
  "UCFvLHPAMHBkJbBMBqohFMXg", // Ani-One Asia
  "UC0wNSTMWIL3qaorLx0jie6A", // Netflix Anime
  "UCszoNXOCKFfFHHFMFBMBqhA", // Bilibili Anime
  "UCkejXKmFMFkFMFkFMFkFMFk", // Funimation
  "UCgnfPPb9JI3e9A4cXHnWbyg", // AniDex
  "UCqm3BQLlJfvkTsX_hvm0UmA", // Toei Animation
  "UCxx7cbiqZZ_xP9H4IUk3B0g", // Bandai Namco
  "UCBcRF18a7Qf58cCRy5xuWwQ", // Madman Anime
];

/** Get 10 random anime channels, refreshed weekly via localStorage */
export async function getAnimeChannels() {
  const CACHE_KEY = "animetube:channels:v1";
  const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

  // Check cache
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { data, ts } = JSON.parse(cached);
      if (Date.now() - ts < WEEK_MS && data?.length) return { channels: data };
    }
  } catch {}

  // Pick 10 random from list
  const shuffled = [...REAL_ANIME_CHANNELS].sort(() => Math.random() - 0.5).slice(0, 10);
  const ids = shuffled.join(",");

  try {
    const json = await yt("channels", {
      part: "snippet,statistics",
      id: ids,
      maxResults: 10,
    });
    const channels = json.items || [];
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data: channels, ts: Date.now() }));
    return { channels };
  } catch {
    return { channels: [] };
  }
}

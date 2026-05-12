import type { VercelRequest, VercelResponse } from "@vercel/node";

const YT_API = "https://www.googleapis.com/youtube/v3";

// In-memory cache — persists across requests in same Vercel function instance
const cache = new Map<string, { data: unknown; ts: number }>();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const key = process.env.YOUTUBE_API_KEY;
  if (!key) {
    console.error("[api/youtube] YOUTUBE_API_KEY is not set");
    return res.status(500).json({
      error: "YOUTUBE_API_KEY not configured",
      hint: "Vercel Dashboard → Settings → Environment Variables → add YOUTUBE_API_KEY → Redeploy",
    });
  }

  const { path, ...params } = req.query as Record<string, string>;
  if (!path) return res.status(400).json({ error: "Missing path param" });

  const allowed = ["search", "videos", "commentThreads", "channels"];
  if (!allowed.includes(path)) return res.status(400).json({ error: "Invalid path: " + path });

  // Build cache key from all params
  const cacheKey = path + "?" + new URLSearchParams(params).toString();
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    res.setHeader("X-Cache", "HIT");
    res.setHeader("Cache-Control", "public, s-maxage=600, stale-while-revalidate=1200");
    return res.status(200).json(cached.data);
  }

  try {
    const url = new URL(`${YT_API}/${path}`);
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== "") url.searchParams.set(k, String(v));
    });
    url.searchParams.set("key", key);

    const ytRes = await fetch(url.toString());
    const data = await ytRes.json();

    if (!ytRes.ok) {
      const errBody = JSON.stringify(data).slice(0, 400);
      console.error(`[api/youtube] YouTube ${ytRes.status} for ${path}:`, errBody);

      // Return stale cache if available on error
      if (cached) {
        res.setHeader("X-Cache", "STALE");
        return res.status(200).json(cached.data);
      }

      return res.status(ytRes.status).json({
        ...data,
        _hint: ytRes.status === 403
          ? "Quota habis atau API key bermasalah. Cek Google Cloud Console → YouTube Data API v3 → Quotas"
          : undefined,
      });
    }

    // Store in cache
    cache.set(cacheKey, { data, ts: Date.now() });
    // Limit cache size
    if (cache.size > 200) {
      const oldest = [...cache.entries()].sort((a, b) => a[1].ts - b[1].ts)[0];
      cache.delete(oldest[0]);
    }

    res.setHeader("X-Cache", "MISS");
    res.setHeader("Cache-Control", "public, s-maxage=600, stale-while-revalidate=1200");
    return res.status(200).json(data);
  } catch (err: any) {
    console.error("[api/youtube] Error:", err.message);
    if (cached) return res.status(200).json(cached.data);
    return res.status(500).json({ error: err.message });
  }
}

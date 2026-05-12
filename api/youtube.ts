import type { VercelRequest, VercelResponse } from "@vercel/node";

const YT_API = "https://www.googleapis.com/youtube/v3";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS — allow only our own domain
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const key = process.env.YOUTUBE_API_KEY;
  if (!key) return res.status(500).json({ error: "API key not configured on server" });

  // Forward all query params to YouTube API
  const { path, ...params } = req.query as Record<string, string>;
  if (!path) return res.status(400).json({ error: "Missing path param" });

  // Whitelist allowed paths
  const allowed = ["search", "videos", "commentThreads", "channels"];
  if (!allowed.includes(path)) return res.status(400).json({ error: "Invalid path" });

  try {
    const url = new URL(`${YT_API}/${path}`);
    Object.entries(params).forEach(([k, v]) => {
      if (v) url.searchParams.set(k, String(v));
    });
    url.searchParams.set("key", key);

    const ytRes = await fetch(url.toString());
    const data = await ytRes.json();

    if (!ytRes.ok) {
      return res.status(ytRes.status).json(data);
    }

    // Cache 5 minutes on CDN
    res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600");
    return res.status(200).json(data);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}

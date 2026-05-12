import type { VercelRequest, VercelResponse } from "@vercel/node";

const YT_API = "https://www.googleapis.com/youtube/v3";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const key = process.env.YOUTUBE_API_KEY;
  if (!key) {
    console.error("[api/youtube] YOUTUBE_API_KEY is not set in environment variables");
    return res.status(500).json({
      error: "Server misconfiguration: YOUTUBE_API_KEY not set",
      hint: "Go to Vercel Dashboard → Settings → Environment Variables → add YOUTUBE_API_KEY",
    });
  }

  const { path, ...params } = req.query as Record<string, string>;
  if (!path) return res.status(400).json({ error: "Missing path param" });

  const allowed = ["search", "videos", "commentThreads", "channels"];
  if (!allowed.includes(path)) return res.status(400).json({ error: "Invalid path: " + path });

  try {
    const url = new URL(`${YT_API}/${path}`);
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== "") url.searchParams.set(k, String(v));
    });
    url.searchParams.set("key", key);

    const ytRes = await fetch(url.toString());
    const data = await ytRes.json();

    if (!ytRes.ok) {
      console.error(`[api/youtube] YouTube API ${ytRes.status}:`, JSON.stringify(data).slice(0, 300));
      return res.status(ytRes.status).json(data);
    }

    res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600");
    return res.status(200).json(data);
  } catch (err: any) {
    console.error("[api/youtube] Unexpected error:", err.message);
    return res.status(500).json({ error: err.message });
  }
}

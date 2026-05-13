/**
 * Content filter — SELALU AKTIF, tidak bisa dimatikan.
 * Semua konten NSFW, 18+, kekerasan ekstrem, dan berbahaya
 * diblokir secara otomatis di semua halaman.
 */

// ── Kata kunci yang SELALU diblokir ──────────────────────────────
const BLOCKED: string[] = [
  // NSFW / 18+ / dewasa
  "nsfw", "18+", "adult", "xxx", "porn", "pornhub", "sex", "sexy",
  "nude", "nudes", "naked", "hentai", "ecchi", "lewd", "erotic",
  "erotica", "explicit", "uncensored", "uncensor", "r18", "r-18",
  "perverted", "fetish", "onlyfans", "av actress", "jav",

  // Pelecehan anak — ZERO TOLERANCE
  "pedophile", "pedophilia", "child abuse", "loli nsfw", "shota nsfw",

  // Kekerasan ekstrem
  "gore", "graphic violence", "torture", "mutilation", "dismember",
  "snuff", "beheading", "execution video",

  // Narkoba
  "cocaine", "heroin", "meth", "crystal meth", "how to make drug",
  "drug tutorial",

  // Terorisme
  "terrorism", "terrorist attack", "bomb making", "how to make bomb",
  "isis", "al-qaeda",

  // Scam / judi / pinjol
  "judol", "judi online", "slot gacor", "pinjol ilegal",
  "money laundering", "how to hack", "carding tutorial",
];

// ── Kata kunci yang diblokir di judul/deskripsi (lebih longgar) ──
const TITLE_BLOCKED: string[] = [
  "rape", "sexual abuse", "child porn", "cp video",
  "suicide method", "how to kill", "self harm tutorial",
];

// ── Channel yang diblokir ─────────────────────────────────────────
const BLOCKED_CHANNELS: string[] = [
  // Tambahkan channel ID yang diketahui bermasalah
];

function containsBlocked(text: string): boolean {
  const t = text.toLowerCase();
  return BLOCKED.some((kw) => t.includes(kw));
}

function titleContainsBlocked(text: string): boolean {
  const t = text.toLowerCase();
  return TITLE_BLOCKED.some((kw) => t.includes(kw));
}

/**
 * Filter satu video — return false jika harus diblokir
 */
function isVideoSafe(video: any): boolean {
  const title = (video.snippet?.title || "").toLowerCase();
  const desc = (video.snippet?.description || "").toLowerCase();
  const channel = (video.snippet?.channelTitle || "").toLowerCase();
  const channelId = video.snippet?.channelId || "";
  const tags: string[] = video.snippet?.tags || [];

  // Blokir channel yang masuk daftar hitam
  if (BLOCKED_CHANNELS.includes(channelId)) return false;

  // Cek judul, deskripsi, channel, tags
  if (
    containsBlocked(title) ||
    containsBlocked(desc) ||
    containsBlocked(channel) ||
    titleContainsBlocked(title) ||
    tags.some((t) => containsBlocked(t))
  ) {
    return false;
  }

  return true;
}

/**
 * Filter dan sanitize array video dari YouTube API.
 * Selalu aktif — tidak ada cara untuk menonaktifkan filter ini.
 */
export function processYouTubeResponse(videos: any[]): any[] {
  return videos
    .filter(isVideoSafe)
    .map((v) => ({
      ...v,
      snippet: {
        ...v.snippet,
        title: v.snippet?.title || "Video",
        description: v.snippet?.description || "",
      },
    }));
}

// Legacy exports — tetap ada agar tidak break import lain
export function filterVideoTitle(title: string): string | null {
  if (containsBlocked(title) || titleContainsBlocked(title)) return null;
  return title;
}
export function filterVideos(videos: any[]): any[] {
  return videos.filter(isVideoSafe);
}
export function sanitizeVideo(video: any): any {
  return {
    ...video,
    snippet: {
      ...video.snippet,
      title: video.snippet?.title || "Video",
      description: video.snippet?.description || "",
    },
  };
}

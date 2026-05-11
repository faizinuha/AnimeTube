/**
 * Content filter untuk memastikan semua konten aman untuk semua umur (Family Friendly)
 */

// Daftar kata kunci yang dilarang (dewasa, kekerasan, asusila, dll)
const FORBIDDEN_KEYWORDS = [
  // Konten dewasa/18+
  'adult', 'xxx', 'porn', 'sex', 'nude', 'nudes', 'naked', 'nsfw', 'hentai', 'ecchi',
  'erotica', 'erotic', 'sexy', 'sensual', 'explicit', 'uncensored', 'uncensor',
  'lewd', 'perverted', 'pedophile', 'pedophilia', 'child abuse', 'rape', 'sexual abuse',
  
  // Kekerasan ekstrem
  'gore', 'graphic violence', 'torture', 'mutilation', 'dismember', 'murder', 'killing',
  'assassination', 'suicide', 'self-harm', 'cut wrist', 'hang', 'drown',
  
  // Narkoba & zat terlarang
  'drug', 'cocaine', 'heroin', 'meth', 'cannabis', 'marijuana', 'weed', 'LSD',
  'msmoking', 'how to make drug', 'trip',
  
  // Kekerasan & pelecehan
  'bully', 'bullying', 'harassment', 'hate speech', 'racism', 'racist', 'discrimination',
  'terrorists', 'terrorism', 'bomb', 'explosive', 'weapon', 'gun violence',
  
  // Scam & berbahaya
  'scam', 'fraud', 'fake', 'money laundering', 'illegal', 'contraband',
  'how to hack', 'how to cheat', 'how to steal',
];

// Daftar kata kunci agresif yang lebih umum
const AGGRESSIVE_KEYWORDS = [
  'mature', 'rated r', 'unrated', 'uncensored', 'warning', 'extreme',
  'disturbing', 'graphic', 'bloody', 'violent', 'dark', 'twisted',
];

// Kategori pengganti yang aman
const SAFE_CATEGORIES = ['Edukasi', 'Hiburan Umum', 'Teknologi', 'Olahraga', 'Musik', 'Keluarga', 'Petualangan'];

/**
 * Cek apakah teks mengandung konten berbahaya
 */
function containsForbiddenContent(text: string): boolean {
  const lowerText = text.toLowerCase();
  return FORBIDDEN_KEYWORDS.some((keyword) => lowerText.includes(keyword));
}

/**
 * Cek apakah teks memiliki tanda konten agresif/mature
 */
function hasAggressiveWarning(text: string): boolean {
  const lowerText = text.toLowerCase();
  return AGGRESSIVE_KEYWORDS.some((keyword) => lowerText.includes(keyword));
}

/**
 * Filter judul video - hapus jika mengandung konten berbahaya
 */
export function filterVideoTitle(title: string): string | null {
  if (containsForbiddenContent(title)) {
    return null; // Video harus dihapus
  }
  if (hasAggressiveWarning(title)) {
    return null; // Video dengan warning mature juga dihapus
  }
  return title;
}

/**
 * Dapatkan kategori pengganti yang aman
 */
export function getSafeCategory(): string {
  return SAFE_CATEGORIES[Math.floor(Math.random() * SAFE_CATEGORIES.length)];
}

/**
 * Filter array video dan hapus yang mengandung konten berbahaya
 */
export function filterVideos(videos: any[]): any[] {
  return videos.filter((video) => {
    const title = video.snippet?.title || '';
    const channelTitle = video.snippet?.channelTitle || '';
    const description = video.snippet?.description || '';

    // Cek judul, nama channel, dan deskripsi
    if (
      containsForbiddenContent(title) ||
      containsForbiddenContent(channelTitle) ||
      containsForbiddenContent(description) ||
      hasAggressiveWarning(title) ||
      hasAggressiveWarning(description)
    ) {
      return false; // Hapus video ini
    }

    return true;
  });
}

/**
 * Sanitize video data - pastikan semuanya family-friendly
 */
export function sanitizeVideo(video: any): any {
  if (!video.snippet) return video;

  const sanitized = {
    ...video,
    snippet: {
      ...video.snippet,
      title: video.snippet.title || 'Video',
      description: video.snippet.description || '',
    },
  };

  return sanitized;
}

/**
 * Filter dan sanitize daftar video dari API
 */
export function processYouTubeResponse(videos: any[]): any[] {
  // Hapus video berbahaya
  let filtered = filterVideos(videos);

  // Sanitize video yang tersisa
  filtered = filtered.map(sanitizeVideo);

  return filtered;
}

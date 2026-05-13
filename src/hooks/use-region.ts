import { useEffect, useState } from "react";

export type Region = {
  code: string;
  label: string;
  flag: string;
  lang: string;
  warning?: string;
};

export const REGIONS: Region[] = [
  { code: "ID", label: "Indonesia",  flag: "🇮🇩", lang: "en" },
  { code: "JP", label: "Jepang",     flag: "🇯🇵", lang: "ja",
    warning: "Konten dari Jepang mungkin mengandung materi yang tidak tersedia atau berbeda di Indonesia. Kami tidak bertanggung jawab atas konten yang ditampilkan dari region ini." },
  { code: "CN", label: "China",      flag: "🇨🇳", lang: "zh-Hans",
    warning: "Konten dari China mungkin mengandung materi yang diblokir atau berbeda secara budaya. Kami tidak bertanggung jawab atas konten dari region ini." },
  { code: "ES", label: "Spanyol",    flag: "🇪🇸", lang: "es",
    warning: "Konten dari Spanyol mungkin berbeda dari konten Indonesia. Kami tidak bertanggung jawab atas konten dari region ini." },
  { code: "KR", label: "Korea",      flag: "🇰🇷", lang: "ko",
    warning: "Konten dari Korea mungkin mengandung materi yang berbeda. Kami tidak bertanggung jawab atas konten dari region ini." },
  { code: "US", label: "Amerika",    flag: "🇺🇸", lang: "en",
    warning: "Konten dari Amerika mungkin berbeda dari konten Indonesia. Kami tidak bertanggung jawab atas konten dari region ini." },
  { code: "GB", label: "Inggris",    flag: "🇬🇧", lang: "en",
    warning: "Konten dari Inggris mungkin berbeda. Kami tidak bertanggung jawab atas konten dari region ini." },
  { code: "AU", label: "Australia",  flag: "🇦🇺", lang: "en",
    warning: "Konten dari Australia mungkin berbeda. Kami tidak bertanggung jawab atas konten dari region ini." },
  { code: "FR", label: "Prancis",    flag: "🇫🇷", lang: "fr",
    warning: "Konten dari Prancis mungkin berbeda. Kami tidak bertanggung jawab atas konten dari region ini." },
  { code: "DE", label: "Jerman",     flag: "🇩🇪", lang: "de",
    warning: "Konten dari Jerman mungkin berbeda. Kami tidak bertanggung jawab atas konten dari region ini." },
];

const KEY = "animetube:region";

function readRegion(): string {
  if (typeof window === "undefined") return "ID";
  return localStorage.getItem(KEY) || "ID";
}

let _region = readRegion();
const _listeners = new Set<(r: string) => void>();

// Callback untuk invalidate React Query cache saat region berubah
let _onRegionChange: (() => void) | null = null;

export function registerRegionChangeCallback(cb: () => void) {
  _onRegionChange = cb;
}

export function getRegion() { return _region; }

export function setRegion(code: string) {
  _region = code;
  if (typeof window !== "undefined") localStorage.setItem(KEY, code);
  _listeners.forEach((l) => l(code));
  // Trigger query invalidation
  _onRegionChange?.();
}

export function useRegion() {
  const [region, setR] = useState(readRegion);
  useEffect(() => {
    _listeners.add(setR);
    return () => { _listeners.delete(setR); };
  }, []);
  return { region, setRegion, regions: REGIONS, current: REGIONS.find((r) => r.code === region) ?? REGIONS[0] };
}

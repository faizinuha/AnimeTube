import { useEffect, useState, useCallback } from "react";

const KEY = "animetube:history:v1";
const SEARCHES_KEY = "animetube:searches:v1";
const MAX = 50;

export type HistoryItem = {
  id: string;
  title: string;
  channelTitle: string;
  thumb?: string;
  watchedAt: number;
  tags?: string[];
};

function read<T>(k: string, fb: T): T {
  if (typeof window === "undefined") return fb;
  try {
    const raw = localStorage.getItem(k);
    return raw ? (JSON.parse(raw) as T) : fb;
  } catch {
    return fb;
  }
}

function write(k: string, v: unknown) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(k, JSON.stringify(v));
    window.dispatchEvent(new CustomEvent("animetube:storage"));
  } catch {
    /* quota */
  }
}

export function trackWatch(item: Omit<HistoryItem, "watchedAt">) {
  const list = read<HistoryItem[]>(KEY, []);
  const filtered = list.filter((i) => i.id !== item.id);
  filtered.unshift({ ...item, watchedAt: Date.now() });
  write(KEY, filtered.slice(0, MAX));
}

export function trackSearch(q: string) {
  const t = q.trim();
  if (!t) return;
  const list = read<string[]>(SEARCHES_KEY, []);
  const filtered = list.filter((s) => s.toLowerCase() !== t.toLowerCase());
  filtered.unshift(t);
  write(SEARCHES_KEY, filtered.slice(0, 20));
}

export function useWatchHistory() {
  const [items, setItems] = useState<HistoryItem[]>(() => read(KEY, []));
  useEffect(() => {
    const sync = () => setItems(read(KEY, []));
    window.addEventListener("animetube:storage", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("animetube:storage", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  const clear = useCallback(() => write(KEY, []), []);
  return { items, clear };
}

export function useRecentSearches() {
  const [items, setItems] = useState<string[]>(() => read(SEARCHES_KEY, []));
  useEffect(() => {
    const sync = () => setItems(read(SEARCHES_KEY, []));
    window.addEventListener("animetube:storage", sync);
    return () => window.removeEventListener("animetube:storage", sync);
  }, []);
  return items;
}

/** Suggest a topic keyword based on most-watched titles. */
export function topKeywords(limit = 6): string[] {
  const items = read<HistoryItem[]>(KEY, []);
  const stop = new Set([
    "the", "a", "an", "and", "of", "to", "in", "on", "for", "is", "with",
    "anime", "official", "trailer", "episode", "ep", "amv", "op", "ed",
    "full", "hd", "subbed", "english", "season", "vs", "feat",
  ]);
  const counts = new Map<string, number>();
  items.forEach((it) => {
    const words = (it.title || "").toLowerCase().match(/[a-z\u3040-\u30ff\u4e00-\u9fff]{3,}/g) || [];
    words.forEach((w) => {
      if (stop.has(w)) return;
      counts.set(w, (counts.get(w) || 0) + 1);
    });
    (it.tags || []).slice(0, 4).forEach((t) => {
      const k = t.toLowerCase();
      counts.set(k, (counts.get(k) || 0) + 2);
    });
  });
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([w]) => w);
}

import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "@/hooks/use-theme";
import { toggleSidebar } from "@/hooks/use-sidebar";
import { useRecentSearches, topKeywords, trackSearch } from "@/hooks/use-watch-history";
import { GENRES } from "@/lib/constants";

const POPULAR = [
  "anime opening 2025",
  "best anime fights",
  "demon slayer",
  "jujutsu kaisen",
  "one piece episode",
  "attack on titan",
  "naruto vs sasuke",
  "frieren",
  "solo leveling",
  "chainsaw man",
];

export function Navbar() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [focused, setFocused] = useState(false);
  const recent = useRecentSearches();
  const { theme, toggle } = useTheme();
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setFocused(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const suggestions = useMemo(() => {
    const term = q.trim().toLowerCase();
    const personal = topKeywords(8).map((w) => `${w} anime`);
    const pool = [...recent, ...personal, ...POPULAR, ...GENRES.map((g) => `${g.label} anime`)];
    const seen = new Set<string>();
    const out: string[] = [];
    for (const s of pool) {
      const key = s.toLowerCase();
      if (seen.has(key)) continue;
      if (term && !key.includes(term)) continue;
      seen.add(key);
      out.push(s);
      if (out.length >= 8) break;
    }
    return out;
  }, [q, recent]);

  const submit = (value: string) => {
    const query = value.trim();
    if (!query) return;
    trackSearch(query);
    setFocused(false);
    setQ(query);
    navigate({ to: "/search", search: { q: query } });
  };

  return (
    <header className="glass sticky top-0 z-50">
      <div className="mx-auto flex max-w-[1600px] items-center gap-2 px-3 py-2.5 sm:gap-4 sm:px-4 sm:py-3">
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label="Open menu"
          className="lg:hidden grid h-10 w-10 place-items-center rounded-full text-foreground hover:bg-card"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
        </button>

        <Link to="/" className="flex items-center gap-2 group shrink-0">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-[var(--gradient-primary)] font-display text-xl font-black text-white shadow-[var(--shadow-glow)] group-hover:animate-pulse-glow">
            A
          </div>
          <div className="leading-none hidden sm:block">
            <span className="font-display text-2xl font-black text-gradient">AnimeTube</span>
            <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">動画 · stream</div>
          </div>
        </Link>

        <div ref={wrapRef} className="ml-1 flex flex-1 max-w-2xl relative">
          <form
            onSubmit={(e) => { e.preventDefault(); submit(q); }}
            className="w-full"
          >
            <div className="relative w-full">
              <input
                type="search"
                value={q}
                onFocus={() => setFocused(true)}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search anime..."
                className="w-full rounded-full border border-border bg-input/70 px-4 py-2.5 pr-12 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
              <button
                type="submit"
                aria-label="Search"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 grid h-8 w-9 place-items-center rounded-full bg-[var(--gradient-primary)] text-white hover:shadow-[var(--shadow-glow-strong)]"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.5-3.5" />
                </svg>
              </button>
            </div>
          </form>

          {focused && suggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-2 z-50 overflow-hidden rounded-2xl border border-border bg-popover shadow-[var(--shadow-glow)]">
              <ul className="max-h-[60vh] overflow-y-auto py-1">
                {suggestions.map((s, i) => (
                  <li key={s + i}>
                    <button
                      type="button"
                      onMouseDown={(e) => { e.preventDefault(); submit(s); }}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-foreground hover:bg-card"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground shrink-0">
                        <circle cx="11" cy="11" r="7" />
                        <path d="m20 20-3.5-3.5" />
                      </svg>
                      <span className="truncate">{s}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="grid h-9 w-9 place-items-center rounded-full border border-border bg-card text-foreground hover:border-primary hover:text-primary"
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
          <div className="hidden sm:grid h-9 w-9 place-items-center rounded-full bg-[var(--gradient-primary)] font-bold text-white">
            U
          </div>
        </div>
      </div>
      <div className="h-[2px] w-full bg-[linear-gradient(90deg,#e94560,#f59e0b,#facc15,#22c55e,#3b82f6,#8b5cf6,#e94560)] bg-[length:200%_100%]"
        style={{ animation: "rainbow-shift 6s linear infinite" }} />
    </header>
  );
}

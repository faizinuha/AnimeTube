import { toggleSidebar } from "@/hooks/use-sidebar";
import { useTheme } from "@/hooks/use-theme";
import { topKeywords, trackSearch, useRecentSearches } from "@/hooks/use-watch-history";
import { GENRES } from "@/lib/constants";
import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";

const POPULAR = [
  "anime opening 2025", "best anime fights", "demon slayer",
  "jujutsu kaisen", "one piece episode", "attack on titan",
  "frieren", "solo leveling", "chainsaw man", "naruto",
];

export function Navbar() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [focused, setFocused] = useState(false);
  const recent = useRecentSearches();
  const { theme, toggle } = useTheme();
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setFocused(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const suggestions = useMemo(() => {
    const term = q.trim().toLowerCase();
    const personal = topKeywords(6).map((w) => `${w} anime`);
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
      <div className="mx-auto flex max-w-[1600px] items-center gap-3 px-4 py-3">

        {/* Hamburger — mobile only */}
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label="Open menu"
          className="lg:hidden grid h-9 w-9 shrink-0 place-items-center rounded-lg text-muted-foreground hover:bg-surface hover:text-foreground transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
        </button>

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="h-8 w-8 overflow-hidden rounded-lg shrink-0 ring-1 ring-white/10 group-hover:ring-primary/50 transition-all">
            <img src="/logo.jpg" alt="AnimeTube" className="h-full w-full object-cover" />
          </div>
          <span className="hidden sm:block font-bold text-lg tracking-tight text-foreground group-hover:text-primary transition-colors">
            AnimeTube
          </span>
        </Link>

        {/* Search */}
        <div ref={wrapRef} className="flex-1 max-w-xl relative">
          <form onSubmit={(e) => { e.preventDefault(); submit(q); }}>
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              >
                <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
              </svg>
              <input
                type="search"
                value={q}
                onFocus={() => setFocused(true)}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Cari anime..."
                className="w-full rounded-lg border border-border bg-surface pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all"
              />
            </div>
          </form>

          {/* Suggestions dropdown */}
          {focused && suggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1.5 z-50 overflow-hidden rounded-xl border border-border bg-popover shadow-[var(--shadow-card)]">
              <ul className="max-h-[50vh] overflow-y-auto py-1">
                {suggestions.map((s, i) => (
                  <li key={s + i}>
                    <button
                      type="button"
                      onMouseDown={(e) => { e.preventDefault(); submit(s); }}
                      className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm text-foreground hover:bg-surface transition-colors"
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground shrink-0">
                        <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
                      </svg>
                      <span className="truncate">{s}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-surface text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all text-base"
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
        </div>
      </div>
    </header>
  );
}

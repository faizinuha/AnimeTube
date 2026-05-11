import { GENRES } from "@/lib/constants";
import { Link } from "@tanstack/react-router";

// Safe in-house "house ads" — no third-party network, no gambling, no shady content.
// Lightweight, non-intrusive, dismissible.
const HOUSE_ADS = [
  {
    title: "Discover new anime genres",
    body: "Browse handpicked categories curated for you.",
    cta: "Explore",
    to: "/category/$genre",
    params: { genre: "isekai" },
    emoji: "🌌",
  },
  {
    title: "Watch the trending hits",
    body: "The hottest anime everyone is talking about.",
    cta: "See trending",
    to: "/category/$genre",
    params: { genre: "trending" },
    emoji: "🔥",
  },
  {
    title: "Find your next favorite",
    body: "Romance, action, comedy — all in one place.",
    cta: "Open library",
    to: "/category/$genre",
    params: { genre: "romance" },
    emoji: "💗",
  },
];

export function AdSlot({
  id,
  size = "rectangle",
  className = "",
  sticky = false,
}: {
  id: string;
  size?: "leaderboard" | "rectangle" | "inline";
  label?: string;
  sticky?: boolean;
  className?: string;
}) {
  const idx = Math.abs(id.split("").reduce((a, c) => a + c.charCodeAt(0), 0)) % HOUSE_ADS.length;
  const ad = HOUSE_ADS[idx];

  return (
    <aside
      aria-label="Sponsored content"
      data-ad-id={id}
      className={`relative overflow-hidden rounded-xl border border-border bg-card/60 ${
        sticky ? "sticky top-20" : ""
      } ${size === "leaderboard" ? "p-4" : "p-4"} ${className}`}
    >
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[var(--gradient-primary)] text-xl">
          {ad.emoji}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="rounded bg-muted px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
              Ad
            </span>
            <span className="text-[10px] text-muted-foreground/70">From AnimeTube</span>
          </div>
          <h4 className="mt-1 truncate text-sm font-bold text-foreground">{ad.title}</h4>
          <p className="line-clamp-2 text-xs text-muted-foreground">{ad.body}</p>
          <Link
            to={ad.to}
            params={ad.params}
            className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
          >
            {ad.cta} →
          </Link>
        </div>
      </div>
    </aside>
  );
}

// Keep export shape compatible if imported elsewhere
export const _GENRES_REF = GENRES;

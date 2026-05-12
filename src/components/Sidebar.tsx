import { useRegion } from "@/hooks/use-region";
import { useSidebar } from "@/hooks/use-sidebar";
import { useWatchHistory } from "@/hooks/use-watch-history";
import { GENRES } from "@/lib/constants";
import { getAnimeChannels } from "@/lib/youtube.functions";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  AlertTriangle, Coffee, Compass, Globe,
  HelpCircle, Home, Info, Lock,
  Radio, TrendingUp, X, Zap,
} from "lucide-react";
import { useState } from "react";

const MAIN = [
  { to: "/",                label: "Beranda",  Icon: Home      },
  { to: "/shorts",          label: "Shorts",   Icon: Zap       },
  { to: "/live",            label: "Live",     Icon: Radio     },
  { to: "/search",          label: "Jelajahi", Icon: Compass,  search: { q: "anime" } },
  { to: "/category/$genre", label: "Trending", Icon: TrendingUp, params: { genre: "trending" } },
] as const;

const META = [
  { to: "/about", label: "Tentang",  Icon: Info,       hash: undefined },
  { to: "/about", label: "Bantuan",  Icon: HelpCircle, hash: "help"    },
  { to: "/about", label: "Privasi",  Icon: Lock,       hash: "privacy" },
] as const;

// ── Region Selector ──────────────────────────────────────────────
function RegionSelector({ onClose }: { onClose?: () => void }) {
  const { region, setRegion, regions } = useRegion();
  const [pending, setPending] = useState<string | null>(null);
  const pendingRegion = regions.find((r) => r.code === pending);

  const handleSelect = (code: string) => {
    const r = regions.find((x) => x.code === code);
    if (!r) return;
    if (r.warning) { setPending(code); return; }
    setRegion(code);
    onClose?.();
  };

  const confirmChange = () => {
    if (pending) { setRegion(pending); setPending(null); onClose?.(); }
  };

  return (
    <>
      <div className="px-3 pb-1">
        <div className="flex items-center gap-1.5 mb-2">
          <Globe size={12} className="text-muted-foreground" />
          <p className="section-label">Region</p>
        </div>
        <div className="grid grid-cols-2 gap-1">
          {regions.map((r) => (
            <button
              key={r.code}
              onClick={() => handleSelect(r.code)}
              className={`flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs transition-colors text-left ${
                region === r.code
                  ? "bg-primary/15 text-primary font-semibold"
                  : "text-muted-foreground hover:bg-surface hover:text-foreground"
              }`}
            >
              <span className="text-sm">{r.flag}</span>
              <span className="truncate">{r.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Warning dialog */}
      {pending && pendingRegion?.warning && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-xl border border-border bg-background p-5 shadow-xl">
            <div className="flex items-start gap-3 mb-3">
              <AlertTriangle size={20} className="text-yellow-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm text-foreground mb-1">
                  Pindah ke region {pendingRegion.flag} {pendingRegion.label}?
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {pendingRegion.warning}
                </p>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setPending(null)}
                className="flex-1 rounded-lg border border-border px-3 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Batal
              </button>
              <button
                onClick={confirmChange}
                className="flex-1 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
              >
                Saya Mengerti, Lanjutkan
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ── Anime Channels ────────────────────────────────────────────────
function AnimeChannels({ onItemClick }: { onItemClick?: () => void }) {
  const { data, isLoading } = useQuery({
    queryKey: ["anime-channels-sidebar"],
    queryFn: getAnimeChannels,
    staleTime: 7 * 24 * 60 * 60 * 1000, // 1 week
    gcTime: 7 * 24 * 60 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="px-3 space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-2.5">
            <div className="skeleton h-7 w-7 rounded-full shrink-0" />
            <div className="skeleton h-3 flex-1 rounded" />
          </div>
        ))}
      </div>
    );
  }

  const channels = data?.channels ?? [];
  if (!channels.length) return null;

  return (
    <div className="px-2 space-y-0.5">
      {channels.map((ch: any) => {
        const avatar =
          ch.snippet?.thumbnails?.default?.url ||
          ch.snippet?.thumbnails?.medium?.url;
        const name = ch.snippet?.title || "Channel";
        return (
          <Link
            key={ch.id}
            to="/channel/$channelId"
            params={{ channelId: ch.id }}
            onClick={onItemClick}
            className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-xs text-muted-foreground hover:bg-surface hover:text-foreground transition-colors"
          >
            {avatar ? (
              <img
                src={avatar}
                alt={name}
                className="h-7 w-7 rounded-full object-cover shrink-0 ring-1 ring-border"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            ) : (
              <div className="h-7 w-7 rounded-full bg-primary/20 grid place-items-center text-[10px] font-bold text-primary shrink-0">
                {name[0]}
              </div>
            )}
            <span className="truncate">{name}</span>
          </Link>
        );
      })}
    </div>
  );
}

// ── Support Banner ────────────────────────────────────────────────
function SupportBanner() {
  return (
    <div className="mx-3 my-2 rounded-lg bg-primary/8 border border-primary/15 p-3">
      <div className="flex items-center gap-1.5 mb-1.5">
        <Coffee size={12} className="text-primary" />
        <p className="text-[11px] font-semibold text-primary">Support AnimeTube</p>
      </div>
      <p className="text-[10px] text-muted-foreground leading-relaxed mb-2.5">
        Gratis, no login, bebas judol. Bantu kami tetap online.
      </p>
      <a
        href="https://sociabuzz.com/zuax"
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full text-center rounded-md bg-primary px-3 py-1.5 text-[11px] font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
      >
        Dukung kami →
      </a>
    </div>
  );
}

// ── Nav List ──────────────────────────────────────────────────────
function NavList({ onItemClick }: { onItemClick?: () => void }) {
  const { items: history } = useWatchHistory();
  const recent = history.slice(0, 4);

  return (
    <div className="flex flex-col gap-0.5 py-2">
      {/* Main nav */}
      <div className="px-2 space-y-0.5">
        {MAIN.map((item: any) => (
          <Link
            key={item.label}
            to={item.to}
            params={item.params}
            search={item.search}
            onClick={onItemClick}
            activeProps={{ className: "bg-primary/10 text-primary font-semibold" }}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-surface hover:text-foreground transition-colors"
          >
            <item.Icon size={16} className="shrink-0" />
            <span>{item.label}</span>
          </Link>
        ))}
      </div>

      <div className="my-2 h-px bg-border mx-3" />

      {/* Region */}
      <RegionSelector onClose={onItemClick} />

      <div className="my-2 h-px bg-border mx-3" />

      {/* Genres */}
      <p className="section-label px-5 pb-1.5">Genre</p>
      <div className="px-2 space-y-0.5">
        {GENRES.map((g) => (
          <Link
            key={g.slug}
            to="/category/$genre"
            params={{ genre: g.slug }}
            onClick={onItemClick}
            className="flex items-center gap-3 rounded-lg px-3 py-1.5 text-sm text-muted-foreground hover:bg-surface hover:text-foreground transition-colors"
          >
            <g.Icon size={15} className="shrink-0 opacity-70" />
            <span>{g.label}</span>
          </Link>
        ))}
      </div>

      <div className="my-2 h-px bg-border mx-3" />

      {/* Anime Channels */}
      <p className="section-label px-5 pb-1.5">Anime Channel</p>
      <AnimeChannels onItemClick={onItemClick} />

      {/* Recently watched */}
      {recent.length > 0 && (
        <>
          <div className="my-2 h-px bg-border mx-3" />
          <p className="section-label px-5 pb-1.5">Terakhir ditonton</p>
          <div className="px-2 space-y-0.5">
            {recent.map((it) => (
              <Link
                key={it.id}
                to="/watch"
                search={{ v: it.id }}
                onClick={onItemClick}
                className="flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-xs text-muted-foreground hover:bg-surface hover:text-foreground transition-colors"
              >
                {it.thumb ? (
                  <img src={it.thumb} alt="" className="h-8 w-12 rounded object-cover shrink-0 opacity-80" loading="lazy" />
                ) : (
                  <Zap size={14} className="shrink-0 opacity-50" />
                )}
                <span className="line-clamp-2 leading-tight">{it.title}</span>
              </Link>
            ))}
          </div>
        </>
      )}

      <div className="my-2 h-px bg-border mx-3" />

      {/* Meta */}
      <div className="px-2 space-y-0.5">
        {META.map((m: any) => (
          <Link
            key={m.label}
            to={m.to}
            hash={m.hash}
            onClick={onItemClick}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-surface hover:text-foreground transition-colors"
          >
            <m.Icon size={15} className="shrink-0 opacity-70" />
            <span>{m.label}</span>
          </Link>
        ))}
      </div>

      <SupportBanner />

      <p className="px-5 pt-1 pb-3 text-[10px] text-muted-foreground/40">
        © {new Date().getFullYear()} AnimeTube
      </p>
    </div>
  );
}

// ── Sidebar ───────────────────────────────────────────────────────
export function Sidebar() {
  const { open, setOpen } = useSidebar();

  return (
    <>
      {/* Desktop */}
      <aside className="hidden lg:block w-56 shrink-0 border-r border-border bg-surface/30 sticky top-[57px] h-[calc(100vh-57px)] overflow-y-auto">
        <NavList />
      </aside>

      {/* Mobile drawer */}
      <div
        className={`lg:hidden fixed inset-0 z-[60] transition-opacity duration-200 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!open}
      >
        <button aria-label="Close menu" onClick={() => setOpen(false)}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        <aside
          className={`absolute left-0 top-0 h-full w-64 max-w-[80vw] bg-background border-r border-border overflow-y-auto transition-transform duration-200 ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <span className="font-bold text-base text-foreground">AnimeTube</span>
            <button onClick={() => setOpen(false)} aria-label="Close"
              className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-surface transition-colors">
              <X size={16} />
            </button>
          </div>
          <NavList onItemClick={() => setOpen(false)} />
        </aside>
      </div>
    </>
  );
}

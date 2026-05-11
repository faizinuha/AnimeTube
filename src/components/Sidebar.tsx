import { Link } from "@tanstack/react-router";
import { GENRES } from "@/lib/constants";
import { useSidebar } from "@/hooks/use-sidebar";
import { useWatchHistory } from "@/hooks/use-watch-history";

const MAIN = [
  { to: "/", label: "Home", icon: "🏠" },
  { to: "/shorts", label: "Shorts", icon: "⚡" },
  { to: "/live", label: "Live", icon: "🔴" },
  { to: "/search", label: "Explore", icon: "🧭", search: { q: "anime" } },
  { to: "/category/$genre", label: "Trending", icon: "🔥", params: { genre: "trending" } },
] as const;

const META = [
  { to: "/about", label: "About", icon: "ℹ️" },
  { to: "/about", label: "Help", icon: "❓", hash: "help" },
  { to: "/about", label: "Privacy", icon: "🔐", hash: "privacy" },
  { to: "/about", label: "Terms", icon: "📜", hash: "terms" },
] as const;

function NavList({ onItemClick }: { onItemClick?: () => void }) {
  const { items: history } = useWatchHistory();
  const recent = history.slice(0, 5);

  return (
    <>
      <nav className="px-2 space-y-1">
        {MAIN.map((item: any) => (
          <Link
            key={item.label}
            to={item.to}
            params={item.params}
            search={item.search}
            onClick={onItemClick}
            className="flex items-center gap-4 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground hover:bg-card hover:text-primary transition-colors"
          >
            <span className="text-lg w-6 text-center">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="my-3 h-px bg-border mx-3" />

      <div className="px-5 pb-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
        Genres
      </div>
      <nav className="px-2 space-y-0.5">
        {GENRES.map((g) => (
          <Link
            key={g.slug}
            to="/category/$genre"
            params={{ genre: g.slug }}
            onClick={onItemClick}
            className="flex items-center gap-4 rounded-xl px-3 py-2 text-sm text-foreground hover:bg-card hover:text-primary transition-colors"
          >
            <span className="text-base w-6 text-center">{g.icon}</span>
            <span>{g.label}</span>
          </Link>
        ))}
      </nav>

      {recent.length > 0 && (
        <>
          <div className="my-3 h-px bg-border mx-3" />
          <div className="px-5 pb-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Recently watched
          </div>
          <nav className="px-2 space-y-0.5">
            {recent.map((it) => (
              <Link
                key={it.id}
                to="/watch"
                search={{ v: it.id }}
                onClick={onItemClick}
                className="flex items-center gap-3 rounded-xl px-3 py-2 text-xs text-foreground hover:bg-card hover:text-primary transition-colors"
              >
                {it.thumb ? (
                  <img src={it.thumb} alt="" className="h-9 w-14 rounded object-cover shrink-0" loading="lazy" />
                ) : (
                  <span className="text-base w-6 text-center">▶️</span>
                )}
                <span className="line-clamp-2">{it.title}</span>
              </Link>
            ))}
          </nav>
        </>
      )}

      <div className="my-3 h-px bg-border mx-3" />
      <div className="px-5 pb-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
        More
      </div>
      <nav className="px-2 space-y-0.5">
        {META.map((m) => (
          <Link
            key={m.label}
            to={m.to}
            hash={(m as any).hash}
            onClick={onItemClick}
            className="flex items-center gap-4 rounded-xl px-3 py-2 text-sm text-foreground hover:bg-card hover:text-primary transition-colors"
          >
            <span className="text-base w-6 text-center">{m.icon}</span>
            <span>{m.label}</span>
          </Link>
        ))}
      </nav>

      <div className="px-5 py-4 text-[10px] text-muted-foreground/70 leading-relaxed">
        © {new Date().getFullYear()} AnimeTube<br />
        Powered by YouTube Data API
      </div>
    </>
  );
}

export function Sidebar() {
  const { open, setOpen } = useSidebar();

  return (
    <>
      {/* Desktop: persistent left sidebar */}
      <aside className="hidden lg:block w-60 shrink-0 border-r border-border bg-surface/40 sticky top-[64px] h-[calc(100vh-64px)] overflow-y-auto py-4">
        <NavList />
      </aside>

      {/* Mobile / tablet: drawer */}
      <div
        className={`lg:hidden fixed inset-0 z-[60] transition-opacity ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!open}
      >
        <button
          aria-label="Close menu"
          onClick={() => setOpen(false)}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        <aside
          className={`absolute left-0 top-0 h-full w-72 max-w-[85vw] bg-background border-r border-border overflow-y-auto py-4 transition-transform ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between px-4 pb-3">
            <span className="font-display text-xl font-black text-gradient">AnimeTube</span>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="grid h-9 w-9 place-items-center rounded-full hover:bg-card"
            >
              ✕
            </button>
          </div>
          <NavList onItemClick={() => setOpen(false)} />
        </aside>
      </div>
    </>
  );
}

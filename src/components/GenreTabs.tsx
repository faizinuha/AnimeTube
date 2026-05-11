import { Link } from "@tanstack/react-router";
import { GENRES } from "@/lib/constants";

export function GenreTabs({ active }: { active?: string }) {
  return (
    <div className="border-b border-border bg-surface/60 backdrop-blur">
      <div className="mx-auto flex max-w-[1400px] gap-2 overflow-x-auto px-4 py-2.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <Link
          to="/"
          className="anime-pill shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider"
          data-active={!active ? "true" : "false"}
        >
          🏠 Home
        </Link>
        {GENRES.map((g) => (
          <Link
            key={g.slug}
            to="/category/$genre"
            params={{ genre: g.slug }}
            className="anime-pill shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider"
            data-active={active === g.slug ? "true" : "false"}
          >
            <span className="mr-1">{g.icon}</span>
            {g.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

import { Link } from "@tanstack/react-router";
import { GENRES } from "@/lib/constants";
import { AdSlot } from "./AdSlot";

export function Footer({ showAd = false }: { showAd?: boolean }) {
  return (
    <footer className="mt-20 border-t border-border bg-surface">
      {showAd && (
        <div className="mx-auto max-w-[1400px] px-4 pt-6">
          <AdSlot id="ad-footer-banner" size="leaderboard" />
        </div>
      )}
      <div className="mx-auto grid max-w-[1400px] gap-8 px-4 py-12 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-[var(--gradient-primary)] font-display text-2xl font-black text-white">
              A
            </div>
            <span className="font-display text-2xl font-black text-gradient">AnimeTube</span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">Watch Anime. Live the Story.</p>
          <p className="mt-2 text-xs text-muted-foreground/70">Powered by YouTube Data API v3.</p>
          <p className="mt-3 text-xs text-muted-foreground/60 leading-relaxed">
            Third-party content via YouTube API. <Link to="/about" className="hover:text-primary underline">Legal Disclaimer</Link>
          </p>
        </div>
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-foreground">Explore</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {GENRES.slice(0, 6).map((g) => (
              <li key={g.slug}>
                <Link to="/category/$genre" params={{ genre: g.slug }} className="hover:text-primary">
                  {g.icon} {g.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-foreground">Company</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/about" className="hover:text-primary">About</Link></li>
            <li><a href="#" className="hover:text-primary">Contact</a></li>
            <li><a href="#" className="hover:text-primary">Privacy</a></li>
            <li><a href="#" className="hover:text-primary">Terms</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-foreground">Follow</h4>
          <div className="mt-3 flex gap-2">
            {["X", "YT", "TT", "DC"].map((s) => (
              <a
                key={s}
                href="#"
                className="grid h-10 w-10 place-items-center rounded-lg border border-border bg-card text-sm font-bold text-foreground hover:border-primary hover:text-primary hover:shadow-[var(--shadow-glow)]"
              >
                {s}
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-border bg-card/50 py-6">
        <div className="mx-auto max-w-[1400px] px-4">
          <p className="text-xs text-muted-foreground leading-relaxed text-center">
            <strong>Disclaimer:</strong> This website displays third-party content through the YouTube API. 
            We do not support or accept responsibility for content uploaded by users on the original platform. 
            Content viewed here is the user's own choice and responsibility.
          </p>
        </div>
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} AnimeTube · For educational/demo use. All video content © respective owners.
      </div>
    </footer>
  );
}

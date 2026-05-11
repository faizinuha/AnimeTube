import { GENRES } from "@/lib/constants";
import { Link } from "@tanstack/react-router";
import { AdSlot } from "./AdSlot";

export function Footer({ showAd = false }: { showAd?: boolean }) {
  return (
    <footer className="mt-20 border-t border-border bg-surface">
      {showAd && (
        <div className="mx-auto max-w-[1400px] px-4 pt-6">
          <AdSlot id="ad-footer-banner" size="leaderboard" />
        </div>
      )}

      {/* Support Banner */}
      <div className="mx-auto max-w-[1400px] px-4 py-8">
        <div className="anime-border rounded-2xl bg-gradient-to-br from-primary/10 via-card/80 to-card/60 p-6 sm:p-8 shadow-[var(--shadow-glow)]">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="shrink-0">
              <div className="h-16 w-16 rounded-2xl bg-[var(--gradient-primary)] grid place-items-center text-3xl shadow-[var(--shadow-glow)]">
                💖
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="font-display text-xl sm:text-2xl font-black text-gradient">
                Bantu Kami Tetap Online!
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                AnimeTube adalah proyek <strong>non-profit</strong> yang dibuat dengan cinta untuk komunitas anime. 
                Untuk menjaga website ini tetap <strong>gratis, tanpa iklan judol, dan aman untuk semua umur</strong>, 
                kami butuh dukunganmu. Setiap donasi akan digunakan untuk biaya server, API, dan pengembangan fitur baru.
              </p>
              <p className="mt-2 text-xs text-muted-foreground/80">
                🚀 Target: Hosting premium + CDN global agar loading lebih cepat di seluruh Indonesia
              </p>
            </div>
            <div className="shrink-0">
              <a
                href="https://sociabuzz.com/zuax"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[var(--gradient-primary)] px-6 py-3 text-sm font-bold text-white shadow-[var(--shadow-glow)] hover:shadow-[var(--shadow-glow-strong)] transition"
              >
                ☕ Support via Sociabuzz
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1400px] gap-8 px-4 py-12 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 overflow-hidden rounded-lg shadow-[var(--shadow-glow)] shrink-0">
              <img src="/logo.jpg" alt="AnimeTube" className="h-full w-full object-cover" />
            </div>
            <span className="font-display text-2xl font-black text-gradient">AnimeTube</span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">Watch Anime. Live the Story.</p>
          <p className="mt-2 text-xs text-muted-foreground/70">Powered by YouTube Data API v3.</p>
          <p className="mt-3 text-xs text-muted-foreground/60 leading-relaxed">
            Third-party content via YouTube API. <Link to="/about" className="hover:text-primary underline">Legal Disclaimer</Link>
          </p>
          <a
            href="https://sociabuzz.com/zuax"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/20 transition"
          >
            ☕ Dukung kami
          </a>
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

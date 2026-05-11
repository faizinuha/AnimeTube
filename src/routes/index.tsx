import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { VideoCard } from "@/components/VideoCard";
import { SkeletonCard } from "@/components/SkeletonCard";
import { AdSlot } from "@/components/AdSlot";
import { trendingAnime, searchVideos } from "@/lib/youtube.functions";
import { useWatchHistory, topKeywords } from "@/hooks/use-watch-history";

const trendingOpts = {
  queryKey: ["trending"],
  queryFn: () => trendingAnime({ data: { maxResults: 40, q: "anime" } }),
  staleTime: 5 * 60 * 1000,
};

const musicOpts = {
  queryKey: ["music"],
  queryFn: () => searchVideos({ data: { q: "anime music video", order: "viewCount", maxResults: 16 } }),
  staleTime: 5 * 60 * 1000,
};

const shortsHomeOpts = {
  queryKey: ["shorts-home"],
  queryFn: () => searchVideos({ data: { q: "anime shorts", videoDuration: "short", order: "viewCount", maxResults: 20 } }),
  staleTime: 5 * 60 * 1000,
};

const HERO_LINKS = [
  { label: "Trending", query: "anime trending", badge: "Hot" },
  { label: "Shorts", query: "anime shorts", badge: "New" },
  { label: "Live", query: "anime live", badge: "Live" },
  { label: "Music", query: "anime music video", badge: "Beat" },
];

function HeroSection() {
  return (
    <section className="mb-10 overflow-hidden rounded-[2rem] border border-border bg-[radial-gradient(circle_at_top,_rgba(167,112,255,0.18),transparent_34%),radial-gradient(circle_at_20%_10%,rgba(255,92,184,0.14),transparent_22%),linear-gradient(180deg,#120b1d,#09060d)] p-6 shadow-[var(--shadow-glow)]">
      <div className="relative overflow-hidden rounded-[2rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.06),transparent)] p-6 sm:p-8">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle,_rgba(255,255,255,0.18),transparent_70%)] opacity-40" />
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr] items-center">
          <div className="relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs uppercase tracking-[0.32em] text-primary shadow-[var(--shadow-glow)]">
              2026 update
            </div>
            <div className="space-y-4">
              <h1 className="font-display text-4xl font-black tracking-[-0.04em] sm:text-5xl">
                AnimeTube — <span className="text-gradient">Live the Story</span>
              </h1>
              <p className="max-w-xl text-sm text-muted-foreground sm:text-base">
                Rasakan tampilan baru yang lebih dinamis, neon, dan berenergi. Temukan video anime, shorts, dan siaran live terbaik tanpa login.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/search"
                search={{ q: "anime" }}
                className="inline-flex items-center gap-2 rounded-full bg-[var(--gradient-primary)] px-5 py-3 text-sm font-bold text-white shadow-[var(--shadow-glow)] transition hover:shadow-[var(--shadow-glow-strong)]"
              >
                Explore Anime
              </Link>
              <Link
                to="/shorts"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-5 py-3 text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary"
              >
                Enter Shorts
              </Link>
            </div>
          </div>

          <div className="relative grid gap-3">
            <div className="anime-border rounded-[1.75rem] border border-border bg-surface/70 p-4 backdrop-blur-xl">
              <div className="mb-4 flex items-center justify-between text-sm font-semibold text-foreground">
                <span>Daily picks</span>
                <span className="rounded-full bg-primary/10 px-2 py-1 text-[11px] uppercase tracking-[0.2em] text-primary">AnimeTube</span>
              </div>
              <div className="grid gap-3">
                {HERO_LINKS.map((item) => (
                  <Link
                    key={item.label}
                    to="/search"
                    search={{ q: item.query }}
                    className="flex items-center justify-between rounded-3xl border border-border bg-card/80 px-4 py-3 text-sm text-foreground transition hover:border-primary hover:bg-primary/10"
                  >
                    <span>{item.label}</span>
                    <span className="rounded-full bg-primary/10 px-2 py-1 text-[11px] font-semibold text-primary">{item.badge}</span>
                  </Link>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-[1.75rem] bg-gradient-to-br from-[#7f5cff]/15 via-[#ff5ddb]/10 to-transparent p-4 text-sm text-foreground shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]">
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">New season</p>
                <p className="mt-3 font-semibold">Isekai & Shonen Stream</p>
              </div>
              <div className="rounded-[1.75rem] bg-gradient-to-br from-[#28b2ff]/15 via-[#7f5cff]/10 to-transparent p-4 text-sm text-foreground shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]">
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Featured</p>
                <p className="mt-3 font-semibold">Live sesh & AMV beats</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AnimeTube — Watch anime, free, no login" },
      { name: "description", content: "Stream the latest anime, shorts, and live broadcasts. No login required." },
    ],
  }),
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(trendingOpts);
  },
  component: HomePage,
});

function ContinueWatching() {
  const { items, clear } = useWatchHistory();
  if (items.length === 0) return null;
  return (
    <section className="mb-8">
      <div className="mb-3 flex items-end justify-between gap-3">
        <h2 className="font-display text-xl font-bold flex items-center gap-2">
          <span>▶️</span><span className="text-gradient">Continue watching</span>
        </h2>
        <button onClick={clear} className="text-xs text-muted-foreground hover:text-primary underline">Clear history</button>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-3 [scrollbar-width:thin]">
        {items.slice(0, 12).map((it) => (
          <Link
            key={it.id}
            to="/watch"
            search={{ v: it.id }}
            className="group w-56 shrink-0"
          >
            <div className="relative aspect-video overflow-hidden rounded-xl bg-muted anime-border">
              {it.thumb && <img src={it.thumb} alt="" loading="lazy" className="h-full w-full object-cover transition-transform group-hover:scale-110" />}
            </div>
            <p className="mt-2 line-clamp-2 text-xs font-semibold group-hover:text-primary">{it.title}</p>
            <p className="text-[11px] text-muted-foreground truncate">{it.channelTitle}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

function ForYou() {
  const kws = topKeywords(3);
  const q = kws.length ? kws.join(" ") : "anime";
  const { data, isLoading } = useQuery({
    queryKey: ["foryou", q],
    queryFn: () => searchVideos({ data: { q, order: "viewCount", maxResults: 12 } }),
    enabled: kws.length > 0,
    staleTime: 5 * 60 * 1000,
  });
  if (kws.length === 0) return null;
  return (
    <section className="mb-10">
      <h2 className="mb-3 font-display text-xl font-bold flex items-center gap-2">
        <span>✨</span><span className="text-gradient">Recommended for you</span>
        <span className="text-[10px] text-muted-foreground font-normal ml-2">based on what you watch</span>
      </h2>
      <div className="grid gap-x-4 gap-y-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {isLoading || !data
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          : data.items.slice(0, 8).map((v: any) => <VideoCard key={v.id} video={v} />)}
      </div>
    </section>
  );
}

function PopularMusic() {
  const { data, isLoading } = useQuery(musicOpts);
  return (
    <section className="mb-10">
      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="font-display text-xl font-bold flex items-center gap-2">
              <span>🎵</span><span className="text-gradient">Popular music</span>
            </h2>
            <span className="rounded-full border border-primary/20 bg-primary/5 px-2 py-1 text-[11px] font-semibold text-primary">Recommended</span>
          </div>
        </div>
        <Link
          to="/search"
          search={{ q: "anime music video" }}
          className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary"
        >
          See all music
        </Link>
      </div>
      <div className="grid gap-x-4 gap-y-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {isLoading || !data
          ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
          : data.items.flatMap((v: any, i: number) => {
              const card = <VideoCard key={v.id} video={v} />;
              if (i === 7) return [card, <div key="ad-music" className="col-span-1"><AdSlot id="ad-home-music" /></div>];
              return [card];
            })}
      </div>
    </section>
  );
}

function ShortsPreview() {
  const { data, isLoading } = useQuery(shortsHomeOpts);
  return (
    <section className="mb-10">
      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-display text-xl font-bold flex items-center gap-2">
            <span>⚡</span><span className="text-gradient">Shorts</span>
          </h2>
          <p className="text-sm text-muted-foreground">Short anime clips, edits, and trending micro-videos.</p>
        </div>
        <Link
          to="/shorts"
          className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary"
        >
          Open Shorts
        </Link>
      </div>
      <div className="grid gap-x-4 gap-y-8 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {isLoading || !data
          ? Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)
          : data.items.flatMap((v: any, i: number) => {
              const card = <VideoCard key={v.id} video={v} />;
              if (i === 9) return [card, <div key="ad-shorts-home" className="col-span-1"><AdSlot id="ad-home-shorts" /></div>];
              return [card];
            })}
      </div>
    </section>
  );
}

function Trending() {
  const { data } = useQuery(trendingOpts);
  return (
    <section className="mb-10">
      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="font-display text-xl font-bold flex items-center gap-2">
              <span>🔥</span><span className="text-gradient">Trending now</span>
            </h2>
            <span className="rounded-full border border-primary/20 bg-primary/5 px-2 py-1 text-[11px] font-semibold text-primary">Recommended</span>
          </div>
        </div>
        <Link
          to="/search"
          search={{ q: "anime" }}
          className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary"
        >
          Browse all anime
        </Link>
      </div>
      <div className="grid gap-x-4 gap-y-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {!data
          ? Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)
          : data.items.flatMap((v: any, i: number) => {
              const card = <VideoCard key={v.id} video={v} />;
              if (i === 7) return [card, <div key="ad" className="col-span-1"><AdSlot id="ad-home-feed" /></div>];
              if (i === 19) return [card, <div key="ad2" className="col-span-1"><AdSlot id="ad-home-feed-2" /></div>];
              return [card];
            })}
      </div>
    </section>
  );
}

function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 min-w-0 px-3 py-4 sm:px-4 sm:py-6">
          <div className="mx-auto max-w-[1600px]">
            <HeroSection />
            <ContinueWatching />
            <ForYou />
            <PopularMusic />
            <Trending />
            <ShortsPreview />
            <div className="mt-12 text-center">
              <Link
                to="/search"
                search={{ q: "anime" }}
                className="inline-flex items-center gap-2 rounded-full bg-[var(--gradient-primary)] px-6 py-2.5 text-sm font-bold text-white shadow-[var(--shadow-glow)] hover:shadow-[var(--shadow-glow-strong)]"
              >
                Browse all anime →
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

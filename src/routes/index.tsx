import { AdSlot } from "@/components/AdSlot";
import { InfiniteScroll } from "@/components/InfiniteScroll";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { SkeletonCard } from "@/components/SkeletonCard";
import { VideoCard } from "@/components/VideoCard";
import { topKeywords, useWatchHistory } from "@/hooks/use-watch-history";
import { searchVideos, trendingAnime } from "@/lib/youtube.functions";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";

const HERO_LINKS = [
  { label: "Trending", query: "anime trending", badge: "Hot" },
  { label: "Shorts", query: "anime shorts", badge: "New" },
  { label: "Live", query: "anime live", badge: "Live" },
  { label: "Music", query: "anime music video", badge: "Beat" },
];

function HeroSection() {
  return (
    <section className="mb-8 overflow-hidden rounded-xl border border-border bg-gradient-to-br from-surface via-background to-surface">
      <div className="px-5 py-8 sm:px-8 sm:py-10">
        <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[1.3fr_1fr] lg:items-center">
          {/* Left */}
          <div className="space-y-4">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/8 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-primary">
              2026 Update
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight">
              AnimeTube —{" "}
              <span className="text-gradient">Live the Story</span>
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
              Nonton anime gratis, tanpa login. Trending, Shorts, Live, dan ratusan genre — semua dalam satu tempat.
            </p>
            <div className="flex flex-wrap gap-2.5 pt-1">
              <Link
                to="/search"
                search={{ q: "anime" }}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
              >
                Jelajahi Anime
              </Link>
              <Link
                to="/shorts"
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-5 py-2.5 text-sm font-semibold text-foreground hover:border-primary/50 hover:text-primary transition-colors"
              >
                Buka Shorts
              </Link>
            </div>
          </div>

          {/* Right — quick links, hidden on small mobile */}
          <div className="hidden sm:grid gap-2">
            <div className="rounded-lg border border-border bg-surface/60 p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-foreground">Daily picks</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary">AnimeTube</span>
              </div>
              <div className="grid gap-1.5">
                {HERO_LINKS.map((item) => (
                  <Link
                    key={item.label}
                    to="/search"
                    search={{ q: item.query }}
                    className="flex items-center justify-between rounded-md border border-border/50 bg-background/60 px-3 py-2 text-sm text-foreground hover:border-primary/40 hover:bg-primary/5 transition-colors"
                  >
                    <span>{item.label}</span>
                    <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">{item.badge}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export const Route = createFileRoute("/")({ component: HomePage });

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
          <Link key={it.id} to="/watch" search={{ v: it.id }} className="group w-56 shrink-0">
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
    queryFn: () => searchVideos({ q, order: "viewCount", maxResults: 12 }),
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
  const { data, isLoading } = useQuery({
    queryKey: ["music"],
    queryFn: () => searchVideos({ q: "anime music video", order: "viewCount", maxResults: 16 }),
    staleTime: 5 * 60 * 1000,
  });
  return (
    <section className="mb-10">
      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-center gap-3">
          <h2 className="font-display text-xl font-bold flex items-center gap-2">
            <span>🎵</span><span className="text-gradient">Popular music</span>
          </h2>
          <span className="rounded-full border border-primary/20 bg-primary/5 px-2 py-1 text-[11px] font-semibold text-primary">Recommended</span>
        </div>
        <Link to="/search" search={{ q: "anime music video" }}
          className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary">
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
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
    queryKey: ["shorts-home-infinite"],
    queryFn: ({ pageParam }) => searchVideos({ q: "anime shorts", videoDuration: "short", order: "viewCount", maxResults: 20, pageToken: pageParam as string | undefined }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last: any) => last.nextPageToken ?? undefined,
    staleTime: 5 * 60 * 1000,
  });
  const allItems = data?.pages.flatMap((p: any) => p.items) ?? [];
  return (
    <section className="mb-10">
      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-display text-xl font-bold flex items-center gap-2"><span>⚡</span><span className="text-gradient">Shorts</span></h2>
          <p className="text-sm text-muted-foreground">Short anime clips, edits, and trending micro-videos.</p>
        </div>
        <Link to="/shorts" className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary">
          Open Shorts
        </Link>
      </div>
      <InfiniteScroll onLoadMore={() => fetchNextPage()} hasMore={!!hasNextPage} loading={isFetchingNextPage}>
        <div className="grid gap-x-4 gap-y-8 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {isLoading ? Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)
            : allItems.flatMap((v: any, i: number) => {
                const card = <VideoCard key={v.id + i} video={v} />;
                if (i === 9) return [card, <div key="ad-shorts-home" className="col-span-1"><AdSlot id="ad-home-shorts" /></div>];
                return [card];
              })}
          {isFetchingNextPage && Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={"sk" + i} />)}
        </div>
      </InfiniteScroll>
    </section>
  );
}

function Trending() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
    queryKey: ["trending-infinite"],
    queryFn: ({ pageParam }) => trendingAnime({ maxResults: 20, q: "anime", pageToken: pageParam as string | undefined }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last: any) => last.nextPageToken ?? undefined,
    staleTime: 5 * 60 * 1000,
  });
  const allItems = data?.pages.flatMap((p: any) => p.items) ?? [];
  return (
    <section className="mb-10">
      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-center gap-3">
          <h2 className="font-display text-xl font-bold flex items-center gap-2"><span>🔥</span><span className="text-gradient">Trending now</span></h2>
          <span className="rounded-full border border-primary/20 bg-primary/5 px-2 py-1 text-[11px] font-semibold text-primary">Recommended</span>
        </div>
        <Link to="/search" search={{ q: "anime" }} className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary">
          Browse all anime
        </Link>
      </div>
      <InfiniteScroll onLoadMore={() => fetchNextPage()} hasMore={!!hasNextPage} loading={isFetchingNextPage}>
        <div className="grid gap-x-4 gap-y-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {isLoading ? Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)
            : allItems.flatMap((v: any, i: number) => {
                const card = <VideoCard key={v.id + i} video={v} />;
                if (i === 7) return [card, <div key="ad" className="col-span-1"><AdSlot id="ad-home-feed" /></div>];
                if (i === 19) return [card, <div key="ad2" className="col-span-1"><AdSlot id="ad-home-feed-2" /></div>];
                return [card];
              })}
          {isFetchingNextPage && Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={"sk" + i} />)}
        </div>
      </InfiniteScroll>
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
          </div>
        </main>
      </div>
    </div>
  );
}

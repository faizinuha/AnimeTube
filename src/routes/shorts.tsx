import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { formatViews, timeAgo } from "@/lib/format";
import { searchVideos } from "@/lib/youtube.functions";
import { useInfiniteQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronDown, ChevronUp, ExternalLink, Share2, ThumbsUp, Volume2, VolumeX } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/shorts")({ component: ShortsPage });

function ShortItem({ video, active }: { video: any; active: boolean }) {
  const id = typeof video.id === "string" ? video.id : video.id?.videoId;
  const [muted, setMuted] = useState(true);
  const ytUrl = `https://www.youtube.com/watch?v=${id}`;

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-black">
      {/* Video iframe */}
      <div className="relative h-full max-h-[calc(100vh-57px)] aspect-[9/16] mx-auto overflow-hidden">
        {active ? (
          <iframe
            src={`https://www.youtube.com/embed/${id}?autoplay=1&mute=${muted ? 1 : 0}&loop=1&playlist=${id}&controls=0&rel=0&modestbranding=1&playsinline=1`}
            title={video.snippet.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full border-0"
          />
        ) : (
          /* Thumbnail placeholder when not active */
          <img
            src={video.snippet.thumbnails?.high?.url || video.snippet.thumbnails?.medium?.url}
            alt={video.snippet.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}

        {/* Gradient overlay bottom */}
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />

        {/* Info bottom-left */}
        <div className="absolute bottom-4 left-4 right-16 text-white">
          <Link
            to="/channel/$channelId"
            params={{ channelId: video.snippet.channelId }}
            className="flex items-center gap-2 mb-2 group"
          >
            <div className="h-8 w-8 rounded-full bg-primary/30 grid place-items-center text-xs font-bold text-white ring-2 ring-white/20">
              {video.snippet.channelTitle?.[0]?.toUpperCase()}
            </div>
            <span className="text-sm font-semibold group-hover:underline">
              {video.snippet.channelTitle}
            </span>
          </Link>
          <p className="text-sm font-medium line-clamp-2 leading-snug">{video.snippet.title}</p>
          <p className="text-xs text-white/60 mt-1">{timeAgo(video.snippet.publishedAt)}</p>
        </div>

        {/* Action buttons right */}
        <div className="absolute bottom-4 right-3 flex flex-col items-center gap-4">
          <button
            onClick={() => setMuted((m) => !m)}
            className="flex flex-col items-center gap-1 text-white"
            aria-label={muted ? "Unmute" : "Mute"}
          >
            <div className="h-10 w-10 rounded-full bg-white/10 backdrop-blur grid place-items-center hover:bg-white/20 transition-colors">
              {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </div>
          </button>

          <a
            href={`https://www.youtube.com/watch?v=${id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-1 text-white"
          >
            <div className="h-10 w-10 rounded-full bg-white/10 backdrop-blur grid place-items-center hover:bg-white/20 transition-colors">
              <ThumbsUp size={18} />
            </div>
            <span className="text-[10px]">{formatViews(video.statistics?.viewCount)}</span>
          </a>

          <button
            onClick={() => {
              if (navigator.share) navigator.share({ title: video.snippet.title, url: ytUrl }).catch(() => {});
              else navigator.clipboard?.writeText(ytUrl);
            }}
            className="flex flex-col items-center gap-1 text-white"
          >
            <div className="h-10 w-10 rounded-full bg-white/10 backdrop-blur grid place-items-center hover:bg-white/20 transition-colors">
              <Share2 size={18} />
            </div>
            <span className="text-[10px]">Share</span>
          </button>

          <a
            href={ytUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-1 text-white"
          >
            <div className="h-10 w-10 rounded-full bg-white/10 backdrop-blur grid place-items-center hover:bg-white/20 transition-colors">
              <ExternalLink size={18} />
            </div>
            <span className="text-[10px]">YouTube</span>
          </a>
        </div>
      </div>
    </div>
  );
}

function ShortsPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isScrolling = useRef(false);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ["shorts-yt-style"],
    queryFn: ({ pageParam }) => searchVideos({
      q: "anime shorts amv edit",
      videoDuration: "short",
      order: "viewCount",
      maxResults: 10,
      pageToken: pageParam as string | undefined,
    }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last: any) => last.nextPageToken ?? undefined,
    staleTime: 5 * 60 * 1000,
  });

  const allItems = data?.pages.flatMap((p: any) => p.items) ?? [];

  // Load more when near end
  useEffect(() => {
    if (activeIndex >= allItems.length - 3 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [activeIndex, allItems.length, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const goTo = useCallback((idx: number) => {
    if (idx < 0 || idx >= allItems.length) return;
    setActiveIndex(idx);
    const el = containerRef.current?.children[idx] as HTMLElement;
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [allItems.length]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") goTo(activeIndex + 1);
      if (e.key === "ArrowUp") goTo(activeIndex - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeIndex, goTo]);

  // Scroll snap detection
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const onScroll = () => {
      if (isScrolling.current) return;
      const h = container.clientHeight;
      const idx = Math.round(container.scrollTop / h);
      setActiveIndex(idx);
    };
    container.addEventListener("scroll", onScroll, { passive: true });
    return () => container.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 min-w-0 relative">
          {/* Scroll container — snap scroll */}
          <div
            ref={containerRef}
            className="h-[calc(100vh-57px)] overflow-y-scroll snap-y snap-mandatory"
            style={{ scrollbarWidth: "none" }}
          >
            {allItems.map((video: any, i: number) => (
              <div
                key={video.id + i}
                className="h-[calc(100vh-57px)] snap-start snap-always flex items-center justify-center bg-black"
              >
                <ShortItem video={video} active={i === activeIndex} />
              </div>
            ))}

            {/* Loading more */}
            {isFetchingNextPage && (
              <div className="h-[calc(100vh-57px)] snap-start flex items-center justify-center bg-black">
                <div className="flex flex-col items-center gap-3 text-white/50">
                  <div className="h-8 w-8 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                  <span className="text-sm">Loading more...</span>
                </div>
              </div>
            )}
          </div>

          {/* Nav arrows — desktop */}
          <div className="hidden lg:flex absolute right-6 top-1/2 -translate-y-1/2 flex-col gap-2 z-10">
            <button
              onClick={() => goTo(activeIndex - 1)}
              disabled={activeIndex === 0}
              className="h-10 w-10 rounded-full bg-white/10 backdrop-blur grid place-items-center text-white hover:bg-white/20 disabled:opacity-30 transition-all"
            >
              <ChevronUp size={20} />
            </button>
            <button
              onClick={() => goTo(activeIndex + 1)}
              disabled={activeIndex >= allItems.length - 1}
              className="h-10 w-10 rounded-full bg-white/10 backdrop-blur grid place-items-center text-white hover:bg-white/20 disabled:opacity-30 transition-all"
            >
              <ChevronDown size={20} />
            </button>
          </div>

          {/* Counter */}
          <div className="absolute top-4 right-4 text-xs text-white/40 z-10">
            {activeIndex + 1} / {allItems.length}
          </div>
        </main>
      </div>
    </div>
  );
}

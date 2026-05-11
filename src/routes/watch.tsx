import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, useQuery } from "@tanstack/react-query";
import { Suspense, useEffect, useState } from "react";
import { z } from "zod";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { VideoCard } from "@/components/VideoCard";
import { SkeletonCard } from "@/components/SkeletonCard";
import { Spinner } from "@/components/Shuriken";
import { Equalizer } from "@/components/Equalizer";
import { AdSlot } from "@/components/AdSlot";
import { getVideo, getComments, getRelated } from "@/lib/youtube.functions";
import { formatViews, timeAgo } from "@/lib/format";
import { trackWatch } from "@/hooks/use-watch-history";

const searchSchema = z.object({
  v: fallback(z.string(), "").default(""),
});

export const Route = createFileRoute("/watch")({
  validateSearch: zodValidator(searchSchema),
  loaderDeps: ({ search: { v } }) => ({ v }),
  loader: ({ context, deps }) => {
    if (deps.v) {
      context.queryClient.ensureQueryData({
        queryKey: ["video", deps.v],
        queryFn: () => getVideo({ data: { id: deps.v } }),
      });
    }
  },
  component: WatchPage,
});

function ActionButton({
  label, icon, onClick, href, variant = "default",
}: {
  label: string; icon: string; onClick?: () => void; href?: string;
  variant?: "default" | "primary" | "danger";
}) {
  const cls =
    "inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs font-bold hover:border-primary hover:text-primary transition-colors " +
    (variant === "primary" ? "bg-[var(--gradient-primary)] text-white border-transparent hover:text-white " : "") +
    (variant === "danger" ? "hover:text-destructive hover:border-destructive " : "");
  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        <span>{icon}</span> <span>{label}</span>
      </a>
    );
  }
  return (
    <button onClick={onClick} className={cls}>
      <span>{icon}</span> <span>{label}</span>
    </button>
  );
}

function VideoMain() {
  const { v } = Route.useSearch();
  const { data } = useSuspenseQuery({
    queryKey: ["video", v],
    queryFn: () => getVideo({ data: { id: v } }),
  });
  const video = data.item;
  const [showFull, setShowFull] = useState(false);

  useEffect(() => {
    if (!video) return;
    trackWatch({
      id: v,
      title: video.snippet.title,
      channelTitle: video.snippet.channelTitle,
      thumb: video.snippet.thumbnails?.medium?.url || video.snippet.thumbnails?.high?.url,
      tags: video.snippet.tags,
    });
  }, [v, video]);

  if (!video) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center">
        <div className="text-6xl">🎴</div>
        <p className="mt-4 text-muted-foreground">Video not found.</p>
        <Link to="/" className="mt-4 inline-block text-primary underline">Go home</Link>
      </div>
    );
  }

  const ytWatchUrl = `https://www.youtube.com/watch?v=${v}`;
  const downloadUrl = `https://yt1s.com/youtube/${v}`;

  return (
    <div>
      <div className="anime-border overflow-hidden rounded-xl shadow-[var(--shadow-glow)]">
        <div className="relative aspect-video bg-black">
          <iframe
            key={v}
            src={`https://www.youtube.com/embed/${v}?autoplay=1&rel=0&modestbranding=1&iv_load_policy=3&color=white&controls=1`}
            title={video.snippet.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
            className="absolute inset-0 h-full w-full border-0"
          />
        </div>
      </div>

      <h1 className="mt-4 font-display text-2xl font-bold leading-tight md:text-3xl">{video.snippet.title}</h1>

      <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
        <span>{formatViews(video.statistics?.viewCount)} views</span>
        <span>·</span>
        <span>{timeAgo(video.snippet.publishedAt)}</span>
        <Equalizer />
      </div>

      {/* Action bar */}
      <div className="mt-3 flex flex-wrap gap-2">
        <ActionButton
          label={`Like  ${formatViews(video.statistics?.likeCount)}`}
          icon="👍"
          href={ytWatchUrl}
        />
        <ActionButton label="Dislike" icon="👎" href={ytWatchUrl} />
        <ActionButton
          label="Share"
          icon="↗"
          onClick={() => {
            if (typeof navigator !== "undefined" && navigator.share) {
              navigator.share({ title: video.snippet.title, url: window.location.href }).catch(() => {});
            } else if (typeof navigator !== "undefined") {
              navigator.clipboard?.writeText(window.location.href);
              alert("Link copied!");
            }
          }}
        />
        <ActionButton label="Download" icon="⬇️" href={downloadUrl} variant="primary" />
        <ActionButton label="Watch on YouTube" icon="▶️" href={ytWatchUrl} />
      </div>

      <p className="mt-2 text-[10px] text-muted-foreground/70">
        Like / Dislike redirect to YouTube — AnimeTube has no login, so you can interact with your own account safely.
      </p>

      <div className="anime-border mt-4 flex items-center gap-3 rounded-xl bg-card p-4">
        <Link to="/channel/$channelId" params={{ channelId: video.snippet.channelId }} className="grid h-12 w-12 place-items-center rounded-full bg-[var(--gradient-primary)] font-bold text-white">
          {video.snippet.channelTitle?.[0] || "?"}
        </Link>
        <div className="flex-1">
          <Link to="/channel/$channelId" params={{ channelId: video.snippet.channelId }} className="font-bold text-foreground hover:text-primary">
            {video.snippet.channelTitle}
          </Link>
        </div>
      </div>

      <div className="anime-border mt-4 rounded-xl bg-card p-4">
        <p className={`whitespace-pre-wrap text-sm text-muted-foreground ${showFull ? "" : "line-clamp-3"}`}>
          {video.snippet.description}
        </p>
        <button onClick={() => setShowFull((s) => !s)} className="mt-2 text-xs font-bold text-primary hover:underline">
          {showFull ? "Show Less" : "Show More"}
        </button>
        {video.snippet.tags?.length ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {video.snippet.tags.slice(0, 12).map((t: string) => (
              <Link key={t} to="/search" search={{ q: t }} className="anime-pill rounded-full px-3 py-1 text-xs">#{t}</Link>
            ))}
          </div>
        ) : null}
      </div>

      <div className="mt-4">
        <AdSlot id="ad-watch-below" size="leaderboard" />
      </div>

      <Comments videoId={v} />
    </div>
  );
}

function Comments({ videoId }: { videoId: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ["comments", videoId],
    queryFn: () => getComments({ data: { videoId } }),
    staleTime: 5 * 60 * 1000,
  });
  return (
    <section className="mt-6">
      <h2 className="font-display text-xl font-bold flex items-center gap-2">
        <span>💬</span> <span className="text-gradient">Comments</span>
      </h2>
      {isLoading && <Spinner />}
      {data?.disabled && <p className="mt-3 text-sm text-muted-foreground">Comments are disabled for this video.</p>}
      <div className="mt-4 space-y-4">
        {data?.items?.map((c: any) => {
          const s = c.snippet?.topLevelComment?.snippet;
          if (!s) return null;
          return (
            <div key={c.id} className="anime-border flex gap-3 rounded-xl bg-card p-4">
              <img src={s.authorProfileImageUrl} alt={s.authorDisplayName} className="h-10 w-10 rounded-full" loading="lazy" />
              <div className="flex-1">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-bold text-foreground">{s.authorDisplayName}</span>
                  <span className="text-xs text-muted-foreground">{timeAgo(s.publishedAt)}</span>
                </div>
                <p className="mt-1 text-sm text-foreground" dangerouslySetInnerHTML={{ __html: s.textDisplay }} />
                <div className="mt-2 flex gap-3 text-xs text-muted-foreground">
                  <span>👍 {formatViews(s.likeCount)}</span>
                  <a
                    href={`https://www.youtube.com/watch?v=${videoId}&lc=${c.id}`}
                    target="_blank" rel="noopener noreferrer"
                    className="hover:text-primary"
                  >
                    Reply on YouTube
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function Related() {
  const { v } = Route.useSearch();
  const { data: videoData } = useQuery({
    queryKey: ["video", v],
    queryFn: () => getVideo({ data: { id: v } }),
    enabled: !!v,
  });
  const q = videoData?.item?.snippet?.title?.split(" ").slice(0, 4).join(" ") || "anime";
  const { data, isLoading } = useQuery({
    queryKey: ["related", v, q],
    queryFn: () => getRelated({ data: { q, excludeId: v } }),
    enabled: !!videoData,
  });
  return (
    <aside>
      <h2 className="mb-4 font-display text-lg font-bold flex items-center gap-2">
        <span>⏭</span> <span className="text-gradient">Up Next</span>
      </h2>
      <div className="space-y-2">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} compact />)
          : data?.items?.map((v: any) => <VideoCard key={v.id} video={v} variant="compact" />)}
      </div>
      <div className="mt-4">
        <AdSlot id="ad-watch-side" sticky />
      </div>
    </aside>
  );
}

function WatchPage() {
  const { v } = Route.useSearch();
  if (!v) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 grid place-items-center py-32 text-center">
            <div>
              <div className="text-6xl">🎬</div>
              <p className="mt-4 text-muted-foreground">No video selected.</p>
              <Link to="/" className="mt-3 text-primary underline">Browse trending</Link>
            </div>
          </main>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 min-w-0 px-3 py-4 sm:px-4 sm:py-6 lg:grid lg:grid-cols-[1fr_380px] lg:gap-6">
          <Suspense fallback={<div className="aspect-video skeleton rounded-xl" />}>
            <VideoMain />
          </Suspense>
          <Related />
        </main>
      </div>
    </div>
  );
}

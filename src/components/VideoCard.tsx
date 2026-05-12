import { formatDuration, formatViews, timeAgo, type YTVideo } from "@/lib/format";
import { Link } from "@tanstack/react-router";
import { useState } from "react";

function Thumb({ src, alt }: { src: string; alt: string }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <>
      {!loaded && <div className="skeleton absolute inset-0 rounded-none" />}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={`h-full w-full object-cover transition-all duration-500 group-hover:scale-105 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </>
  );
}

export function VideoCard({ video, variant = "grid" }: { video: YTVideo; variant?: "grid" | "compact" }) {
  const id = typeof video.id === "string" ? video.id : (video as any).id?.videoId;
  const thumb =
    video.snippet.thumbnails?.high?.url ||
    video.snippet.thumbnails?.medium?.url ||
    video.snippet.thumbnails?.maxres?.url;
  const duration = formatDuration(video.contentDetails?.duration);

  if (variant === "compact") {
    return (
      <Link
        to="/watch"
        search={{ v: id }}
        className="group flex gap-3 rounded-lg p-2 hover:bg-surface transition-colors"
      >
        <div className="relative h-[54px] w-24 shrink-0 overflow-hidden rounded-md bg-muted">
          {thumb && <Thumb src={thumb} alt={video.snippet.title} />}
          {duration && (
            <span className="absolute bottom-1 right-1 rounded bg-black/80 px-1 py-px text-[9px] font-medium text-white">
              {duration}
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1 py-0.5">
          <h3 className="line-clamp-2 text-xs font-medium text-foreground group-hover:text-primary leading-snug transition-colors">
            {video.snippet.title}
          </h3>
          <p className="mt-1 truncate text-[11px] text-muted-foreground">{video.snippet.channelTitle}</p>
          <p className="text-[11px] text-muted-foreground/70">
            {formatViews(video.statistics?.viewCount)} · {timeAgo(video.snippet.publishedAt)}
          </p>
        </div>
      </Link>
    );
  }

  return (
    <Link to="/watch" search={{ v: id }} className="group block">
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
        {thumb && <Thumb src={thumb} alt={video.snippet.title} />}
        {duration && (
          <span className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-[11px] font-medium text-white">
            {duration}
          </span>
        )}
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
      </div>

      {/* Info */}
      <div className="mt-2.5 flex gap-2.5">
        {/* Channel avatar placeholder */}
        <div className="h-8 w-8 shrink-0 rounded-full bg-primary/20 grid place-items-center text-xs font-bold text-primary mt-0.5">
          {video.snippet.channelTitle?.[0]?.toUpperCase() || "A"}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 text-sm font-medium text-foreground group-hover:text-primary leading-snug transition-colors">
            {video.snippet.title}
          </h3>
          <p className="mt-1 truncate text-xs text-muted-foreground">{video.snippet.channelTitle}</p>
          <p className="text-xs text-muted-foreground/70">
            {formatViews(video.statistics?.viewCount)} views · {timeAgo(video.snippet.publishedAt)}
          </p>
        </div>
      </div>
    </Link>
  );
}

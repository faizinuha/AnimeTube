import { Link } from "@tanstack/react-router";
import { formatViews, formatDuration, timeAgo, type YTVideo } from "@/lib/format";

export function VideoCard({ video, variant = "grid" }: { video: YTVideo; variant?: "grid" | "compact" }) {
  const id = typeof video.id === "string" ? video.id : (video as any).id?.videoId;
  const thumb =
    video.snippet.thumbnails?.maxres?.url ||
    video.snippet.thumbnails?.high?.url ||
    video.snippet.thumbnails?.medium?.url;
  const duration = formatDuration(video.contentDetails?.duration);

  if (variant === "compact") {
    return (
      <Link
        to="/watch"
        search={{ v: id }}
        className="group flex gap-3 rounded-lg p-2 transition-all hover:bg-card hover:border-l-4 hover:border-primary hover:pl-3 hover:shadow-[var(--shadow-glow)]"
      >
        <div className="relative h-20 w-36 shrink-0 overflow-hidden rounded-lg bg-muted">
          {thumb && (
            <img src={thumb} alt={video.snippet.title} loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
          )}
          {duration && (
            <span className="absolute bottom-1 right-1 rounded bg-black/85 px-1.5 py-0.5 text-[10px] font-semibold text-white">
              {duration}
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 text-sm font-semibold text-foreground group-hover:text-primary">
            {video.snippet.title}
          </h3>
          <p className="mt-1 truncate text-xs text-muted-foreground">{video.snippet.channelTitle}</p>
          <p className="text-xs text-muted-foreground">
            {formatViews(video.statistics?.viewCount)} views · {timeAgo(video.snippet.publishedAt)}
          </p>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to="/watch"
      search={{ v: id }}
      className="group anime-border block overflow-hidden rounded-xl bg-card transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[var(--shadow-glow-strong)]"
    >
      <div className="relative aspect-video overflow-hidden bg-muted">
        {thumb && (
          <img src={thumb} alt={video.snippet.title} loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
        )}
        <div className="glitch-stripes pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        {duration && (
          <span className="absolute bottom-2 right-2 rounded bg-black/85 px-2 py-0.5 text-xs font-bold text-white">
            {duration}
          </span>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
      <div className="p-3">
        <h3 className="line-clamp-2 min-h-[2.6em] text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
          {video.snippet.title}
        </h3>
        <p className="mt-1 truncate text-xs text-muted-foreground">{video.snippet.channelTitle}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {formatViews(video.statistics?.viewCount)} views · {timeAgo(video.snippet.publishedAt)}
        </p>
      </div>
    </Link>
  );
}

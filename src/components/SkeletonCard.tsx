export function SkeletonCard({ compact = false, index = 0 }: { compact?: boolean; index?: number }) {
  const delay = Math.min(index * 0.04, 0.3);

  if (compact) {
    return (
      <div className="flex gap-2 p-2 animate-fade-in" style={{ animationDelay: `${delay}s` }}>
        <div className="skeleton shrink-0 rounded-lg" style={{ width: 168, aspectRatio: "16/9" }} />
        <div className="flex-1 space-y-2 pt-0.5">
          <div className="skeleton h-3 w-full rounded" />
          <div className="skeleton h-3 w-3/4 rounded" />
          <div className="skeleton h-2.5 w-1/2 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ animationDelay: `${delay}s` }}>
      {/* Thumbnail */}
      <div className="skeleton w-full rounded-xl" style={{ aspectRatio: "16/9" }} />
      {/* Info */}
      <div className="mt-3 flex gap-3">
        <div className="skeleton h-9 w-9 rounded-full shrink-0" />
        <div className="flex-1 space-y-2 pt-0.5">
          <div className="skeleton h-3.5 w-full rounded" />
          <div className="skeleton h-3.5 w-4/5 rounded" />
          <div className="skeleton h-3 w-1/2 rounded" />
          <div className="skeleton h-3 w-1/3 rounded" />
        </div>
      </div>
    </div>
  );
}

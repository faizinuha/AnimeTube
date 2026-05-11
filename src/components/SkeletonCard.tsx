export function SkeletonCard({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <div className="flex gap-3">
        <div className="skeleton h-20 w-36 shrink-0 rounded-lg" />
        <div className="flex-1 space-y-2">
          <div className="skeleton h-3 w-full rounded" />
          <div className="skeleton h-3 w-2/3 rounded" />
          <div className="skeleton h-3 w-1/2 rounded" />
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-3">
      <div className="skeleton aspect-video w-full rounded-xl" />
      <div className="skeleton h-4 w-5/6 rounded" />
      <div className="skeleton h-3 w-1/2 rounded" />
    </div>
  );
}

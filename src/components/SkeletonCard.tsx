export function SkeletonCard({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <div className="flex gap-3 p-2">
        <div className="skeleton h-[54px] w-24 shrink-0 rounded-md" />
        <div className="flex-1 space-y-2 py-0.5">
          <div className="skeleton h-3 w-full rounded" />
          <div className="skeleton h-3 w-3/4 rounded" />
          <div className="skeleton h-2.5 w-1/2 rounded" />
        </div>
      </div>
    );
  }
  return (
    <div>
      <div className="skeleton aspect-video w-full rounded-lg" />
      <div className="mt-2.5 flex gap-2.5">
        <div className="skeleton h-8 w-8 shrink-0 rounded-full" />
        <div className="flex-1 space-y-2 pt-0.5">
          <div className="skeleton h-3.5 w-full rounded" />
          <div className="skeleton h-3 w-2/3 rounded" />
          <div className="skeleton h-2.5 w-1/3 rounded" />
        </div>
      </div>
    </div>
  );
}

import { useEffect, useRef, useState } from "react";

type InfiniteScrollProps = {
  onLoadMore: () => void;
  hasMore: boolean;
  loading: boolean;
  children: React.ReactNode;
  threshold?: number;
};

export function InfiniteScroll({
  onLoadMore,
  hasMore,
  loading,
  children,
  threshold = 300,
}: InfiniteScrollProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    if (!hasMore || loading || triggered) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setTriggered(true);
          onLoadMore();
          setTimeout(() => setTriggered(false), 1000);
        }
      },
      { rootMargin: `${threshold}px` }
    );

    const sentinel = sentinelRef.current;
    if (sentinel) observer.observe(sentinel);

    return () => {
      if (sentinel) observer.unobserve(sentinel);
    };
  }, [hasMore, loading, onLoadMore, threshold, triggered]);

  return (
    <>
      {children}
      {hasMore && <div ref={sentinelRef} className="h-4" />}
    </>
  );
}

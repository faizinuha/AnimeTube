import { AdSlot } from "@/components/AdSlot";
import { InfiniteScroll } from "@/components/InfiniteScroll";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { SkeletonCard } from "@/components/SkeletonCard";
import { VideoCard } from "@/components/VideoCard";
import { searchVideos } from "@/lib/youtube.functions";
import { useInfiniteQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/shorts")({ component: ShortsPage });

function ShortsPage() {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ["shorts-page-infinite"],
    queryFn: ({ pageParam }) => searchVideos({ q: "anime shorts amv edit", videoDuration: "short", order: "viewCount", maxResults: 24, pageToken: pageParam as string | undefined }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last: any) => last.nextPageToken ?? undefined,
    staleTime: 5 * 60 * 1000,
  });
  const allItems = data?.pages.flatMap((p: any) => p.items) ?? [];
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 min-w-0 px-4 py-6">
          <div className="mx-auto max-w-[1600px]">
            <header className="mb-6 flex items-end gap-3">
              <h1 className="font-display text-3xl font-black"><span className="mr-2">⚡</span><span className="text-gradient">Shorts</span></h1>
              <span className="text-xs text-muted-foreground pb-1">Quick clips · under 4 min</span>
            </header>
            <InfiniteScroll onLoadMore={() => fetchNextPage()} hasMore={!!hasNextPage} loading={isFetchingNextPage}>
              <div className="grid gap-x-4 gap-y-8 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {isLoading ? Array.from({ length: 18 }).map((_, i) => <SkeletonCard key={i} />)
                  : allItems.flatMap((v: any, i: number) => {
                      const card = <VideoCard key={v.id + i} video={v} />;
                      if (i > 0 && i % 11 === 0) return [card, <div key={"ad" + i} className="col-span-1"><AdSlot id={`ad-shorts-${i}`} /></div>];
                      return [card];
                    })}
                {isFetchingNextPage && Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={"sk" + i} />)}
              </div>
            </InfiniteScroll>
          </div>
          </div>
        </main>
      </div>
    </div>
  );
}

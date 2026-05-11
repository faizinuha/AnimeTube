import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { VideoCard } from "@/components/VideoCard";
import { SkeletonCard } from "@/components/SkeletonCard";
import { AdSlot } from "@/components/AdSlot";
import { searchVideos } from "@/lib/youtube.functions";

export const Route = createFileRoute("/shorts")({
  head: () => ({
    meta: [
      { title: "Anime Shorts — AnimeTube" },
      { name: "description", content: "Quick anime clips, edits and AMV shorts under 4 minutes." },
    ],
  }),
  component: ShortsPage,
});

function ShortsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["shorts"],
    queryFn: () => searchVideos({ data: { q: "anime shorts amv edit", videoDuration: "short", order: "viewCount", maxResults: 32 } }),
    staleTime: 5 * 60 * 1000,
  });
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
            <div className="grid gap-x-4 gap-y-8 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {isLoading || !data
                ? Array.from({ length: 18 }).map((_, i) => <SkeletonCard key={i} />)
                : data.items.flatMap((v: any, i: number) => {
                    const card = <VideoCard key={v.id} video={v} />;
                    if (i === 9) return [card, <div key="ad" className="col-span-1"><AdSlot id="ad-shorts-feed" /></div>];
                    return [card];
                  })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

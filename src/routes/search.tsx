import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { VideoCard } from "@/components/VideoCard";
import { SkeletonCard } from "@/components/SkeletonCard";
import { AdSlot } from "@/components/AdSlot";
import { searchVideos } from "@/lib/youtube.functions";
import { useNavigate } from "@tanstack/react-router";

const searchSchema = z.object({
  q: fallback(z.string(), "").default(""),
  order: fallback(z.enum(["relevance", "date", "viewCount", "rating"]), "viewCount").default("viewCount"),
  videoDuration: fallback(z.enum(["any", "short", "medium", "long"]), "any").default("any"),
});

export const Route = createFileRoute("/search")({
  validateSearch: zodValidator(searchSchema),
  component: SearchPage,
});

function SearchPage() {
  const { q, order, videoDuration } = Route.useSearch();
  const navigate = useNavigate({ from: "/search" });
  const { data, isLoading } = useQuery({
    queryKey: ["search", q, order, videoDuration],
    queryFn: () => searchVideos({ data: { q: q || "anime", order, videoDuration, maxResults: 24 } }),
    enabled: !!q,
    staleTime: 5 * 60 * 1000,
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 min-w-0 px-3 py-4 sm:px-4 sm:py-6">
          <div className="mx-auto max-w-[1600px]">
            <h1 className="rainbow-underline inline-block font-display text-2xl sm:text-3xl font-black">
              Results for: <span className="text-gradient">{q || "—"}</span>
            </h1>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Sort:</label>
              <select
                value={order}
                onChange={(e) => navigate({ search: (p: any) => ({ ...p, order: e.target.value as any }) })}
                className="anime-border rounded-full bg-card px-4 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="relevance">Relevance</option>
                <option value="date">Upload Date</option>
                <option value="viewCount">View Count</option>
                <option value="rating">Rating</option>
              </select>
              <label className="ml-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Duration:</label>
              <select
                value={videoDuration}
                onChange={(e) => navigate({ search: (p: any) => ({ ...p, videoDuration: e.target.value as any }) })}
                className="anime-border rounded-full bg-card px-4 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="any">Any</option>
                <option value="short">Short (&lt; 4 min)</option>
                <option value="medium">Medium (4–20 min)</option>
                <option value="long">Long (&gt; 20 min)</option>
              </select>
            </div>

            <div className="mt-6 grid gap-x-4 gap-y-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {isLoading
                ? Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} />)
                : data?.items?.map((v: any) => <VideoCard key={v.id} video={v} />)}
            </div>

            {!isLoading && (data?.items?.length || 0) === 0 && q && (
              <div className="py-16 text-center">
                <div className="text-6xl">🍥</div>
                <p className="mt-4 text-muted-foreground">No results found for "{q}"</p>
              </div>
            )}

            {(data?.items?.length || 0) >= 12 && (
              <div className="mt-8"><AdSlot id="ad-search-bottom" size="leaderboard" /></div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

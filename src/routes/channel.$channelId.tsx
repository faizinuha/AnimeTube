import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { VideoCard } from "@/components/VideoCard";
import { SkeletonCard } from "@/components/SkeletonCard";
import { getChannel, searchVideos } from "@/lib/youtube.functions";
import { formatViews } from "@/lib/format";

export const Route = createFileRoute("/channel/$channelId")({
  component: ChannelPage,
});

function ChannelPage() {
  const { channelId } = Route.useParams();
  const [tab, setTab] = useState<"videos" | "about">("videos");
  const { data: chData } = useQuery({
    queryKey: ["channel", channelId],
    queryFn: () => getChannel({ data: { id: channelId } }),
    staleTime: 10 * 60 * 1000,
  });
  const { data: vidsData, isLoading } = useQuery({
    queryKey: ["channel-videos", channelId],
    queryFn: () => searchVideos({ data: { q: "", channelId, order: "date", maxResults: 24 } }),
    staleTime: 5 * 60 * 1000,
  });
  const ch = chData?.channel;
  const banner = ch?.brandingSettings?.image?.bannerExternalUrl;
  const avatar = ch?.snippet?.thumbnails?.high?.url || ch?.snippet?.thumbnails?.default?.url;
  const ytChannelUrl = `https://www.youtube.com/channel/${channelId}`;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 min-w-0">
          <div
            className="relative h-36 w-full md:h-56"
            style={{ background: banner ? `url(${banner}) center/cover` : "var(--gradient-primary)" }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
          </div>
          <div className="mx-auto -mt-12 max-w-[1400px] px-4">
            <div className="anime-border flex flex-col items-start gap-4 rounded-2xl bg-card p-6 md:flex-row md:items-center">
              <div className="grid h-24 w-24 place-items-center overflow-hidden rounded-full bg-[var(--gradient-primary)] text-3xl font-bold text-white shadow-[var(--shadow-glow)]">
                {avatar ? <img src={avatar} alt="" className="h-full w-full object-cover" /> : ch?.snippet?.title?.[0]}
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="font-display text-3xl font-black text-gradient">{ch?.snippet?.title || "Channel"}</h1>
                <p className="text-sm text-muted-foreground">
                  {formatViews(ch?.statistics?.videoCount)} videos
                </p>
                <p className="mt-2 line-clamp-2 max-w-2xl text-sm text-muted-foreground">{ch?.snippet?.description}</p>
              </div>
              <a
                href={ytChannelUrl}
                target="_blank" rel="noopener noreferrer"
                className="rounded-full border border-border bg-card px-5 py-2 text-xs font-bold hover:border-primary hover:text-primary"
              >
                Open on YouTube ↗
              </a>
            </div>

            <div className="mt-6 flex gap-2 border-b border-border">
              {(["videos", "about"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-4 py-2 text-sm font-bold uppercase tracking-wider transition-colors ${
                    tab === t ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="py-6">
              {tab === "videos" ? (
                <div className="grid gap-x-4 gap-y-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {isLoading
                    ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
                    : vidsData?.items?.map((v: any) => <VideoCard key={v.id} video={v} />)}
                </div>
              ) : (
                <div className="anime-border max-w-3xl rounded-xl bg-card p-6">
                  <p className="whitespace-pre-wrap text-sm text-muted-foreground">{ch?.snippet?.description || "No description."}</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

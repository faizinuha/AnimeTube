import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { DisclaimerModal } from "@/components/DisclaimerModal";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-8xl font-black text-gradient">404</h1>
        <h2 className="mt-4 font-display text-2xl font-bold">Senpai... this page doesn't exist</h2>
        <p className="mt-2 text-sm text-muted-foreground">The episode you're looking for isn't in the archive.</p>
        <Link to="/" className="mt-6 inline-flex items-center justify-center rounded-full bg-[var(--gradient-primary)] px-6 py-2.5 text-sm font-bold text-white shadow-[var(--shadow-glow)]">
          ▶ Back home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error }: { error: Error }) {
  console.error(error);
  const quota = /quota|429|403/i.test(error?.message || "");
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <div className="text-6xl">😴</div>
        <h1 className="mt-4 font-display text-2xl font-bold">
          {quota ? "API-chan is tired!" : "Something broke"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {quota ? "We've hit the YouTube quota for now. Come back later." : error?.message || "Unknown error"}
        </p>
        <Link to="/" className="mt-6 inline-flex rounded-full bg-[var(--gradient-primary)] px-6 py-2.5 text-sm font-bold text-white shadow-[var(--shadow-glow)]">
          Go home
        </Link>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "AnimeTube — Watch Anime. Live the Story." },
      { name: "description", content: "Stream the best anime videos. Trending series, isekai, shonen, mecha and more on AnimeTube." },
      { name: "theme-color", content: "#0a0a0f" },
      { property: "og:title", content: "AnimeTube — Watch Anime. Live the Story." },
      { property: "og:description", content: "Premium anime video streaming, powered by YouTube." },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <DisclaimerModal />
      <Outlet />
    </QueryClientProvider>
  );
}

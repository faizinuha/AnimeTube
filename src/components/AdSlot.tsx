import { useEffect, useRef } from "react";

// Google AdSense — ca-pub-3161683709161579
// All ad slots are served by Google's network.
// Google automatically filters out gambling, adult, and prohibited content
// based on the site's content policy and AdSense program policies.

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

type AdSize = "leaderboard" | "rectangle" | "inline";

const SIZE_MAP: Record<AdSize, { slot: string; format: string; style: React.CSSProperties }> = {
  // 728×90 leaderboard — used between sections
  leaderboard: {
    slot: "auto",
    format: "auto",
    style: { display: "block", minHeight: 90 },
  },
  // 300×250 rectangle — used in sidebar / feed
  rectangle: {
    slot: "auto",
    format: "auto",
    style: { display: "block", minHeight: 250 },
  },
  // Responsive inline — used inside content grids
  inline: {
    slot: "auto",
    format: "fluid",
    style: { display: "block" },
  },
};

export function AdSlot({
  id,
  size = "rectangle",
  className = "",
  sticky = false,
}: {
  id: string;
  size?: AdSize;
  label?: string;
  sticky?: boolean;
  className?: string;
}) {
  const adRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);
  const { style, format } = SIZE_MAP[size];

  useEffect(() => {
    if (pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      // AdSense not loaded yet — silently ignore
    }
  }, []);

  return (
    <aside
      aria-label="Advertisement"
      data-ad-id={id}
      className={`overflow-hidden rounded-xl ${sticky ? "sticky top-20" : ""} ${className}`}
    >
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={style}
        data-ad-client="ca-pub-3161683709161579"
        data-ad-slot="auto"
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </aside>
  );
}

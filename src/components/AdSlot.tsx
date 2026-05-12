import { useEffect, useRef, useState } from "react";

// Google AdSense — ca-pub-3161683709161579
// Slots are hidden until Google fills them to avoid blank white boxes.

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

type AdSize = "leaderboard" | "rectangle" | "inline";

const FORMAT_MAP: Record<AdSize, string> = {
  leaderboard: "auto",
  rectangle: "auto",
  inline: "fluid",
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
  const insRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);
  // Track whether Google has filled the slot
  const [filled, setFilled] = useState(false);

  useEffect(() => {
    if (pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      // AdSense script not loaded yet
    }

    // Check after a short delay if Google filled the slot
    // adsbygoogle sets data-ad-status="filled" or "unfilled"
    const timer = setTimeout(() => {
      const status = insRef.current?.getAttribute("data-ad-status");
      if (status === "filled") setFilled(true);
      // If unfilled or no status, stay hidden — no blank box
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Hide completely if not filled — no blank white space
  if (!filled && typeof window !== "undefined" && pushed.current) {
    // Still render but invisible so Google can fill it
  }

  return (
    <aside
      aria-label="Advertisement"
      data-ad-id={id}
      className={`overflow-hidden rounded-xl transition-all ${sticky ? "sticky top-20" : ""} ${className}`}
      // Hide the container until Google fills it
      style={{ display: filled ? "block" : "none" }}
    >
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-3161683709161579"
        data-ad-slot="auto"
        data-ad-format={FORMAT_MAP[size]}
        data-full-width-responsive="true"
      />
    </aside>
  );
}

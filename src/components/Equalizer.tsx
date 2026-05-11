/**
 * Decorative animated equalizer bars (CSS-only) shown next to the video.
 * Pure UI — does not access the audio stream (cross-origin iframe blocks that).
 */
export function Equalizer({ playing = true, bars = 20 }: { playing?: boolean; bars?: number }) {
  return (
    <div
      aria-hidden
      className="flex h-10 items-end gap-[3px] rounded-lg border border-border bg-card/60 px-3 py-2"
      title="Now playing"
    >
      {Array.from({ length: bars }).map((_, i) => (
        <span
          key={i}
          className="block w-[3px] rounded-sm bg-[var(--gradient-primary)]"
          style={{
            height: "100%",
            transformOrigin: "bottom",
            animation: playing
              ? `eq-bounce ${0.6 + ((i * 37) % 90) / 100}s ease-in-out ${(i * 53) % 400}ms infinite alternate`
              : "none",
            opacity: playing ? 1 : 0.3,
          }}
        />
      ))}
      <style>{`
        @keyframes eq-bounce {
          from { transform: scaleY(0.15); }
          to   { transform: scaleY(1);    }
        }
      `}</style>
    </div>
  );
}

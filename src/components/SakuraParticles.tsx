export function SakuraParticles({ count = 18 }: { count?: number }) {
  const petals = Array.from({ length: count });
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {petals.map((_, i) => {
        const left = (i * 53) % 100;
        const delay = (i * 1.7) % 14;
        const dur = 12 + ((i * 3) % 10);
        const drift = ((i % 5) - 2) * 40;
        const size = 8 + (i % 4) * 3;
        return (
          <span
            key={i}
            style={{
              left: `${left}%`,
              animationDelay: `${delay}s`,
              animationDuration: `${dur}s`,
              ["--drift" as any]: `${drift}px`,
              width: size,
              height: size,
            }}
            className="absolute -top-4 rounded-full"
          >
            <span
              style={{
                background: "radial-gradient(circle at 30% 30%, #ffd6e0, #e94560 70%, transparent)",
                filter: "blur(0.3px)",
                width: "100%",
                height: "100%",
                display: "block",
                borderRadius: "60% 40% 60% 40% / 50% 60% 40% 50%",
                animation: `sakura-fall ${dur}s linear ${delay}s infinite`,
                opacity: 0.85,
              }}
            />
          </span>
        );
      })}
    </div>
  );
}

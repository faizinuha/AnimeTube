export function Shuriken({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className="animate-spin-slow drop-shadow-[0_0_8px_oklch(0.65_0.21_18/0.6)]">
      <defs>
        <linearGradient id="sg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#e94560" />
          <stop offset="100%" stopColor="#533483" />
        </linearGradient>
      </defs>
      <path d="M32 4 L38 26 L60 32 L38 38 L32 60 L26 38 L4 32 L26 26 Z" fill="url(#sg)" stroke="white" strokeWidth="1" />
      <circle cx="32" cy="32" r="4" fill="#0a0a0f" stroke="white" />
    </svg>
  );
}

export function Spinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <Shuriken size={48} />
    </div>
  );
}

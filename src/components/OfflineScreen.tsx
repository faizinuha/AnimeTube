import { useEffect, useState } from "react";

export function OfflineScreen() {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    const update = () => setOffline(!navigator.onLine);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  if (!offline) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background/95 backdrop-blur-md px-6 text-center">
      <div className="anime-border rounded-3xl bg-card/80 p-10 max-w-sm w-full shadow-[var(--shadow-glow)]">
        <img
          src="/logo.jpg"
          alt="AnimeTube"
          className="mx-auto h-24 w-24 rounded-2xl object-cover shadow-[var(--shadow-glow)] mb-6"
        />
        <div className="text-5xl mb-4">📡</div>
        <h2 className="font-display text-2xl font-black text-gradient mb-2">
          Tidak Ada Internet
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Maaf, koneksi internetmu terputus.<br />
          Periksa Wi-Fi atau data selulermu, lalu coba lagi.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--gradient-primary)] px-6 py-2.5 text-sm font-bold text-white shadow-[var(--shadow-glow)] hover:shadow-[var(--shadow-glow-strong)] transition"
        >
          🔄 Coba Lagi
        </button>
      </div>
    </div>
  );
}

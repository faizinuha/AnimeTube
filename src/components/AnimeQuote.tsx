import { useEffect, useState } from "react";
import { ANIME_QUOTES } from "@/lib/constants";

export function AnimeQuote() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % ANIME_QUOTES.length), 8000);
    return () => clearInterval(t);
  }, []);
  const q = ANIME_QUOTES[i];
  return (
    <div className="anime-border rounded-xl bg-card p-5">
      <div className="mb-2 flex items-center gap-2">
        <span className="text-lg">✦</span>
        <h4 className="font-display text-sm font-bold uppercase tracking-[0.2em] text-gradient">Anime Quote</h4>
      </div>
      <p key={i} className="animate-fade-in text-sm italic leading-relaxed text-foreground">
        “{q.text}”
      </p>
      <p className="mt-2 text-xs text-muted-foreground">— {q.author}</p>
    </div>
  );
}

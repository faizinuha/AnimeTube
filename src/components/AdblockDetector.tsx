import { useEffect, useState } from "react";

/**
 * Detects adblock by trying to load a fake "ad" resource.
 * If it fails to load, adblock is likely active.
 */
async function detectAdblock(): Promise<boolean> {
  try {
    const res = await fetch("/ads.js", {
      method: "HEAD",
      cache: "no-store",
    });
    // If fetch succeeds (even 404), adblock is NOT blocking it
    return res.status === 404 ? false : false;
  } catch {
    // Network error = adblock blocked the request
    return true;
  }
}

// Alternative: inject a bait element and check if it got hidden
function detectAdblockByBait(): boolean {
  const bait = document.createElement("div");
  bait.className = "ad-banner ads adsbox doubleclick ad-placement";
  bait.style.cssText = "width:1px;height:1px;position:absolute;left:-9999px;top:-9999px;";
  document.body.appendChild(bait);
  const blocked = bait.offsetHeight === 0 || bait.offsetParent === null || window.getComputedStyle(bait).display === "none";
  document.body.removeChild(bait);
  return blocked;
}

const ANIME_ROASTS = [
  {
    title: "Oi, AdBlock-kun! 😤",
    msg: "AnimeTube gratis, bebas login, bebas bayar — iklannya juga gak ganggu. Masa iya masih adblock-in? Tega banget sih~ 😢",
    emoji: "🍥",
  },
  {
    title: "Nani?! AdBlock terdeteksi! 👀",
    msg: "Ini website anime GRATIS kak, bukan yang berbayar. Iklan kami yang nanggung server biar kamu bisa nonton sepuasnya. Whitelist dong~ 🙏",
    emoji: "😭",
  },
  {
    title: "AdBlock-chan ketahuan! 🔍",
    msg: "Kamu nonton video  gratis di sini, tapi iklannya di-block? Iklan kami bersih, bebas judol & pinjol. Tolong support AnimeTube ya~ 💖",
    emoji: "🎌",
  },
  {
    title: "Yare yare... AdBlock? 😮‍💨",
    msg: "AnimeTube: gratis, no login, no bayar. Satu-satunya cara kami hidup ya dari iklan. Masa itu pun di-block? Kasian amat server kami~ 😭",
    emoji: "⚔️",
  },
  {
    title: "Eh, AdBlock-san! 🫵",
    msg: "Kamu pakai AnimeTube gratis tiap hari, tapi iklan satu pun gak mau liat? Kami gak minta banyak kok, cukup whitelist aja~ onegaishimasu! 🥺",
    emoji: "🌸",
  },
];

export function AdblockDetector() {
  const [detected, setDetected] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [roast] = useState(() => ANIME_ROASTS[Math.floor(Math.random() * ANIME_ROASTS.length)]);

  useEffect(() => {
    // Check sessionStorage — don't show again if already dismissed this session
    if (sessionStorage.getItem("adblock-dismissed") === "1") return;

    // Wait a bit for page to load before checking
    const timer = setTimeout(() => {
      const baitDetected = detectAdblockByBait();
      if (baitDetected) {
        setDetected(true);
      } else {
        // Double-check with fetch
        detectAdblock().then((result) => {
          if (result) setDetected(true);
        });
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    setDismissed(true);
    sessionStorage.setItem("adblock-dismissed", "1");
  };

  if (!detected || dismissed) return null;

  return (
    <div
      className="fixed bottom-4 right-4 z-[9998] max-w-sm w-full animate-fade-in"
      role="dialog"
      aria-label="AdBlock detected"
    >
      <div className="anime-border rounded-2xl bg-card/95 backdrop-blur-md p-5 shadow-[var(--shadow-glow)]">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{roast.emoji}</span>
            <h3 className="font-display text-base font-black text-gradient">{roast.title}</h3>
          </div>
          <button
            onClick={dismiss}
            aria-label="Tutup"
            className="shrink-0 grid h-7 w-7 place-items-center rounded-full border border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors text-xs"
          >
            ✕
          </button>
        </div>

        {/* Message */}
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
          {roast.msg}
        </p>

        {/* Actions */}
        <div className="mt-4 flex gap-2">
          <a
            href="https://sociabuzz.com/zuax"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full bg-[var(--gradient-primary)] px-4 py-2 text-xs font-bold text-white shadow-[var(--shadow-glow)] hover:shadow-[var(--shadow-glow-strong)] transition"
          >
            ☕ Support kami
          </a>
          <button
            onClick={dismiss}
            className="flex-1 inline-flex items-center justify-center rounded-full border border-border bg-card px-4 py-2 text-xs font-semibold text-muted-foreground hover:border-primary hover:text-primary transition"
          >
            Sudah whitelist ✓
          </button>
        </div>

        {/* Bottom note */}
        <p className="mt-3 text-[10px] text-muted-foreground/60 text-center">
          Iklan kami 100% bebas judol, pinjol, dan konten berbahaya 🛡️
        </p>
      </div>
    </div>
  );
}

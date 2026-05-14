/**
 * use-watch-timer
 * ───────────────
 * Tracks total watch time per day (in seconds) while on the watch page.
 * Fires a health reminder at 5 hours, then every 1 hour after.
 *
 * Support toast is handled separately by use-session-timer (global, session-based).
 *
 * - Mobile (touch + Notification API granted) → native browser notification
 * - Desktop / permission denied               → sonner toast via onToast callback
 */

import { useEffect, useRef } from "react";

const TIMER_KEY      = "animetube:watch-timer:v1";
const THRESHOLD_SECS = 5 * 60 * 60; // 5 hours
const REPEAT_SECS    = 60 * 60;      // repeat every 1 hour after

type TimerStore = {
  date: string;           // "YYYY-MM-DD" — reset daily
  total: number;          // seconds watched today
  lastNotifiedAt: number; // seconds at which last health notification was sent
};

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function readStore(): TimerStore {
  if (typeof window === "undefined")
    return { date: todayStr(), total: 0, lastNotifiedAt: 0 };
  try {
    const raw = localStorage.getItem(TIMER_KEY);
    if (!raw) return { date: todayStr(), total: 0, lastNotifiedAt: 0 };
    const parsed: TimerStore = JSON.parse(raw);
    if (parsed.date !== todayStr())
      return { date: todayStr(), total: 0, lastNotifiedAt: 0 };
    return parsed;
  } catch {
    return { date: todayStr(), total: 0, lastNotifiedAt: 0 };
  }
}

function writeStore(s: TimerStore) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(TIMER_KEY, JSON.stringify(s));
  } catch { /* quota */ }
}

/** Detect if user is likely on a touch/mobile device */
function isMobile(): boolean {
  return (
    typeof window !== "undefined" &&
    ("ontouchstart" in window || navigator.maxTouchPoints > 0)
  );
}

/** Format seconds → "5 jam 3 menit" */
export function formatWatchTime(secs: number): string {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  if (h > 0 && m > 0) return `${h} jam ${m} menit`;
  if (h > 0) return `${h} jam`;
  return `${m} menit`;
}

/** Read current total watch time today (seconds) */
export function getTodayWatchTime(): number {
  return readStore().total;
}

// ── Health reminder messages ──────────────────────────────────────
const HEALTH_MESSAGES = [
  { title: "Istirahat dulu, senpai! 😴", body: "Kamu sudah nonton lebih dari 5 jam hari ini. Mata kamu butuh istirahat!" },
  { title: "Masih di sini? 👀",           body: "Sudah 6 jam nonton anime. Minum air dulu ya, jangan sampai dehidrasi!" },
  { title: "Ayo gerak dikit! 🏃",         body: "7 jam nonton — coba stretching sebentar biar badan nggak pegal." },
  { title: "Anime bisa nunggu! 🌙",       body: "Sudah nonton lama banget hari ini. Tidur yang cukup itu penting!" },
];

function getHealthMessage(totalSecs: number) {
  const hoursOver = Math.floor((totalSecs - THRESHOLD_SECS) / REPEAT_SECS);
  return HEALTH_MESSAGES[Math.min(hoursOver, HEALTH_MESSAGES.length - 1)];
}

// ── Native notification (mobile) ─────────────────────────────────
async function requestPermission(): Promise<NotificationPermission> {
  if (!("Notification" in window)) return "denied";
  if (Notification.permission !== "default") return Notification.permission;
  return await Notification.requestPermission();
}

function fireNativeHealthNotif(totalSecs: number) {
  const msg = getHealthMessage(totalSecs);
  try {
    new Notification(msg.title, {
      body: msg.body,
      icon: "/logo.jpg",
      badge: "/logo.jpg",
      tag: "animetube-health",
    });
  } catch { /* blocked */ }
}

/**
 * useWatchTimer
 *
 * Call inside the watch page component.
 * @param active  — true while video is mounted
 * @param onToast — called on desktop/no-permission for health reminder
 */
export function useWatchTimer(
  active: boolean,
  onToast: (msg: { title: string; body: string; totalSecs: number }) => void,
) {
  const intervalRef      = useRef<ReturnType<typeof setInterval> | null>(null);
  const permissionAsked  = useRef(false);

  // Ask notification permission once on mobile
  useEffect(() => {
    if (!active || permissionAsked.current || !isMobile()) return;
    if (!("Notification" in window)) return;
    if (Notification.permission === "default") {
      permissionAsked.current = true;
      const t = setTimeout(() => requestPermission(), 3000);
      return () => clearTimeout(t);
    }
  }, [active]);

  useEffect(() => {
    if (!active) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      const store = readStore();
      store.total += 1;

      // Health reminder at 5h, repeat every 1h
      const shouldNotify =
        store.total >= THRESHOLD_SECS &&
        store.total - store.lastNotifiedAt >= REPEAT_SECS;

      if (shouldNotify) {
        store.lastNotifiedAt = store.total;
        const msg = getHealthMessage(store.total);

        if (isMobile() && "Notification" in window && Notification.permission === "granted") {
          fireNativeHealthNotif(store.total);
        } else {
          onToast({ ...msg, totalSecs: store.total });
        }
      }

      writeStore(store);
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [active, onToast]);
}

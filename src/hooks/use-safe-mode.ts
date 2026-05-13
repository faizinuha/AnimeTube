import { useEffect, useState } from "react";

const KEY = "animetube:safemode";

function read(): boolean {
  if (typeof window === "undefined") return true;
  const v = localStorage.getItem(KEY);
  return v === null ? true : v === "1"; // default ON
}

let _safe = read();
const _listeners = new Set<(v: boolean) => void>();
let _onSafeModeChange: (() => void) | null = null;

export function registerSafeModeChangeCallback(cb: () => void) {
  _onSafeModeChange = cb;
}

export function getSafeMode(): boolean { return _safe; }

export function setSafeMode(value: boolean) {
  _safe = value;
  if (typeof window !== "undefined") localStorage.setItem(KEY, value ? "1" : "0");
  _listeners.forEach((l) => l(value));
  _onSafeModeChange?.();
}

export function useSafeMode() {
  const [safe, setSafe] = useState(read);
  useEffect(() => {
    _listeners.add(setSafe);
    return () => { _listeners.delete(setSafe); };
  }, []);
  return { safe, setSafeMode };
}

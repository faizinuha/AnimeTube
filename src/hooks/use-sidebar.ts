import { useEffect, useState } from "react";

let openState = false;
const listeners = new Set<(v: boolean) => void>();

export function setSidebarOpen(v: boolean) {
  openState = v;
  listeners.forEach((l) => l(v));
}

export function toggleSidebar() {
  setSidebarOpen(!openState);
}

export function useSidebar() {
  const [open, setOpen] = useState(openState);
  useEffect(() => {
    listeners.add(setOpen);
    return () => {
      listeners.delete(setOpen);
    };
  }, []);
  return { open, setOpen: setSidebarOpen, toggle: toggleSidebar };
}

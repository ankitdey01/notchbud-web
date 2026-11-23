"use client";

import * as React from "react";
import type Lenis from "lenis";
import "lenis/dist/lenis.css";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

// Buttery smooth wheel scrolling. Skipped entirely under
// prefers-reduced-motion — native instant scrolling stays.
export function LenisProvider({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let lenis: Lenis | null = null;
    let raf = 0;
    let cancelled = false;
    (async () => {
      const { default: Lenis } = await import("lenis");
      if (cancelled) return;
      lenis = new Lenis({ duration: 1.15, smoothWheel: true });
      window.__lenis = lenis;
      const loop = (time: number) => {
        lenis?.raf(time);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    })();
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      lenis?.destroy();
      if (window.__lenis === lenis) window.__lenis = undefined;
    };
  }, []);
  return <>{children}</>;
}

// Single scroll path for the whole site: Lenis when active, native fallback.
export function smoothScrollTo(target: number | HTMLElement, behavior: ScrollBehavior) {
  const lenis = typeof window !== "undefined" ? window.__lenis : undefined;
  if (lenis) {
    lenis.scrollTo(target, behavior === "auto" ? { immediate: true } : undefined);
    return;
  }
  if (typeof target === "number") window.scrollTo({ top: target, behavior });
  else target.scrollIntoView({ behavior, block: "start" });
}

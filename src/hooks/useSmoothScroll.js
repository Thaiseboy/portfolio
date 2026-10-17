import { useEffect } from "react";
import Lenis from "lenis";

// Smooth scrolling with Lenis, skipped when the visitor prefers reduced motion.
export function useSmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    const headerHeight = parseInt(
      window.getComputedStyle(document.documentElement).getPropertyValue("--header-height"),
      10,
    );
    const lenis = new Lenis({ autoRaf: true, anchors: { offset: -(headerHeight || 0) } });

    return () => lenis.destroy();
  }, []);
}

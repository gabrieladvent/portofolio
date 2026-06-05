import { ReactLenis } from "lenis/react";
import type { ReactNode } from "react";

/**
 * Smooth scroll wrapper, tinyPod-style (Lenis).
 * Wraps the whole app so scrolling feels "heavy & smooth",
 * which is the foundation for every scroll-driven effect beneath it.
 *
 * Note: make sure `html { scroll-behavior }` is NOT set to `smooth`
 * in CSS, since it would conflict with Lenis.
 */
export default function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1, // smaller = "heavier"/smoother (0–1)
        duration: 1.2,
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.5,
      }}
    >
      {children}
    </ReactLenis>
  );
}

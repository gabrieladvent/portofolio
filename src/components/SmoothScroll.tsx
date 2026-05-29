import { ReactLenis } from "lenis/react";
import type { ReactNode } from "react";

/**
 * Smooth scroll wrapper ala tinyPod (Lenis).
 * Bungkus seluruh app supaya scroll terasa "berat & mulus",
 * yang jadi fondasi semua efek scroll-driven di bawahnya.
 *
 * Catatan: pastikan `html { scroll-behavior }` TIDAK di-set ke `smooth`
 * di CSS, karena bakal bentrok dengan Lenis.
 */
export default function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1, // makin kecil makin "berat"/mulus (0–1)
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

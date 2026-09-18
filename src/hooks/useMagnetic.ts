import { useRef } from "react";
import { useMotionValue, useReducedMotion, useSpring } from "motion/react";

/**
 * Pulls an element a little way towards the pointer, then lets it settle back.
 *
 * The spring is what makes it read as weight rather than as the element simply
 * following the cursor: the pull arrives late and overshoots slightly, so the
 * button behaves like something with mass that was nudged.
 *
 * Only for pointers that can actually hover. On a touchscreen there is no
 * approach to react to — the first thing that happens is the tap — so the
 * listeners are never attached.
 */
export function useMagnetic<T extends HTMLElement>(strength = 0.25) {
    const ref = useRef<T>(null);
    const reduceMotion = useReducedMotion();

    const rawX = useMotionValue(0);
    const rawY = useMotionValue(0);
    const spring = { stiffness: 260, damping: 22, mass: 0.6 } as const;
    const x = useSpring(rawX, spring);
    const y = useSpring(rawY, spring);

    const enabled =
        !reduceMotion &&
        typeof window !== "undefined" &&
        window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    const handlers = enabled
        ? {
            onPointerMove: (event: React.PointerEvent<T>) => {
                const rect = event.currentTarget.getBoundingClientRect();
                rawX.set((event.clientX - (rect.left + rect.width / 2)) * strength);
                rawY.set((event.clientY - (rect.top + rect.height / 2)) * strength);
            },
            onPointerLeave: () => {
                rawX.set(0);
                rawY.set(0);
            },
        }
        : {};

    return { ref, style: enabled ? { x, y } : undefined, handlers };
}

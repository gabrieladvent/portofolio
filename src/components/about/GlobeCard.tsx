import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { useTheme } from "../../hooks/useTheme";
import { Crosshair, MapPin, Minus, Plus } from "lucide-react";
import type { GlobeHandle } from "./Globe";

const Globe = lazy(() => import("./Globe"));

const controlClass =
    "w-8 h-8 rounded-lg bg-white/85 dark:bg-zinc-800/85 backdrop-blur border border-black/[0.07] dark:border-white/10 shadow-sm flex items-center justify-center text-zinc-500 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-500/40 transition-colors";

export default function GlobeCard({ className = "" }: { className?: string }) {
    const ref = useRef<HTMLElement>(null);
    const globe = useRef<GlobeHandle | null>(null);
    const reduceMotion = useReducedMotion();
    const { theme } = useTheme();
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const element = ref.current;
        if (!element || reduceMotion) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.disconnect();
                }
            },
            { rootMargin: "300px" },
        );
        observer.observe(element);
        return () => observer.disconnect();
    }, [reduceMotion]);

    return (
        <motion.section
            ref={ref}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7 }}
            className={`relative rounded-3xl border border-black/[0.06] dark:border-white/[0.07] bg-white dark:bg-zinc-900 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_18px_40px_-28px_rgba(0,0,0,0.35)] overflow-hidden ${className}`}
        >
            <div className="absolute inset-0 cursor-grab active:cursor-grabbing">
                {visible && (
                    <Suspense fallback={null}>
                        <Globe handle={globe} dark={theme === "dark"} />
                    </Suspense>
                )}
            </div>

            {visible && (
                <div className="absolute top-4 right-4 flex flex-col gap-1.5">
                    <button
                        type="button"
                        onClick={() => globe.current?.zoomIn()}
                        aria-label="Zoom in"
                        title="Zoom in"
                        className={controlClass}
                    >
                        <Plus className="w-3.5 h-3.5" strokeWidth={2} />
                    </button>
                    <button
                        type="button"
                        onClick={() => globe.current?.zoomOut()}
                        aria-label="Zoom out"
                        title="Zoom out"
                        className={controlClass}
                    >
                        <Minus className="w-3.5 h-3.5" strokeWidth={2} />
                    </button>
                    <button
                        type="button"
                        onClick={() => globe.current?.reset()}
                        aria-label="Recentre on Yogyakarta"
                        title="Recentre on Yogyakarta"
                        className={controlClass}
                    >
                        <Crosshair className="w-3.5 h-3.5" strokeWidth={2} />
                    </button>
                </div>
            )}

            {/* Caption sits above the canvas but must not swallow the pointer —
                the globe is dragged through this same area. */}
            <div className="relative pointer-events-none p-6 sm:p-7 h-[320px] sm:h-[360px] flex flex-col justify-end">
                <div className="flex items-end justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-emerald-600 shrink-0" strokeWidth={2} />
                            <span className="text-zinc-900 dark:text-zinc-100 font-medium text-sm">
                                Yogyakarta, Indonesia
                            </span>
                        </div>
                        <p className="mt-1.5 font-mono text-[10px] text-zinc-300 tracking-wide">
                            drag to spin · ⌘/ctrl + scroll to zoom
                        </p>
                    </div>
                    <span className="font-mono text-[11px] text-zinc-400 dark:text-zinc-500 tabular-nums">
                        7.79°S 110.37°E
                    </span>
                </div>
            </div>
        </motion.section>
    );
}

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";

const panelChrome =
    "flex flex-col rounded-3xl border border-black/[0.06] bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_18px_40px_-28px_rgba(0,0,0,0.35)] sm:p-6 dark:border-white/[0.07] dark:bg-zinc-900";

interface ScrollDeckProps {
    /** Row above the track — count, hint, whatever the page wants there. */
    header: ReactNode;
    children: ReactNode;
    /** Number of items in the track. Its width changes with this, and a
     *  ResizeObserver on a fixed-width element would never notice. */
    count: number;
}

/**
 * A shelf that travels sideways as the page scrolls down. The panel pins to the
 * viewport, and every pixel of vertical scroll moves the track one pixel left —
 * so folders arrive from the right and the ones already read leave to the left,
 * taking each other's place.
 *
 * The section is made exactly tall enough to cover the travel, which is what
 * keeps the two scrolls in step: pinning lasts `distance` pixels, and the
 * "start start"→"end end" range spans precisely those same pixels.
 *
 * That equality only holds because the section starts at the very top of the
 * document and the pinned box is a full viewport tall — hence the nav clearance
 * living inside the sticky box as padding, rather than above the section as
 * page margin. With margin above it instead, the panel spends the first
 * screenful unpinned and hanging off the bottom of the viewport.
 */
export default function ScrollDeck({ header, children, count }: ScrollDeckProps) {
    const outer = useRef<HTMLDivElement>(null);
    const track = useRef<HTMLDivElement>(null);
    const [distance, setDistance] = useState(0);

    useEffect(() => {
        const measure = () => {
            const element = track.current;
            if (!element) return;
            setDistance(Math.max(0, element.scrollWidth - element.clientWidth));
        };
        measure();

        // The track's own box never changes width — only its contents overflow
        // further — so the observer watches for viewport-driven resizes and the
        // effect re-runs when the item count changes.
        const element = track.current;
        if (!element) return;
        const observer = new ResizeObserver(measure);
        observer.observe(element);
        return () => observer.disconnect();
    }, [count]);

    const { scrollYProgress } = useScroll({
        target: outer,
        offset: ["start start", "end end"],
    });
    // Smoothed so the shelf glides instead of tracking every wheel notch.
    const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 26, mass: 0.35 });
    const x = useTransform(progress, [0, 1], [0, -distance]);

    return (
        <div ref={outer} style={{ height: `calc(100svh + ${distance}px)` }} className="min-w-0">
            <div className="sticky top-0 flex h-svh flex-col pt-24 pb-6">
                {/* Top-aligned, not centred. The sidebar beside it starts right
                    under the nav, and centring this in the pinned box pushed its
                    top edge down by half the leftover height — a gap that grows
                    with the viewport, so the two cards never lined up. */}
                <section className={`${panelChrome} h-full max-h-[680px]`}>
                    {header}

                    {/* The clipping edge: whatever leaves this box is gone */}
                    <div className="relative min-h-0 flex-1 overflow-hidden">
                        <motion.div
                            ref={track}
                            style={{ x }}
                            // Columns are a fraction of the frame, not a fixed
                            // width, so a screenful is always a whole number of
                            // them. The overflow is then an exact column too —
                            // which is what lets the leftmost one clear the
                            // frame completely instead of stalling half-out.
                            className="grid h-full auto-cols-[calc((100%-2rem)/3)] grid-flow-col grid-rows-3 gap-4 xl:auto-cols-[calc((100%-3rem)/4)]"
                        >
                            {children}
                        </motion.div>
                    </div>

                    {distance > 0 && (
                        <div className="mt-4 h-0.5 w-full overflow-hidden rounded-full bg-black/[0.06] dark:bg-white/10">
                            <motion.div
                                style={{ scaleX: progress }}
                                className="h-full w-full origin-left rounded-full bg-emerald-500"
                            />
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}

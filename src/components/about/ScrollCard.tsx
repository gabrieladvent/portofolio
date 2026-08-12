import { useRef, type ReactNode } from "react";
import {
    motion,
    useReducedMotion,
    useScroll,
    useSpring,
    useTransform,
} from "motion/react";

const cardChrome =
    "rounded-3xl border border-black/[0.06] dark:border-white/[0.07] bg-white dark:bg-zinc-900 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_18px_40px_-28px_rgba(0,0,0,0.35)]";

interface ScrollCardProps {
    children: ReactNode;
    className?: string;
    /** Parallax multiplier — differing values between columns create depth. */
    depth?: number;
    delay?: number;
}

/**
 * A card that tilts through 3D as it travels the viewport: leaning back on its
 * way in, flat at centre, leaning away on its way out. Everything is driven by
 * scroll position rather than a one-shot entrance, so scrolling back up replays
 * it in reverse. The spring keeps it from tracking the wheel too literally.
 */
export default function ScrollCard({
    children,
    className = "",
    depth = 1,
    delay = 0,
}: ScrollCardProps) {
    const ref = useRef<HTMLElement>(null);
    const reduceMotion = useReducedMotion();

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    });
    const progress = useSpring(scrollYProgress, {
        stiffness: 140,
        damping: 30,
        mass: 0.35,
    });

    const rotateX = useTransform(progress, [0, 0.5, 1], [9, 0, -7]);
    const y = useTransform(progress, [0, 1], [26 * depth, -26 * depth]);
    const scale = useTransform(progress, [0, 0.5, 1], [0.97, 1, 0.985]);

    return (
        <motion.section
            ref={ref}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
            style={
                reduceMotion
                    ? undefined
                    : { rotateX, y, scale, transformPerspective: 1400, transformStyle: "preserve-3d" }
            }
            className={`${cardChrome} ${className}`}
        >
            {children}
        </motion.section>
    );
}

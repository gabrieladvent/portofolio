import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import type { ReactNode } from "react";

const ease = [0.21, 0.47, 0.32, 0.98] as const;

/**
 * SectionHeader — Swiss/editorial style: GIANT section number (parallax),
 * monospace label + hairline rule + large title.
 */
export default function SectionHeader({
    index,
    eyebrow,
    title,
    description,
    className = "",
}: {
    index?: string;
    eyebrow: string;
    title: ReactNode;
    description?: ReactNode;
    className?: string;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    });
    // Strong, opposite-direction parallax so it stands out.
    const numY = useTransform(scrollYProgress, [0, 1], [160, -160]);
    const numX = useTransform(scrollYProgress, [0, 1], ["6%", "-6%"]);
    const reduceMotion = useReducedMotion();

    return (
        <div ref={ref} className={`relative max-w-3xl ${className}`}>
            {/* Giant Swiss number — parallax */}
            {index && (
                <motion.span
                    style={{ y: reduceMotion ? undefined : numY, x: reduceMotion ? undefined : numX }}
                    aria-hidden
                    className="pointer-events-none absolute -top-24 -right-4 sm:right-0 select-none font-bold leading-none tracking-tighter text-[clamp(7rem,20vw,16rem)] text-black/[0.05]"
                >
                    {index}
                </motion.span>
            )}

            {/* Mono label row + hairline */}
            <motion.div
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.6, ease }}
                className="relative z-10 flex items-center gap-4 font-mono text-xs tracking-widest uppercase"
            >
                {index && <span className="text-emerald-600">{index}</span>}
                <span className="text-zinc-500">{eyebrow}</span>
                <span className="h-px flex-1 bg-black/10" />
            </motion.div>

            <motion.h2
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.7, delay: 0.08, ease }}
                className="relative z-10 text-balance text-5xl sm:text-6xl lg:text-7xl font-bold text-zinc-900 tracking-tight leading-[0.98] mt-6"
            >
                {title}
            </motion.h2>

            {description && (
                <motion.p
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.7, delay: 0.16, ease }}
                    className="relative z-10 text-pretty text-zinc-600 leading-relaxed mt-5 max-w-xl"
                >
                    {description}
                </motion.p>
            )}
        </div>
    );
}

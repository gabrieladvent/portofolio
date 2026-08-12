import { motion, useMotionValue, useTransform, type MotionValue } from "motion/react";
import { useWakatimeStats } from "../../hooks/useApi";
import ActHeader from "./ActHeader";
import type { ActProps } from "./act";

/**
 * One language. Its own component because the bar's width is a motion value —
 * and a hook cannot be called from inside the map that lays the rows out.
 */
function LanguageBar({
    progress,
    start,
    name,
    percent,
    text,
    still,
}: {
    progress: MotionValue<number>;
    start: number;
    name: string;
    percent: number;
    text: string;
    still: boolean;
}) {
    const filled = Math.max(percent, 0) / 100;
    const scaleX = useTransform(progress, [start, start + 0.06], [0, filled]);

    return (
        <li className="flex items-center gap-3">
            <span className="w-20 shrink-0 truncate text-xs font-medium text-zinc-700 sm:w-24 dark:text-zinc-300">
                {name}
            </span>
            <span className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-black/[0.06] dark:bg-white/10">
                <motion.span
                    style={{ scaleX: still ? filled : scaleX }}
                    className="block h-full w-full origin-left rounded-full bg-emerald-500"
                />
            </span>
            <span className="hidden w-28 shrink-0 whitespace-nowrap text-right font-mono text-[10px] tabular-nums text-zinc-400 sm:block dark:text-zinc-500">
                {text}
            </span>
        </li>
    );
}

/**
 * Act two. Where the first panel came up off the desk, this one swings in on its
 * left edge like a page turning — a different axis, so the sequence never reads
 * as the same move repeated.
 */
export default function WakatimeAct({ progress, from, to, still = false }: ActProps) {
    const { stats } = useWakatimeStats();
    const weekly = stats?.weeklyStats;
    const languages = weekly?.languages?.slice(0, 5) ?? [];

    const idle = useMotionValue(1);
    const p = progress ?? idle;

    const opacity = useTransform(p, [from, from + 0.07, to - 0.07, to], [0, 1, 1, 0]);
    const rotateY = useTransform(p, [from, from + 0.14], [58, 0]);
    const x = useTransform(p, [from, from + 0.14], ["16%", "0%"]);

    return (
        <motion.div
            style={
                still
                    ? undefined
                    : { opacity, rotateY, x, transformPerspective: 1100, transformOrigin: "0% 50%" }
            }
            className="absolute inset-0 flex flex-col justify-between p-5 sm:p-7"
        >
            <ActHeader
                eyebrow="WakaTime · last 7 days"
                value={weekly?.human_readable_total ?? "—"}
                caption={stats ? `${stats.allTimeTotal} all time` : undefined}
            />

            <ul className="space-y-2.5">
                {languages.length ? (
                    languages.map((language, i) => (
                        <LanguageBar
                            key={language.name}
                            progress={p}
                            still={still}
                            // Rows fill one after the other rather than together
                            // — and the last must finish before the panel starts
                            // fading, or no bar is ever seen at its full length.
                            start={from + 0.06 + i * 0.02}
                            name={language.name}
                            percent={language.percent}
                            text={language.text}
                        />
                    ))
                ) : (
                    <li className="font-mono text-xs text-zinc-400 dark:text-zinc-500">
                        Language breakdown unavailable.
                    </li>
                )}
            </ul>

            <div className="flex items-end justify-between gap-6">
                <div>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                        Daily average
                    </p>
                    <p className="mt-1 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                        {weekly?.human_readable_daily_average ?? "—"}
                    </p>
                </div>
                <div className="text-right">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                        Editor
                    </p>
                    <p className="mt-1 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                        {weekly?.editors?.[0]?.name ?? "—"}
                    </p>
                </div>
            </div>
        </motion.div>
    );
}

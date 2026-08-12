import { motion, useMotionTemplate, useMotionValue, useTransform } from "motion/react";
import { useGitHubStats } from "../../hooks/useApi";
import ActHeader from "./ActHeader";
import type { ActProps } from "./act";

/** Five buckets, coloured on the site's own scale rather than GitHub's. */
const LEVELS = [
    "bg-black/[0.06] dark:bg-white/[0.06]",
    "bg-emerald-200 dark:bg-emerald-900",
    "bg-emerald-300 dark:bg-emerald-700",
    "bg-emerald-500 dark:bg-emerald-500",
    "bg-emerald-700 dark:bg-emerald-300",
];

function levelOf(count: number) {
    if (count <= 0) return 0;
    if (count <= 2) return 1;
    if (count <= 5) return 2;
    if (count <= 9) return 3;
    return 4;
}

function Stat({ label, value }: { label: string; value: number | null }) {
    return (
        <div className="min-w-0">
            <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                {label}
            </p>
            <p className="mt-1 text-sm font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">
                {value === null ? "—" : value.toLocaleString()}
            </p>
        </div>
    );
}

/**
 * Act one. The panel is dealt onto the screen from below, tipping upright as it
 * lands, and the calendar is then wiped in diagonally by a gradient mask — one
 * animated property for the whole grid, rather than a transform on each of the
 * three-hundred-odd cells.
 */
export default function GithubAct({
    progress,
    from,
    to,
    still = false,
}: ActProps) {
    const { stats } = useGitHubStats();
    const weeks = stats?.contributionCalendar.weeks ?? [];

    // Hooks cannot be skipped, so the still version drives a value nobody reads.
    const idle = useMotionValue(1);
    const p = progress ?? idle;

    const opacity = useTransform(p, [from, from + 0.07, to - 0.07, to], [0, 1, 1, 0]);
    const y = useTransform(p, [from, from + 0.13], ["42%", "0%"]);
    const rotateX = useTransform(p, [from, from + 0.13], [26, 0]);

    // Two stops chasing each other across the grid: the opaque edge leads, the
    // soft edge follows, so the reveal has a feathered front.
    const lead = useTransform(p, [from + 0.04, from + 0.24], ["-25%", "115%"]);
    const trail = useTransform(p, [from + 0.04, from + 0.24], ["-8%", "140%"]);
    const wipe = useMotionTemplate`linear-gradient(104deg, #000 ${lead}, transparent ${trail})`;

    return (
        <motion.div
            style={
                still
                    ? undefined
                    : { opacity, y, rotateX, transformPerspective: 900, transformOrigin: "50% 100%" }
            }
            className="absolute inset-0 flex flex-col justify-between p-5 sm:p-7"
        >
            <ActHeader
                eyebrow="GitHub · contributions"
                value={
                    stats
                        ? `${stats.contributionCalendar.totalContributions.toLocaleString()} contributions`
                        : "— contributions"
                }
                caption="past year"
            />

            <motion.div
                style={still ? undefined : { WebkitMaskImage: wipe, maskImage: wipe }}
                // Pushed right, so a narrow screen crops the oldest weeks rather
                // than slicing the same amount off each end of the year.
                className="flex justify-end gap-[3px] overflow-hidden py-2 sm:justify-center"
            >
                {(weeks.length ? weeks : Array.from({ length: 53 }, () => null)).map((week, w) => (
                    <div key={w} className="flex flex-col gap-[3px]">
                        {(week?.contributionDays ?? Array.from({ length: 7 }, () => null)).map(
                            (day, d) => (
                                <span
                                    key={d}
                                    title={day ? `${day.contributionCount} on ${day.date}` : undefined}
                                    className={`h-2 w-2 rounded-[2px] sm:h-2.5 sm:w-2.5 ${LEVELS[levelOf(day?.contributionCount ?? 0)]
                                        }`}
                                />
                            ),
                        )}
                    </div>
                ))}
            </motion.div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:flex sm:items-end sm:justify-between">
                <Stat label="Commits" value={stats?.totalCommitContributions ?? null} />
                <Stat label="Pull requests" value={stats?.totalPullRequestContributions ?? null} />
                <Stat label="Reviews" value={stats?.totalPullRequestReviewContributions ?? null} />
                <Stat label="Issues" value={stats?.totalIssueContributions ?? null} />
            </div>
        </motion.div>
    );
}

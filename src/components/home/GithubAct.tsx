import { AnimatePresence, motion, useMotionTemplate, useMotionValue, useTransform } from "motion/react";
import { useRef, useState } from "react";
import { useGitHubStats } from "../../hooks/useApi";
import type { GitHubContributionDay, GitHubContributionWeek } from "../../types/api";
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

// One square, and one row of the weekday gutter beside it. Kept together so the
// gutter can never drift out of step with the grid it labels.
// 16px squares only from xl up: a year is 53 columns, and at 19px a column the
// grid needs 1,007px of panel — room a 1024-wide window does not have.
const CELL = "h-2.5 w-2.5 sm:h-3 sm:w-3 xl:h-4 xl:w-4";
const ROW = "h-2.5 sm:h-3 xl:h-4";
/** Month row (12px) plus the grid's 3px gap — what the gutter has to clear. */
const GUTTER_TOP = "pt-[15px]";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const WEEKDAYS = ["", "Mon", "", "Wed", "", "Fri", ""];
const WEEKDAYS_FULL = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** "1 day", not "1 days" — the streak is often exactly one. */
function plural(count: number, noun: string) {
    return `${count} ${noun}${count === 1 ? "" : "s"}`;
}

/** "2026-03-12" → "12 Mar", without dragging a date library in for it. */
function shortDate(date: string) {
    const [, month, day] = date.split("-");
    return `${Number(day)} ${MONTHS[Number(month) - 1] ?? ""}`.trim();
}

/**
 * "2026-03-12" → "Thu, 12 Mar 2026". Read as UTC: the calendar's dates are
 * plain days, and a local-midnight parse would slide half of them a day west.
 */
function longDate(date: string) {
    const [year, month, day] = date.split("-").map(Number);
    const weekday = WEEKDAYS_FULL[new Date(Date.UTC(year, month - 1, day)).getUTCDay()];
    return `${weekday}, ${day} ${MONTHS[month - 1] ?? ""} ${year}`;
}

/**
 * What the calendar already knows but never said out loud: how many days were
 * worked, the longest unbroken run, the run still going, and the best day.
 */
function summarise(days: GitHubContributionDay[]) {
    let active = 0;
    let longest = 0;
    let run = 0;
    let best: GitHubContributionDay | null = null;

    for (const day of days) {
        if (day.contributionCount > 0) {
            active++;
            run++;
            if (run > longest) longest = run;
        } else {
            run = 0;
        }
        if (!best || day.contributionCount > best.contributionCount) best = day;
    }

    let current = 0;
    for (let i = days.length - 1; i >= 0; i--) {
        if (days[i].contributionCount > 0) current++;
        // Today's commits may not have landed yet, so an empty last day breaks
        // nothing — any earlier gap does.
        else if (i < days.length - 1) break;
    }

    return { active, longest, current, best, total: days.length };
}

/** The month a week column starts, printed only when it changes. */
function monthLabels(weeks: GitHubContributionWeek[]) {
    let previous = "";
    return weeks.map((week, index) => {
        const date = week.contributionDays[0]?.date;
        if (!date) return "";
        const month = date.slice(5, 7);
        const changed = month !== previous;
        previous = month;
        // The first column is usually a stub of the month before; labelling it
        // just crowds the second label a few pixels away.
        return changed && index > 0 ? MONTHS[Number(month) - 1] : "";
    });
}

function Stat({ label, value }: { label: string; value: string }) {
    return (
        // Full height and pushed apart: grid rows are equal height, so a label
        // that wraps to two lines no longer drags its number out of line with
        // the numbers beside it.
        <div className="flex h-full min-w-0 flex-col justify-between">
            <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                {label}
            </p>
            <p className="mt-1 text-sm font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">
                {value}
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
    const days = weeks.flatMap((week) => week.contributionDays);
    const summary = summarise(days);
    const labels = monthLabels(weeks);

    // The square under the pointer, and where its tooltip should sit — measured
    // against the panel, not the page, so the scroll transform cannot skew it.
    const stageRef = useRef<HTMLDivElement>(null);
    const [hovered, setHovered] = useState<{ day: GitHubContributionDay; x: number; y: number } | null>(
        null,
    );

    const track = (event: React.PointerEvent<HTMLSpanElement>, day: GitHubContributionDay) => {
        const stage = stageRef.current?.getBoundingClientRect();
        if (!stage) return;
        const cell = event.currentTarget.getBoundingClientRect();
        setHovered({
            day,
            // Kept a tooltip-half clear of both edges, so a square in the first
            // or last week does not push its label out of the panel.
            x: Math.min(Math.max(cell.left - stage.left + cell.width / 2, 84), stage.width - 84),
            y: cell.top - stage.top,
        });
    };

    // Hooks cannot be skipped, so the still version drives a value nobody reads.
    const idle = useMotionValue(1);
    const p = progress ?? idle;

    const opacity = useTransform(p, [from, from + 0.07, to - 0.07, to], [0, 1, 1, 0]);
    // The three acts are stacked on top of each other, so a faded-out panel is
    // still there to catch the pointer. Only the act on screen may be hovered.
    const pointerEvents = useTransform(opacity, (value) => (value > 0.6 ? "auto" : "none"));
    const y = useTransform(p, [from, from + 0.13], ["42%", "0%"]);
    const rotateX = useTransform(p, [from, from + 0.13], [26, 0]);

    // Two stops chasing each other across the grid: the opaque edge leads, the
    // soft edge follows, so the reveal has a feathered front.
    const lead = useTransform(p, [from + 0.04, from + 0.24], ["-25%", "115%"]);
    const trail = useTransform(p, [from + 0.04, from + 0.24], ["-8%", "140%"]);
    const wipe = useMotionTemplate`linear-gradient(104deg, #000 ${lead}, transparent ${trail})`;

    const perDay = summary.total ? (stats?.contributionCalendar.totalContributions ?? 0) / summary.total : 0;

    return (
        <motion.div
            ref={stageRef}
            style={
                still
                    ? undefined
                    : {
                        opacity,
                        y,
                        rotateX,
                        pointerEvents,
                        transformPerspective: 900,
                        transformOrigin: "50% 100%",
                    }
            }
            className="absolute inset-0 flex flex-col justify-between p-5 sm:p-7"
        >
            <div>
                <ActHeader
                    eyebrow="GitHub · contributions"
                    value={
                        stats
                            ? `${stats.contributionCalendar.totalContributions.toLocaleString()} contributions`
                            : "— contributions"
                    }
                    caption="past year"
                />
                {summary.best && (
                    <p className="mt-3 font-mono text-[10px] text-zinc-400 dark:text-zinc-500">
                        {summary.active} of {summary.total} days worked · busiest{" "}
                        {summary.best.contributionCount} on {shortDate(summary.best.date)} ·{" "}
                        {perDay.toFixed(1)} a day on average
                    </p>
                )}
            </div>

            <motion.div
                style={still ? undefined : { WebkitMaskImage: wipe, maskImage: wipe }}
                // Pushed right, so a narrow screen crops the oldest weeks rather
                // than slicing the same amount off each end of the year.
                onPointerLeave={() => setHovered(null)}
                className="flex justify-end overflow-hidden sm:justify-center"
            >
                {/* Shrink-wrapped around the calendar so the legend can hang off
                    its right edge instead of the panel's, wherever it lands. */}
                <div className="shrink-0">
                    <div className="flex gap-2">
                        <div className={`hidden shrink-0 flex-col gap-[3px] sm:flex ${GUTTER_TOP}`}>
                            {WEEKDAYS.map((day, i) => (
                                <span
                                    key={i}
                                    className={`${ROW} font-mono text-[9px] leading-none text-zinc-300 dark:text-zinc-600`}
                                >
                                    {day}
                                </span>
                            ))}
                        </div>

                        <div className="flex gap-[3px]">
                            {(weeks.length ? weeks : Array.from({ length: 53 }, () => null)).map(
                                (week, w) => (
                                    <div key={w} className="flex flex-col gap-[3px]">
                                        {/* Zero-width label box: the month name hangs
                                            out of a 12px column, not stretching it. */}
                                        <span className="relative block h-3 w-full">
                                            {labels[w] && (
                                                <span className="absolute left-0 top-0 whitespace-nowrap font-mono text-[9px] leading-none text-zinc-400 dark:text-zinc-500">
                                                    {labels[w]}
                                                </span>
                                            )}
                                        </span>
                                        {(
                                            week?.contributionDays ??
                                            Array.from({ length: 7 }, () => null)
                                        ).map((day, d) => (
                                            <span
                                                key={d}
                                                onPointerEnter={
                                                    day ? (event) => track(event, day) : undefined
                                                }
                                                className={`${CELL} rounded-[2px] transition-[box-shadow] ${LEVELS[levelOf(day?.contributionCount ?? 0)]
                                                    } ${day
                                                        ? "hover:ring-1 hover:ring-zinc-900/50 dark:hover:ring-white/60"
                                                        : ""
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                ),
                            )}
                        </div>
                    </div>

                    <div className="mt-2.5 flex items-center justify-end gap-1.5 font-mono text-[9px] text-zinc-400 dark:text-zinc-500">
                        <span>Less</span>
                        {LEVELS.map((level, i) => (
                            <i key={i} className={`h-2.5 w-2.5 rounded-[2px] ${level}`} />
                        ))}
                        <span>More</span>
                    </div>
                </div>
            </motion.div>

            <AnimatePresence>
                {hovered && (
                    <motion.div
                        key="tip"
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        transition={{ duration: 0.14, ease: "easeOut" }}
                        style={{ left: hovered.x, top: hovered.y }}
                        className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-[calc(100%+8px)]"
                    >
                        <div className="rounded-md border border-white/10 bg-zinc-900/95 px-2.5 py-1.5 shadow-xl backdrop-blur dark:border-black/10 dark:bg-zinc-100/95">
                            <p className="whitespace-nowrap font-mono text-[10px] font-semibold leading-none text-emerald-400 dark:text-emerald-600">
                                {hovered.day.contributionCount === 0
                                    ? "No contributions"
                                    : plural(hovered.day.contributionCount, "contribution")}
                            </p>
                            <p className="mt-1 whitespace-nowrap font-mono text-[9px] leading-none text-zinc-400 dark:text-zinc-500">
                                {longDate(hovered.day.date)}
                            </p>
                        </div>
                        {/* The stem, drawn as a rotated corner of the same panel. */}
                        <span className="absolute left-1/2 top-full h-1.5 w-1.5 -translate-x-1/2 -translate-y-[3px] rotate-45 rounded-[1px] border-b border-r border-white/10 bg-zinc-900/95 dark:border-black/10 dark:bg-zinc-100/95" />
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-3 gap-x-6 gap-y-4 sm:flex sm:items-end sm:justify-between">
                <Stat label="Commits" value={(stats?.totalCommitContributions ?? 0).toLocaleString()} />
                <Stat
                    label="Pull requests"
                    value={(stats?.totalPullRequestContributions ?? 0).toLocaleString()}
                />
                <Stat
                    label="Reviews"
                    value={(stats?.totalPullRequestReviewContributions ?? 0).toLocaleString()}
                />
                <Stat label="Issues" value={(stats?.totalIssueContributions ?? 0).toLocaleString()} />
                <Stat label="Longest streak" value={plural(summary.longest, "day")} />
                <Stat label="Current streak" value={plural(summary.current, "day")} />
            </div>
        </motion.div>
    );
}

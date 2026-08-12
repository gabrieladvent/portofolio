import { motion, useMotionValue, useTransform, type MotionValue } from "motion/react";
import { useWakatimeStats } from "../../hooks/useApi";
import ActHeader from "./ActHeader";
import type { ActProps } from "./act";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function shortDate(date?: string) {
    if (!date) return "";
    const [, month, day] = date.split("-");
    return `${Number(day)} ${MONTHS[Number(month) - 1] ?? ""}`.trim();
}

/**
 * "5 – 11 Aug" from the window's own ISO bounds, dropping the month from the
 * first date when both fall inside it. Read in the visitor's timezone, which is
 * the same rounding WakaTime itself did to pick the seven days.
 */
function range(start?: string, end?: string) {
    if (!start || !end) return "";
    const from = new Date(start);
    const to = new Date(end);
    if (Number.isNaN(from.valueOf()) || Number.isNaN(to.valueOf())) return "";
    const sameMonth = from.getMonth() === to.getMonth();
    const head = sameMonth ? `${from.getDate()}` : `${from.getDate()} ${MONTHS[from.getMonth()]}`;
    return `${head} – ${to.getDate()} ${MONTHS[to.getMonth()]}`;
}

/**
 * One measured row — a language, an editor, a machine. Its own component
 * because the bar's width is a motion value, and a hook cannot be called from
 * inside the map that lays the rows out.
 */
function Bar({
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
            <span className="hidden w-24 shrink-0 whitespace-nowrap text-right font-mono text-[10px] tabular-nums text-zinc-400 sm:block dark:text-zinc-500">
                {text}
            </span>
        </li>
    );
}

function Column({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="min-w-0">
            <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                {title}
            </p>
            <ul className="space-y-2.5">{children}</ul>
        </div>
    );
}

function Stat({ label, value }: { label: string; value: string }) {
    return (
        // See GithubAct: equal-height grid rows keep the numbers on one line
        // even when a label above them wraps.
        <div className="flex h-full min-w-0 flex-col justify-between">
            <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                {label}
            </p>
            <p className="mt-1 truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                {value}
            </p>
        </div>
    );
}

/**
 * Act two. Where the first panel came up off the desk, this one swings in on its
 * left edge like a page turning — a different axis, so the sequence never reads
 * as the same move repeated.
 *
 * Two columns rather than one list: the week is measured along several axes at
 * once, and the widescreen window has the room to put them side by side.
 */
export default function WakatimeAct({ progress, from, to, still = false }: ActProps) {
    const { stats } = useWakatimeStats();
    const weekly = stats?.weeklyStats;
    const languages = weekly?.languages?.slice(0, 7) ?? [];
    const editors = weekly?.editors?.slice(0, 3) ?? [];
    const machines = weekly?.operating_systems?.slice(0, 2) ?? [];

    const idle = useMotionValue(1);
    const p = progress ?? idle;

    const opacity = useTransform(p, [from, from + 0.07, to - 0.07, to], [0, 1, 1, 0]);
    const rotateY = useTransform(p, [from, from + 0.14], [58, 0]);
    const x = useTransform(p, [from, from + 0.14], ["16%", "0%"]);

    // Rows fill one after the other rather than together — and the last must
    // finish before the panel starts fading, or no bar is ever seen full. Ten
    // rows at this step put the last one full at 0.201 of the act, just inside
    // the 0.21 where the fade begins.
    const startOf = (index: number) => from + 0.06 + index * 0.009;
    const projects = weekly?.projects?.length ?? 0;

    return (
        <motion.div
            style={
                still
                    ? undefined
                    : { opacity, rotateY, x, transformPerspective: 1100, transformOrigin: "0% 50%" }
            }
            className="absolute inset-0 flex flex-col justify-between p-5 sm:p-7"
        >
            <div>
                <ActHeader
                    // Just the source: the dates below say which seven days,
                    // and the longer eyebrow wrapped into the caption on a phone.
                    eyebrow="WakaTime"
                    value={weekly?.human_readable_total ?? "—"}
                    caption={stats ? `${stats.allTimeTotal} all time` : undefined}
                />
                {weekly && (
                    <p className="mt-3 font-mono text-[10px] text-zinc-400 dark:text-zinc-500">
                        {[
                            range(weekly.start, weekly.end),
                            `${weekly.languages?.length ?? 0} languages`,
                            `${weekly.editors?.length ?? 0} editors`,
                        ]
                            .filter(Boolean)
                            .join(" · ")}
                    </p>
                )}
            </div>

            <div className="grid gap-6 sm:grid-cols-[1.5fr_1fr] sm:gap-10">
                <Column title="Languages">
                    {languages.length ? (
                        languages.map((language, i) => (
                            <Bar
                                key={language.name}
                                progress={p}
                                still={still}
                                start={startOf(i)}
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
                </Column>

                <Column title="Where it was written">
                    {[...editors, ...machines].map((row, i) => (
                        <Bar
                            key={row.name}
                            progress={p}
                            still={still}
                            start={startOf(languages.length + i)}
                            name={row.name}
                            percent={row.percent}
                            text={row.text}
                        />
                    ))}
                </Column>
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:flex sm:items-end sm:justify-between">
                <Stat label="Daily average" value={weekly?.human_readable_daily_average ?? "—"} />
                {/* The date rides in the label so the figure itself never has to
                    be cut short on a narrow screen. */}
                <Stat
                    label={
                        weekly?.best_day ? `Best day · ${shortDate(weekly.best_day.date)}` : "Best day"
                    }
                    value={weekly?.best_day?.text ?? "—"}
                />
                <Stat
                    label="Days coded"
                    value={weekly?.days_minus_holidays ? `${weekly.days_minus_holidays} of 7` : "—"}
                />
                {/* Counted, not named: the repositories behind these hours are
                    client work, and the number says as much as the list would. */}
                <Stat label="Projects touched" value={projects ? String(projects) : "—"} />
            </div>
        </motion.div>
    );
}

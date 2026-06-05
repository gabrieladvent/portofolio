import { useGitHubStats } from "../../hooks/useApi";
import { useState, useRef, useEffect } from "react";

interface TooltipState {
    visible: boolean;
    x: number;
    y: number;
    count: number;
    date: string;
}

const CELL = 11;
const GAP = 3;
const STEP = CELL + GAP;

const LEVEL_COLORS = ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"];

function countToLevel(count: number): number {
    if (count === 0) return 0;
    if (count <= 3) return 1;
    if (count <= 6) return 2;
    if (count <= 9) return 3;
    return 4;
}

export default function GitHubContributions() {
    const { stats, loading } = useGitHubStats();
    const [tooltip, setTooltip] = useState<TooltipState>({
        visible: false, x: 0, y: 0, count: 0, date: "",
    });
    const wrapRef = useRef<HTMLDivElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    // On mobile the heatmap scrolls horizontally — start at the most recent weeks.
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
        }
    }, [stats]);

    if (loading) {
        return (
            <div className="p-4 rounded-2xl bg-white border border-black/[0.07] shadow-sm animate-pulse">
                <div className="flex items-center justify-between mb-3.5">
                    <div className="h-4 w-40 rounded-full bg-black/10" />
                    <div className="h-4 w-28 rounded-full bg-black/10" />
                </div>
                <div className="h-[100px] rounded-xl bg-black/5" />
                <div className="grid grid-cols-4 mt-3.5 pt-3.5 border-t border-black/[0.07]">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="flex flex-col items-center gap-1.5 py-2">
                            <div className="h-5 w-12 rounded bg-black/10" />
                            <div className="h-2.5 w-10 rounded bg-black/5" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (!stats) return null;

    const { contributionCalendar } = stats;
    const weeks = contributionCalendar.weeks;

    const monthLabels: { col: number; label: string }[] = [];
    weeks.forEach((week, wIdx) => {
        const first = week.contributionDays[0];
        if (!first) return;
        const d = new Date(first.date);
        const prev = wIdx > 0 ? weeks[wIdx - 1].contributionDays[0] : null;
        const prevMonth = prev ? new Date(prev.date).getMonth() : -1;
        if (d.getMonth() !== prevMonth)
            monthLabels.push({ col: wIdx, label: d.toLocaleDateString("en-US", { month: "short" }) });
    });

    const longestStreak = (() => {
        let max = 0, cur = 0, prev: Date | null = null;
        weeks.flatMap(w => w.contributionDays).forEach(d => {
            const date = new Date(d.date);
            if (d.contributionCount > 0) {
                if (prev && (date.getTime() - prev.getTime()) === 86400000) cur++;
                else cur = 1;
                max = Math.max(max, cur);
            } else cur = 0;
            prev = date;
        });
        return max;
    })();

    const handleCellEnter = (e: React.MouseEvent<HTMLDivElement>, count: number, date: string) => {
        const wrapRect = wrapRef.current?.getBoundingClientRect();
        if (!wrapRect) return;
        const rect = e.currentTarget.getBoundingClientRect();
        setTooltip({
            visible: true,
            x: rect.left - wrapRect.left + rect.width / 2,
            y: rect.top - wrapRect.top,
            count, date,
        });
    };

    const fmtDate = (s: string) =>
        new Date(s).toLocaleDateString("en-US", {
            weekday: "short", month: "long", day: "numeric", year: "numeric",
        });

    const DAY_LABEL_W = 28;
    const MONTH_H = 15;
    const GRID_W = DAY_LABEL_W + weeks.length * STEP - GAP;
    const GRID_H = MONTH_H + 7 * STEP - GAP;

    return (
        <div className="p-4 rounded-2xl bg-white border border-black/[0.07] shadow-sm">

            {/* Header */}
            <div className="flex items-center justify-between mb-3.5">
                <h3 className="text-[13px] font-semibold text-zinc-900 flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-md bg-emerald-500/10 border border-emerald-500/20">
                        <svg className="w-[13px] h-[13px] text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                        </svg>
                    </span>
                    Contribution Activity
                </h3>
                <div className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2.5 py-0.5">
                    <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[11px] font-medium text-emerald-700 tabular-nums">
                        {contributionCalendar.totalContributions.toLocaleString()} contributions
                    </span>
                </div>
            </div>

            {/* Calendar + side stats layout */}
            <div className="flex flex-col lg:flex-row gap-3 lg:items-stretch">

                {/* Calendar — fixed width; scrolls horizontally on mobile */}
                <div
                    ref={scrollRef}
                    className="rounded-xl backdrop-blur-sm border border-black/[0.07] p-3 lg:shrink-0 flex flex-col overflow-x-auto lg:overflow-visible"
                >
                    <div
                        ref={wrapRef}
                        className="relative"
                        style={{ width: GRID_W, height: GRID_H }}
                        onMouseLeave={() => setTooltip(t => ({ ...t, visible: false }))}
                    >
                        {/* Month labels */}
                        {monthLabels.map(({ col, label }) => (
                            <span
                                key={`m-${col}`}
                                className="absolute text-[9px] text-zinc-400 font-mono"
                                style={{ left: DAY_LABEL_W + col * STEP, top: 0, lineHeight: "1" }}
                            >
                                {label}
                            </span>
                        ))}

                        {/* Day labels */}
                        {([{ row: 1, label: "Mon" }, { row: 3, label: "Wed" }, { row: 5, label: "Fri" }]).map(({ row, label }) => (
                            <span
                                key={label}
                                className="absolute text-[9px] text-zinc-400 font-mono"
                                style={{
                                    right: GRID_W - DAY_LABEL_W + 3,
                                    top: MONTH_H + row * STEP + (CELL - 9) / 2,
                                    lineHeight: "1",
                                }}
                            >
                                {label}
                            </span>
                        ))}

                        {/* Cells */}
                        {weeks.map((week, wIdx) =>
                            week.contributionDays.map(day => {
                                const dow = new Date(day.date).getDay();
                                const lvl = countToLevel(day.contributionCount);
                                return (
                                    <div
                                        key={day.date}
                                        className="absolute rounded-[2px] cursor-pointer transition-opacity duration-100 hover:opacity-70"
                                        style={{
                                            width: CELL, height: CELL,
                                            left: DAY_LABEL_W + wIdx * STEP,
                                            top: MONTH_H + dow * STEP,
                                            backgroundColor: LEVEL_COLORS[lvl],
                                            border: lvl === 0 ? "0.5px solid rgba(0,0,0,0.08)" : "none",
                                        }}
                                        onMouseEnter={e => handleCellEnter(e, day.contributionCount, day.date)}
                                    />
                                );
                            })
                        )}

                        {/* Tooltip */}
                        {tooltip.visible && (
                            <div
                                className="absolute z-30 pointer-events-none select-none"
                                style={{ left: tooltip.x, top: tooltip.y, transform: "translate(-50%, calc(-100% - 8px))" }}
                            >
                                <div className="bg-[#161b22]/95 backdrop-blur-sm border border-[#30363d] rounded-lg shadow-2xl px-3 py-2 text-center whitespace-nowrap">
                                    <p className="text-[11px] font-semibold text-white leading-none mb-1">
                                        {tooltip.count === 0 ? "No contributions" : `${tooltip.count} contribution${tooltip.count !== 1 ? "s" : ""}`}
                                    </p>
                                    <p className="text-[10px] text-gray-400 leading-none">{fmtDate(tooltip.date)}</p>
                                    <span className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0"
                                        style={{ borderLeft: "4px solid transparent", borderRight: "4px solid transparent", borderTop: "4px solid #30363d" }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Legend */}
                    <div className="flex items-center justify-end gap-1 mt-2">
                        <span className="text-[9px] text-zinc-400 mr-0.5">Less</span>
                        {LEVEL_COLORS.map((color, i) => (
                            <div key={color} className="rounded-[2px] flex-shrink-0"
                                style={{
                                    width: CELL, height: CELL, backgroundColor: color,
                                    border: i === 0 ? "0.5px solid rgba(0,0,0,0.1)" : "none"
                                }} />
                        ))}
                        <span className="text-[9px] text-zinc-400 ml-0.5">More</span>
                    </div>
                </div>

                {/* Side stats — 2-up on mobile, stacked beside the calendar on desktop */}
                <div className="flex-1 grid grid-cols-2 lg:grid-cols-1 lg:grid-rows-2 gap-2.5">
                    {/* Total */}
                    <div className="rounded-xl backdrop-blur-sm border border-black/[0.07] px-3.5 py-2 flex items-center gap-3">
                        <div>
                            <span className="text-[9px] text-zinc-400 uppercase tracking-widest font-mono block mb-0.5">Total</span>
                            <span className="text-[22px] font-bold text-zinc-900 tabular-nums leading-none">
                                {contributionCalendar.totalContributions.toLocaleString()}
                            </span>
                            <span className="text-[10px] text-zinc-400 block mt-0.5">contributions</span>
                        </div>
                        <div className="ml-auto">
                            <svg className="w-5 h-5 text-emerald-500/30" fill="currentColor" viewBox="0 0 24 24">
                                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>

                    {/* Streak */}
                    <div className="rounded-xl backdrop-blur-sm border border-black/[0.07] px-3.5 py-2 flex items-center gap-3">
                        <div>
                            <span className="text-[9px] text-zinc-400 uppercase tracking-widest font-mono block mb-0.5">Streak</span>
                            <div className="flex items-baseline gap-1">
                                <span className="text-[22px] font-bold text-zinc-900 tabular-nums leading-none">{longestStreak}</span>
                                <span className="text-[11px] text-zinc-500">days</span>
                            </div>
                            <span className="text-[10px] text-zinc-400 block mt-0.5">longest streak</span>
                        </div>
                        <div className="ml-auto text-2xl">🔥</div>
                    </div>

                </div>
            </div>

            {/* Bottom stats */}
            <div className="grid grid-cols-4 mt-3.5 pt-3.5 border-t border-black/[0.07]">
                {[
                    { value: stats.totalCommitContributions, label: "Commits" },
                    { value: stats.totalPullRequestContributions, label: "Pull Req." },
                    { value: stats.totalIssueContributions, label: "Issues" },
                    { value: stats.totalPullRequestReviewContributions, label: "Reviews" },
                ].map(({ value, label }) => (
                    <div key={label} className="flex flex-col items-center gap-1 py-1.5">
                        <span className="text-[18px] font-bold text-zinc-900 tabular-nums tracking-tight leading-none">
                            {value.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-zinc-400 leading-none">{label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
import { useWakatimeStats } from "../../hooks/useApi";
import type { WakatimeCalendarDay } from "../../types/api";
import WakatimeCalendarHeatmap from "./WakatimeCalendarHeatmap";

export default function WakatimeStats() {
    const { stats, loading } = useWakatimeStats();

    if (loading) {
        return (
            <div className="animate-pulse space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="h-24 bg-black/5 rounded-xl" />
                    <div className="h-24 bg-black/5 rounded-xl" />
                    <div className="h-24 bg-black/5 rounded-xl" />
                    <div className="h-24 bg-black/5 rounded-xl" />
                </div>
                <div className="h-40 bg-black/5 rounded-xl" />
                <div className="h-32 bg-black/5 rounded-xl" />
            </div>
        );
    }

    if (!stats) return null;

    const { weeklyStats, allTimeTotal, calendarData } = stats;

    const formatBestDayDate = (dateStr: string) => {
        const date = new Date(dateStr);

        return date.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const getActivityLevel = (seconds: number): number => {
        if (seconds === 0) return 0;
        if (seconds < 1800) return 1;
        if (seconds < 7200) return 2;
        if (seconds < 14400) return 3;
        return 4;
    };

    const transformedCalendar: WakatimeCalendarDay[] = (calendarData || []).map((day: { date: string; grand_total?: { total_seconds?: number; text?: string } }) => ({
        date: day.date,
        total_seconds: day.grand_total?.total_seconds || 0,
        level: getActivityLevel(day.grand_total?.total_seconds || 0),
        text: day.grand_total?.text
    }));

    const topLanguages = weeklyStats.languages.slice(0, 6);

    const leftColumn = topLanguages.filter((_, i) => i % 2 === 0);

    const rightColumn = topLanguages.filter((_, i) => i % 2 === 1);

    return (
        <div className="space-y-4">
            {/* Stats Cards - 2x2 Grid */}
            <div className="grid grid-cols-2 gap-4">
                {/* Daily Average Coding Time */}
                <div className="p-5 rounded-xl bg-white border border-black/[0.07] shadow-sm hover:border-emerald-500/40 transition-colors">
                    <div className="text-zinc-500 text-sm mb-2">Daily Average Coding Time</div>
                    <div className="text-2xl font-bold text-zinc-900">{weeklyStats.human_readable_daily_average}</div>
                </div>

                {/* Weekly Total */}
                <div className="p-5 rounded-xl bg-white border border-black/[0.07] shadow-sm hover:border-emerald-500/40 transition-colors">
                    <div className="text-zinc-500 text-sm mb-2">Weekly Total</div>
                    <div className="text-2xl font-bold text-zinc-900">{weeklyStats.human_readable_total}</div>
                </div>

                {/* Peak Coding Day */}
                <div className="p-5 rounded-xl bg-white border border-black/[0.07] shadow-sm hover:border-emerald-500/40 transition-colors">
                    <div className="text-zinc-500 text-sm mb-2">Peak Coding Day</div>
                    <div className="text-xl font-bold text-zinc-900">
                        {weeklyStats.best_day ? (
                            <>
                                {formatBestDayDate(weeklyStats.best_day.date)}
                                <span className="text-base font-normal text-zinc-500 ml-2">
                                    ({weeklyStats.best_day.text})
                                </span>
                            </>
                        ) : (
                            'N/A'
                        )}
                    </div>
                </div>

                {/* Overall Coding Time Since Joining (wakatime join) */}
                <div className="p-5 rounded-xl bg-white border border-black/[0.07] shadow-sm hover:border-emerald-500/40 transition-colors">
                    <div className="text-zinc-500 text-sm mb-2">Overall Coding Time Since Joining (wakatime join)</div>
                    <div className="text-2xl font-bold text-zinc-900">{allTimeTotal}</div>
                </div>
            </div>

            {/* Calendar Heatmap */}
            {transformedCalendar.length > 0 && (
                <WakatimeCalendarHeatmap data={transformedCalendar} />
            )}

            {/* Top Languages */}
            <div className="p-6 rounded-xl bg-white border border-black/[0.07] shadow-sm">
                <div className="font-mono text-[10px] uppercase tracking-widest text-zinc-400 mb-6">Top Languages</div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    {/* Left Column */}
                    <div className="space-y-4">
                        {leftColumn.map((lang) => (
                            <div key={lang.name} className="flex items-center gap-3">
                                <span className="text-zinc-700 w-24 truncate">{lang.name}</span>
                                <div className="flex-1 h-3 bg-black/[0.06] rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full bg-emerald-500 transition-all duration-700"
                                        style={{ width: `${lang.percent}%` }}
                                    />
                                </div>
                                <span className="text-zinc-500 text-sm w-12 text-right">{Math.round(lang.percent)}%</span>
                            </div>
                        ))}
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4">
                        {rightColumn.map((lang) => (
                            <div key={lang.name} className="flex items-center gap-3">
                                <span className="text-zinc-700 w-24 truncate">{lang.name}</span>
                                <div className="flex-1 h-3 bg-black/[0.06] rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full bg-emerald-500 transition-all duration-700"
                                        style={{ width: `${lang.percent}%` }}
                                    />
                                </div>
                                <span className="text-zinc-500 text-sm w-12 text-right">{Math.round(lang.percent)}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
import { useWakatimeStats } from "../../hooks/useApi";
import type { WakatimeCalendarDay } from "../../types/api";
import WakatimeCalendarHeatmap from "./WakatimeCalendarHeatmap";

export default function WakatimeStats() {
    const { stats, loading } = useWakatimeStats();

    if (loading) {
        return (
            <div className="animate-pulse space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="h-24 bg-white/5 rounded-xl" />
                    <div className="h-24 bg-white/5 rounded-xl" />
                    <div className="h-24 bg-white/5 rounded-xl" />
                    <div className="h-24 bg-white/5 rounded-xl" />
                </div>
                <div className="h-40 bg-white/5 rounded-xl" />
                <div className="h-32 bg-white/5 rounded-xl" />
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
                {/* Rata-rata Waktu Coding Harian */}
                <div className="p-5 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-colors">
                    <div className="text-gray-400 text-sm mb-2">Rata-rata Waktu Coding Harian</div>
                    <div className="text-2xl font-bold text-white">{weeklyStats.human_readable_daily_average}</div>
                </div>

                {/* Total Minggu Ini */}
                <div className="p-5 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-colors">
                    <div className="text-gray-400 text-sm mb-2">Total Minggu Ini</div>
                    <div className="text-2xl font-bold text-white">{weeklyStats.human_readable_total}</div>
                </div>

                {/* Hari Terbaik */}
                <div className="p-5 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-colors">
                    <div className="text-gray-400 text-sm mb-2">Hari Terbaik</div>
                    <div className="text-xl font-bold text-white">
                        {weeklyStats.best_day ? (
                            <>
                                {formatBestDayDate(weeklyStats.best_day.date)}
                                <span className="text-base font-normal text-gray-400 ml-2">
                                    ({weeklyStats.best_day.text})
                                </span>
                            </>
                        ) : (
                            'N/A'
                        )}
                    </div>
                </div>

                {/* Total Coding Sejak Bergabung */}
                <div className="p-5 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-colors">
                    <div className="text-gray-400 text-sm mb-2">Total Coding Sejak Bergabung</div>
                    <div className="text-2xl font-bold text-white">{allTimeTotal}</div>
                </div>
            </div>

            {/* Calendar Heatmap */}
            {transformedCalendar.length > 0 && (
                <WakatimeCalendarHeatmap data={transformedCalendar} />
            )}

            {/* Bahasa Teratas */}
            <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                <div className="text-gray-400 text-sm mb-6">Bahasa Teratas</div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    {/* Left Column */}
                    <div className="space-y-4">
                        {leftColumn.map((lang) => (
                            <div key={lang.name} className="flex items-center gap-3">
                                <span className="text-gray-300 w-24 truncate">{lang.name}</span>
                                <div className="flex-1 h-3 bg-white/10 rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full bg-yellow-400 transition-all duration-700"
                                        style={{ width: `${lang.percent}%` }}
                                    />
                                </div>
                                <span className="text-gray-400 text-sm w-12 text-right">{Math.round(lang.percent)}%</span>
                            </div>
                        ))}
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4">
                        {rightColumn.map((lang) => (
                            <div key={lang.name} className="flex items-center gap-3">
                                <span className="text-gray-300 w-24 truncate">{lang.name}</span>
                                <div className="flex-1 h-3 bg-white/10 rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full bg-yellow-400 transition-all duration-700"
                                        style={{ width: `${lang.percent}%` }}
                                    />
                                </div>
                                <span className="text-gray-400 text-sm w-12 text-right">{Math.round(lang.percent)}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
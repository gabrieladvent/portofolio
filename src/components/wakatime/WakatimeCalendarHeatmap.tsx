import { useState } from "react";
import type { WakatimeCalendarDay } from "../../types/api";

export default function WakatimeCalendarHeatmap({ data }: { data: WakatimeCalendarDay[] }) {
    const [hoveredDay, setHoveredDay] = useState<WakatimeCalendarDay | null>(null);

    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

    const levelColors = [
        'bg-[#ebedf0]',
        'bg-[#fde68a]',
        'bg-[#fcd34d]',
        'bg-[#f59e0b]',
        'bg-[#d97706]',
    ];

    const weeks: WakatimeCalendarDay[][] = [];

    let currentWeek: WakatimeCalendarDay[] = [];

    if (data.length > 0) {
        const firstDate = new Date(data[0].date);

        const firstDayOfWeek = firstDate.getDay();

        for (let i = 0; i < firstDayOfWeek; i++) {
            currentWeek.push({ date: '', total_seconds: 0, level: -1 });
        }
    }

    data.forEach((day) => {
        currentWeek.push(day);
        if (currentWeek.length === 7) {
            weeks.push(currentWeek);
            currentWeek = [];
        }
    });

    if (currentWeek.length > 0) {
        while (currentWeek.length < 7) {
            currentWeek.push({ date: '', total_seconds: 0, level: -1 });
        }
        weeks.push(currentWeek);
    }

    const getMonthLabels = () => {
        const labels: { month: string; weekIndex: number }[] = [];

        let lastMonth = '';

        weeks.forEach((week, weekIndex) => {
            const validDays = week.filter(d => d.date);

            if (validDays.length > 0) {
                const firstDay = new Date(validDays[0].date);

                const month = firstDay.toLocaleDateString('en-US', { month: 'short' });

                if (month !== lastMonth) {
                    labels.push({ month, weekIndex });

                    lastMonth = month;
                }
            }
        });

        return labels;
    };

    const monthLabels = getMonthLabels();

    const handleMouseEnter = (day: WakatimeCalendarDay, event: React.MouseEvent) => {
        if (day.level >= 0 && day.date) {
            setHoveredDay(day);

            const rect = event.currentTarget.getBoundingClientRect();

            setTooltipPosition({
                x: rect.left + rect.width / 2,
                y: rect.top
            });
        }
    };

    const formatTime = (seconds: number): string => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        if (hours > 0) {
            return `${hours} hr${hours > 1 ? 's' : ''} ${minutes} min${minutes !== 1 ? 's' : ''}`;
        }
        return `${minutes} min${minutes !== 1 ? 's' : ''}`;
    };

    const formatDateShort = (dateStr: string): string => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div className="p-6 rounded-xl bg-white border border-black/[0.07] shadow-sm overflow-hidden">
            {/* Scrollable container */}
            <div className="overflow-x-auto">
                <div className="min-w-[750px]">
                    {/* Month Labels */}
                    <div className="flex mb-2 text-xs text-zinc-400">
                        <div className="w-8" />
                        <div className="flex-1 flex">
                            {monthLabels.map((label, i) => (
                                <div
                                    key={i}
                                    className="text-left"
                                    style={{
                                        marginLeft: i === 0 ? `${label.weekIndex * 14}px` : `${((label.weekIndex - (monthLabels[i - 1]?.weekIndex || 0)) * 14) - 24}px`,
                                    }}
                                >
                                    {label.month}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Calendar Grid */}
                    <div className="flex">
                        {/* Day Labels */}
                        <div className="flex flex-col justify-between pr-2 text-xs text-zinc-400 h-[98px]">
                            <span className="h-[11px]"></span>
                            <span className="h-[11px] leading-[11px]">Mon</span>
                            <span className="h-[11px]"></span>
                            <span className="h-[11px] leading-[11px]">Wed</span>
                            <span className="h-[11px]"></span>
                            <span className="h-[11px] leading-[11px]">Fri</span>
                            <span className="h-[11px]"></span>
                        </div>

                        {/* Weeks Grid */}
                        <div className="flex gap-[3px]">
                            {weeks.map((week, weekIndex) => (
                                <div key={weekIndex} className="flex flex-col gap-[3px]">
                                    {week.map((day, dayIndex) => (
                                        <div
                                            key={dayIndex}
                                            className={`w-[11px] h-[11px] rounded-sm transition-all duration-200 ${day.level >= 0
                                                ? `${levelColors[day.level]} hover:scale-125 hover:ring-2 hover:ring-amber-500/50 cursor-pointer`
                                                : 'bg-transparent'
                                                }`}
                                            onMouseEnter={(e) => handleMouseEnter(day, e)}
                                            onMouseLeave={() => setHoveredDay(null)}
                                        />
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-start gap-2 mt-4 text-xs text-zinc-400">
                <span>Sedikit</span>
                {levelColors.map((color, i) => (
                    <div key={i} className={`w-[11px] h-[11px] rounded-sm ${color}`} />
                ))}
                <span>Banyak</span>
            </div>

            {/* Tooltip */}
            {hoveredDay && hoveredDay.date && (
                <div
                    className="fixed z-[100] px-3 py-2 bg-gray-900 border border-white/20 rounded-lg shadow-xl pointer-events-none"
                    style={{
                        left: tooltipPosition.x,
                        top: tooltipPosition.y - 60,
                        transform: 'translateX(-50%)'
                    }}
                >
                    <div className="text-white text-sm font-semibold">
                        {hoveredDay.total_seconds > 0
                            ? (hoveredDay.text || formatTime(hoveredDay.total_seconds))
                            : 'No activity'
                        }
                    </div>
                    <div className="text-gray-400 text-xs">
                        {formatDateShort(hoveredDay.date)}
                    </div>
                </div>
            )}
        </div>
    );
}
import { useGitHubStats } from "../../hooks/useApi";

export default function GitHubContributions() {
    const { stats, loading } = useGitHubStats();

    if (loading) {
        return (
            <div className="animate-pulse">
                <div className="h-32 bg-white/5 rounded-xl" />
            </div>
        );
    }

    if (!stats) return null;

    const { contributionCalendar } = stats;
    const weeks = contributionCalendar.weeks;

    // Generate month labels
    const getMonthLabels = () => {
        const months: { label: string; index: number }[] = [];
        let lastMonth = -1;

        weeks.forEach((week, weekIndex) => {
            const firstDay = week.contributionDays[0];
            if (firstDay) {
                const date = new Date(firstDay.date);
                const month = date.getMonth();
                if (month !== lastMonth) {
                    months.push({
                        label: date.toLocaleDateString('en-US', { month: 'short' }),
                        index: weekIndex
                    });
                    lastMonth = month;
                }
            }
        });

        return months;
    };

    const monthLabels = getMonthLabels();

    return (
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-3">
                    <svg className="w-6 h-6 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                    Contribution Activity
                </h3>
                <span className="text-emerald-400 font-semibold">
                    {contributionCalendar.totalContributions} contributions
                </span>
            </div>

            {/* Calendar Container */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                {/* Month Labels */}
                <div className="flex mb-2 text-xs text-gray-500">
                    <div className="w-8" />
                    <div className="flex-1 flex">
                        {monthLabels.map((month, i) => (
                            <div
                                key={i}
                                className="text-left"
                                style={{
                                    marginLeft: i === 0 ? 0 : `${((month.index - (monthLabels[i - 1]?.index || 0)) * 14) - 24}px`,
                                }}
                            >
                                {month.label}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Calendar Grid */}
                <div className="flex">
                    {/* Day Labels */}
                    <div className="flex flex-col justify-between pr-2 text-xs text-gray-500 h-[98px]">
                        <span className="h-3"></span>
                        <span>Mon</span>
                        <span className="h-3"></span>
                        <span>Wed</span>
                        <span className="h-3"></span>
                        <span>Fri</span>
                        <span className="h-3"></span>
                    </div>

                    {/* Contribution Grid */}
                    <div className="flex-1 overflow-x-auto">
                        <div className="flex gap-[3px] min-w-max">
                            {weeks.map((week, weekIndex) => (
                                <div key={weekIndex} className="flex flex-col gap-[3px]">
                                    {week.contributionDays.map((day, dayIndex) => (
                                        <div
                                            key={`${weekIndex}-${dayIndex}`}
                                            className="w-[11px] h-[11px] rounded-sm transition-all duration-200 hover:scale-125 hover:ring-2 hover:ring-white/30 cursor-pointer relative group"
                                            style={{ backgroundColor: day.color }}
                                        >
                                            {/* Tooltip */}
                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 border border-white/20 rounded text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                                                <div className="font-semibold">{day.contributionCount} contributions</div>
                                                <div className="text-gray-400">
                                                    {new Date(day.date).toLocaleDateString('en-US', {
                                                        weekday: 'short',
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Legend */}
                <div className="flex items-center justify-end gap-2 mt-4 text-xs text-gray-500">
                    <span>Less</span>
                    {['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'].map((color) => (
                        <div key={color} className="w-[11px] h-[11px] rounded-sm" style={{ backgroundColor: color }} />
                    ))}
                    <span>More</span>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/10">
                <div className="text-center">
                    <div className="text-2xl font-bold text-white">{stats.totalCommitContributions}</div>
                    <div className="text-xs text-gray-500">Commits</div>
                </div>
                <div className="text-center">
                    <div className="text-2xl font-bold text-white">{stats.totalPullRequestContributions}</div>
                    <div className="text-xs text-gray-500">PRs</div>
                </div>
                <div className="text-center">
                    <div className="text-2xl font-bold text-white">{stats.totalIssueContributions}</div>
                    <div className="text-xs text-gray-500">Issues</div>
                </div>
                <div className="text-center">
                    <div className="text-2xl font-bold text-white">{stats.totalPullRequestReviewContributions}</div>
                    <div className="text-xs text-gray-500">Reviews</div>
                </div>
            </div>
        </div>
    );
}
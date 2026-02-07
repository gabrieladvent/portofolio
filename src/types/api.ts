// GitHub Types
export interface GitHubContribution {
  date: string;
  contributionCount: number;
  color: string;
}

export interface GitHubContributionDay {
  date: string;
  contributionCount: number;
  color: string;
}

export interface GitHubContributionWeek {
  contributionDays: GitHubContributionDay[];
}

export interface GitHubContributionsData {
  totalContributions: number;
  weeks: GitHubContributionWeek[];
}

export interface GitHubStats {
  contributionCalendar: GitHubContributionsData;
  totalCommitContributions: number;
  totalIssueContributions: number;
  totalPullRequestContributions: number;
  totalPullRequestReviewContributions: number;
}

export interface GitHubUser {
  contributionsCollection: GitHubStats;
}

export interface GitHubResponse {
  data: {
    user: GitHubUser;
  };
}

// Wakatime Types
export interface WakatimeLanguage {
  name: string;
  percent: number;
  total_seconds: number;
  text: string;
  hours: number;
  minutes: number;
}

export interface WakatimeEditor {
  name: string;
  percent: number;
  total_seconds: number;
  text: string;
}

export interface WakatimeProject {
  name: string;
  percent: number;
  total_seconds: number;
  text: string;
  hours: number;
  minutes: number;
}

export interface WakatimeBestDay {
  date: string;
  total_seconds: number;
  text: string;
}

export interface WakatimeStats {
  total_seconds: number;
  human_readable_total: string;
  daily_average: number;
  human_readable_daily_average: string;
  languages: WakatimeLanguage[];
  editors: WakatimeEditor[];
  projects?: WakatimeProject[];
  best_day?: WakatimeBestDay;
  categories: {
    name: string;
    percent: number;
    total_seconds: number;
    text: string;
  }[];
}

export interface WakatimeAllTimeStats {
  data: {
    total_seconds: number;
    text: string;
    decimal: string;
    digital: string;
    is_up_to_date: boolean;
    percent_calculated: number;
    range: {
      start: string;
      start_date: string;
      start_text: string;
      end: string;
      end_date: string;
      end_text: string;
      timezone: string;
    };
  };
}

export interface WakatimeResponse {
  data: WakatimeStats;
}

export interface WakatimeCombinedStats {
  weeklyStats: WakatimeStats;
  allTimeTotal: string;
  allTimeTotalSeconds: number;
  calendarData?: WakatimeCalendarDay[];
}

export interface WakatimeCalendarDay {
  date: string;
  total_seconds: number;
  level: number;
  text?: string;
}
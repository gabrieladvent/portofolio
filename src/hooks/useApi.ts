import { useState, useEffect } from "react";
import { apiConfig } from "../data/portfolio";
import type { GitHubStats, WakatimeCombinedStats } from "../types/api";

const GITHUB_GRAPHQL_URL = "https://api.github.com/graphql";

const CONTRIBUTIONS_QUERY = `
query($username: String!, $from: DateTime!, $to: DateTime!) {
  user(login: $username) {
    contributionsCollection(from: $from, to: $to) {
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            date
            contributionCount
            color
          }
        }
      }
      totalCommitContributions
      totalIssueContributions
      totalPullRequestContributions
      totalPullRequestReviewContributions
    }
  }
}
`;

export function useGitHubStats() {
  const [stats, setStats] = useState<GitHubStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGitHubStats() {
      try {
        const now = new Date();
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(now.getFullYear() - 1);

        const headers: HeadersInit = {
          "Content-Type": "application/json",
        };

        if (apiConfig.github.token) {
          headers["Authorization"] = `Bearer ${apiConfig.github.token}`;
        }

        const response = await fetch(GITHUB_GRAPHQL_URL, {
          method: "POST",
          headers,
          body: JSON.stringify({
            query: CONTRIBUTIONS_QUERY,
            variables: {
              username: apiConfig.github.username,
              from: oneYearAgo.toISOString(),
              to: now.toISOString(),
            },
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch GitHub data");
        }

        const data = await response.json();

        if (data.errors) {
          throw new Error(data.errors[0]?.message || "GraphQL error");
        }

        setStats(data.data.user.contributionsCollection);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        // Set mock data if API fails
        setStats(generateMockGitHubStats());
      } finally {
        setLoading(false);
      }
    }

    fetchGitHubStats();
  }, []);

  return { stats, loading, error };
}

export function useWakatimeStats() {
  const [stats, setStats] = useState<WakatimeCombinedStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchWakatimeStats() {
      try {
        if (!apiConfig.wakatime.apiKey) {
          throw new Error("Wakatime API key not configured");
        }

        const authHeader = `Basic ${btoa(apiConfig.wakatime.apiKey + ":")}`;

        // Fetch weekly stats
        const weeklyResponse = await fetch(
          "/wakatime/api/v1/users/current/stats/last_7_days",
          {
            headers: {
              Authorization: authHeader,
            },
          },
        );

        // Fetch all time stats
        const allTimeResponse = await fetch(
          "/wakatime/api/v1/users/current/all_time_since_today",
          {
            headers: {
              Authorization: authHeader,
            },
          },
        );

        if (!weeklyResponse.ok) {
          throw new Error("Failed to fetch Wakatime weekly data");
        }

        const weeklyData = await weeklyResponse.json();

        let allTimeTotal = "0 hrs";
        let allTimeTotalSeconds = 0;

        if (allTimeResponse.ok) {
          const allTimeData = await allTimeResponse.json();
          allTimeTotal = allTimeData.data?.text || "0 hrs";
          allTimeTotalSeconds = allTimeData.data?.total_seconds || 0;
        }

        setStats({
          weeklyStats: weeklyData.data,
          allTimeTotal,
          allTimeTotalSeconds,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        // Set mock data if API fails
        setStats(generateMockWakatimeStats());
      } finally {
        setLoading(false);
      }
    }

    fetchWakatimeStats();
  }, []);

  return { stats, loading, error };
}

// Mock data generators for development/demo purposes
function generateMockGitHubStats(): GitHubStats {
  const weeks = [];
  const now = new Date();

  for (let w = 52; w >= 0; w--) {
    const days = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(now);
      date.setDate(date.getDate() - (w * 7 + (6 - d)));
      const count = Math.floor(Math.random() * 12);
      days.push({
        date: date.toISOString().split("T")[0],
        contributionCount: count,
        color:
          count === 0
            ? "#161b22"
            : count < 3
              ? "#0e4429"
              : count < 6
                ? "#006d32"
                : count < 9
                  ? "#26a641"
                  : "#39d353",
      });
    }
    weeks.push({ contributionDays: days });
  }

  const totalContributions = weeks.reduce(
    (sum, week) =>
      sum + week.contributionDays.reduce((s, d) => s + d.contributionCount, 0),
    0,
  );

  return {
    contributionCalendar: {
      totalContributions,
      weeks,
    },
    totalCommitContributions: Math.floor(totalContributions * 0.7),
    totalIssueContributions: Math.floor(totalContributions * 0.1),
    totalPullRequestContributions: Math.floor(totalContributions * 0.15),
    totalPullRequestReviewContributions: Math.floor(totalContributions * 0.05),
  };
}

function generateMockWakatimeStats(): WakatimeCombinedStats {
  // Generate a random best day within the last week
  const bestDayDate = new Date();
  bestDayDate.setDate(bestDayDate.getDate() - Math.floor(Math.random() * 7));

  return {
    weeklyStats: {
      total_seconds: 28260, // 7 hrs 51 mins
      human_readable_total: "7 hrs 51 mins",
      daily_average: 5640, // 1 hr 34 mins
      human_readable_daily_average: "1 hr 34 mins",
      best_day: {
        date: bestDayDate.toISOString().split("T")[0],
        total_seconds: 22860, // 6 hrs 21 mins
        text: "6 hrs 21 mins",
      },
      languages: [
        {
          name: "TypeScript",
          percent: 83,
          total_seconds: 23456,
          text: "6 hrs 31 mins",
          hours: 6,
          minutes: 31,
        },
        {
          name: "Bash",
          percent: 11,
          total_seconds: 3109,
          text: "51 mins",
          hours: 0,
          minutes: 51,
        },
        {
          name: "JSON",
          percent: 1,
          total_seconds: 283,
          text: "4 mins",
          hours: 0,
          minutes: 4,
        },
        {
          name: "Text",
          percent: 1,
          total_seconds: 283,
          text: "4 mins",
          hours: 0,
          minutes: 4,
        },
        {
          name: "Kotlin",
          percent: 1,
          total_seconds: 283,
          text: "4 mins",
          hours: 0,
          minutes: 4,
        },
        {
          name: "XML",
          percent: 1,
          total_seconds: 283,
          text: "4 mins",
          hours: 0,
          minutes: 4,
        },
      ],
      editors: [
        { name: "VS Code", percent: 90, total_seconds: 129600, text: "36 hrs" },
        { name: "Neovim", percent: 10, total_seconds: 14400, text: "4 hrs" },
      ],
      categories: [
        { name: "Coding", percent: 85, total_seconds: 122400, text: "34 hrs" },
        { name: "Debugging", percent: 10, total_seconds: 14400, text: "4 hrs" },
        { name: "Browsing", percent: 5, total_seconds: 7200, text: "2 hrs" },
      ],
    },
    allTimeTotal: "1,031 hrs 47 mins",
    allTimeTotalSeconds: 3714420,
  };
}

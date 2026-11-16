/**
 * WakaTime coding stats, read server-side so the token never reaches the
 * browser.
 *
 * WakaTime's secret API key is write-only now — it is what editor plugins use
 * to send heartbeats, and reading stats with it answers 403. Reads need an
 * OAuth access token sent as a Bearer token. For your own account there is no
 * app to register: sign in and copy one from https://wakatime.com/oauth (the
 * long-lived kind, from `response_type=code`), with the `read_stats` scope.
 *
 * This used to be an open proxy that forwarded any path under /users/current,
 * which also handed out project names, heartbeats and anything else the key
 * could read. Now it asks for exactly two resources and passes on only the
 * fields the page renders — the projects are client work, so they leave here
 * as a count, never as names.
 *
 * Shared by api/wakatime.ts (production) and the dev proxy in vite.config.ts,
 * the same arrangement _visit.ts has with the visit endpoint.
 */

const API = "https://api.wakatime.com/api/v1";

// Several seconds is already a slow page; stats are decoration, not content.
const UPSTREAM_TIMEOUT_MS = 6000;

type Measured = {
  name: string;
  percent: number;
  total_seconds: number;
  text: string;
};

type UpstreamStats = {
  total_seconds?: number;
  human_readable_total?: string;
  daily_average?: number;
  human_readable_daily_average?: string;
  languages?: (Measured & { hours?: number; minutes?: number })[];
  editors?: Measured[];
  operating_systems?: Measured[];
  categories?: Measured[];
  projects?: unknown[];
  best_day?: { date: string; total_seconds: number; text: string } | null;
  days_minus_holidays?: number;
  start?: string;
  end?: string;
  is_up_to_date?: boolean;
};

type UpstreamAllTime = {
  total_seconds?: number;
  text?: string;
  is_up_to_date?: boolean;
};

export type WakatimeResult = {
  status: number;
  body: unknown;
  /**
   * False while WakaTime is still crunching the numbers (it answers 202 with
   * whatever it has so far). The caller caches that briefly instead of for
   * the full hour, so the finished figures show up soon after.
   */
  fresh: boolean;
};

async function read<T>(path: string, token: string) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);

  try {
    const response = await fetch(`${API}${path}`, {
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    // 202 is WakaTime saying "still calculating" — the body is real, just not
    // final yet, so it is worth rendering rather than treating as a failure.
    if (response.status !== 200 && response.status !== 202) {
      return { status: response.status, data: null as T | null };
    }

    const payload = (await response.json()) as { data?: T };
    return { status: response.status, data: payload.data ?? null };
  } catch {
    // Timed out, DNS, upstream down — all the same to the caller.
    return { status: 504, data: null as T | null };
  } finally {
    clearTimeout(timer);
  }
}

const measured = (rows: Measured[] | undefined) =>
  (rows ?? []).map(({ name, percent, total_seconds, text }) => ({
    name,
    percent,
    total_seconds,
    text,
  }));

export async function resolveWakatime(token: string | undefined): Promise<WakatimeResult> {
  if (!token) {
    return {
      status: 503,
      body: { error: "WAKATIME_ACCESS_TOKEN not configured" },
      fresh: false,
    };
  }

  const [weekly, allTime] = await Promise.all([
    read<UpstreamStats>("/users/current/stats/last_7_days", token),
    read<UpstreamAllTime>("/users/current/all_time_since_today", token),
  ]);

  const stats = weekly.data;

  if (!stats) {
    // 401/403 almost always means the old API key is still configured, or the
    // token lacks `read_stats` — worth saying, since it is the one fixable case.
    const denied = weekly.status === 401 || weekly.status === 403;
    return {
      status: weekly.status === 504 ? 504 : 502,
      body: {
        error: denied
          ? "WakaTime rejected the token — it needs an OAuth token with read_stats"
          : "Failed to fetch from WakaTime",
      },
      fresh: false,
    };
  }

  return {
    status: 200,
    fresh:
      weekly.status === 200 &&
      stats.is_up_to_date !== false &&
      allTime.status === 200,
    body: {
      weeklyStats: {
        total_seconds: stats.total_seconds ?? 0,
        human_readable_total: stats.human_readable_total ?? "0 secs",
        daily_average: stats.daily_average ?? 0,
        human_readable_daily_average: stats.human_readable_daily_average ?? "0 secs",
        languages: (stats.languages ?? []).map((row) => ({
          name: row.name,
          percent: row.percent,
          total_seconds: row.total_seconds,
          text: row.text,
          hours: row.hours ?? 0,
          minutes: row.minutes ?? 0,
        })),
        editors: measured(stats.editors),
        operating_systems: measured(stats.operating_systems),
        categories: measured(stats.categories),
        project_count: stats.projects?.length ?? 0,
        best_day: stats.best_day
          ? {
              date: stats.best_day.date,
              total_seconds: stats.best_day.total_seconds,
              text: stats.best_day.text,
            }
          : undefined,
        days_minus_holidays: stats.days_minus_holidays,
        start: stats.start,
        end: stats.end,
      },
      allTimeTotal: allTime.data?.text || "0 hrs",
      allTimeTotalSeconds: allTime.data?.total_seconds || 0,
    },
  };
}

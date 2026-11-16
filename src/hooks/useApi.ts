import { useState, useEffect } from "react";
import { personalInfo } from "../data/portfolio";
import type {
  GitHubProfile,
  GitHubStats,
  WakatimeCombinedStats,
} from "../types/api";

// Both GitHub endpoints go through /api/github so the token stays server-side.
export function useGitHubStats() {
  const [stats, setStats] = useState<GitHubStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchGitHubStats() {
      try {
        const response = await fetch("/api/github?resource=contributions", {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Failed to fetch GitHub data");
        }

        setStats(await response.json());
      } catch (err) {
        if (controller.signal.aborted) return;
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    fetchGitHubStats();
    return () => controller.abort();
  }, []);

  return { stats, loading, error };
}

export function useWakatimeStats() {
  const [stats, setStats] = useState<WakatimeCombinedStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchWakatimeStats() {
      try {
        // One call: /api/wakatime fetches the week and the all-time total
        // together server-side and hands back only what the page renders.
        const response = await fetch("/api/wakatime", {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Failed to fetch Wakatime data");
        }

        setStats(await response.json());
      } catch (err) {
        if (controller.signal.aborted) return;
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    fetchWakatimeStats();
    return () => controller.abort();
  }, []);

  return { stats, loading, error };
}

export function useGitHubProfile() {
  const [profile, setProfile] = useState<GitHubProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchProfile() {
      try {
        const response = await fetch("/api/github?resource=profile", {
          signal: controller.signal,
        });

        if (!response.ok) throw new Error("Failed to fetch GitHub profile");

        setProfile(await response.json());
      } catch (err) {
        if (controller.signal.aborted) return;
        setError(err instanceof Error ? err.message : "Unknown error");

        setProfile({
          avatar_url: personalInfo.avatar,
          name: personalInfo.name,
          bio: personalInfo.bio,
          public_repos: 0,
          followers: 0,
          following: 0,
        });
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    fetchProfile();
    return () => controller.abort();
  }, []);

  return { profile, loading, error };
}

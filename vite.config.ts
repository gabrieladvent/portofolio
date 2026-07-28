import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

/**
 * `vite dev` doesn't run the serverless functions in /api, so this mirrors
 * /api/github.ts locally. Production still goes through the real handler.
 */
function githubDevProxy(env: Record<string, string>): Plugin {
  return {
    name: "github-dev-proxy",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use("/api/github", async (req, res) => {
        const token = env.GITHUB_TOKEN;
        const username = env.GITHUB_USERNAME;
        const resource = new URL(
          req.url ?? "",
          "http://localhost",
        ).searchParams.get("resource");

        const send = (status: number, body: unknown) => {
          res.statusCode = status;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(body));
        };

        if (!username) return send(500, { error: "GITHUB_USERNAME not set" });

        const headers: Record<string, string> = {
          "Content-Type": "application/json",
          Accept: "application/vnd.github+json",
        };
        if (token) headers.Authorization = `Bearer ${token}`;

        try {
          if (resource === "profile") {
            const url = `https://api.github.com/users/${encodeURIComponent(username)}`;
            let upstream = await fetch(url, { headers });

            if (upstream.status === 401 && token) {
              const anonymous = { ...headers };
              delete anonymous.Authorization;
              upstream = await fetch(url, { headers: anonymous });
            }

            if (!upstream.ok) return send(upstream.status, { error: "GitHub error" });
            const data = (await upstream.json()) as Record<string, unknown>;
            return send(200, {
              avatar_url: data.avatar_url,
              name: data.name,
              bio: data.bio,
              public_repos: data.public_repos,
              followers: data.followers,
              following: data.following,
            });
          }

          if (resource === "contributions") {
            if (!token) return send(503, { error: "GITHUB_TOKEN not set" });

            const now = new Date();
            const from = new Date(now);
            from.setFullYear(now.getFullYear() - 1);

            const upstream = await fetch("https://api.github.com/graphql", {
              method: "POST",
              headers,
              body: JSON.stringify({
                query: `query($username: String!, $from: DateTime!, $to: DateTime!) {
                  user(login: $username) {
                    contributionsCollection(from: $from, to: $to) {
                      contributionCalendar {
                        totalContributions
                        weeks { contributionDays { date contributionCount color } }
                      }
                      totalCommitContributions
                      totalIssueContributions
                      totalPullRequestContributions
                      totalPullRequestReviewContributions
                    }
                  }
                }`,
                variables: {
                  username,
                  from: from.toISOString(),
                  to: now.toISOString(),
                },
              }),
            });

            if (!upstream.ok) {
              return send(upstream.status, { error: "GitHub GraphQL rejected" });
            }

            const payload = (await upstream.json()) as {
              data?: { user?: { contributionsCollection?: unknown } };
              errors?: { message?: string }[];
            };
            if (payload.errors?.length) {
              return send(502, { error: payload.errors[0]?.message });
            }

            const contributions = payload.data?.user?.contributionsCollection;
            if (!contributions) return send(404, { error: "GitHub user not found" });

            return send(200, contributions);
          }

          return send(400, { error: "Unknown resource" });
        } catch {
          return send(500, { error: "Failed to fetch from GitHub" });
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react(), githubDevProxy(env)],
    build: {
      rollupOptions: {
        output: {
          // Libraries change far less often than the site itself, so give them
          // their own long-lived cache entry.
          manualChunks: {
            react: ["react", "react-dom"],
            motion: ["motion", "lenis"],
          },
        },
      },
    },
    server: {
      proxy: {
        "/api/wakatime": {
          target: "https://wakatime.com",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/wakatime/, "/api/v1"),
          headers: {
            Authorization: `Basic ${Buffer.from(env.WAKATIME_API_KEY + ":").toString("base64")}`,
          },
        },
      },
    },
  };
});

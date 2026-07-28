import type { VercelRequest, VercelResponse } from "@vercel/node";

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

/**
 * Proxies GitHub reads so the token never reaches the browser bundle.
 * `?resource=profile` -> REST user object, `?resource=contributions` -> GraphQL calendar.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
    const token = process.env.GITHUB_TOKEN;
    const username = process.env.GITHUB_USERNAME;

    if (!username) {
        return res.status(500).json({ error: "GitHub username not configured" });
    }

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        Accept: "application/vnd.github+json",
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const resource = Array.isArray(req.query.resource)
        ? req.query.resource[0]
        : req.query.resource;

    try {
        if (resource === "profile") {
            const url = `https://api.github.com/users/${encodeURIComponent(username)}`;

            let response = await fetch(url, { headers });

            // The profile is public: an expired token shouldn't take it down,
            // it only costs the higher authenticated rate limit.
            if (response.status === 401 && token) {
                const anonymous = { ...headers };
                delete anonymous.Authorization;
                response = await fetch(url, { headers: anonymous });
            }

            if (!response.ok) {
                return res
                    .status(response.status)
                    .json({ error: "Failed to fetch GitHub profile" });
            }

            const data = await response.json();

            res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate");

            return res.status(200).json({
                avatar_url: data.avatar_url,
                name: data.name,
                bio: data.bio,
                public_repos: data.public_repos,
                followers: data.followers,
                following: data.following,
            });
        }

        if (resource === "contributions") {
            // The contribution calendar is GraphQL-only, and GraphQL always needs a token.
            if (!token) {
                return res.status(503).json({ error: "GitHub token not configured" });
            }

            const now = new Date();
            const oneYearAgo = new Date(now);
            oneYearAgo.setFullYear(now.getFullYear() - 1);

            const response = await fetch(GITHUB_GRAPHQL_URL, {
                method: "POST",
                headers,
                body: JSON.stringify({
                    query: CONTRIBUTIONS_QUERY,
                    variables: {
                        username,
                        from: oneYearAgo.toISOString(),
                        to: now.toISOString(),
                    },
                }),
            });

            if (!response.ok) {
                return res
                    .status(response.status)
                    .json({ error: "Failed to fetch GitHub contributions" });
            }

            const payload = await response.json();

            if (payload.errors?.length) {
                return res
                    .status(502)
                    .json({ error: payload.errors[0]?.message || "GraphQL error" });
            }

            const contributions = payload.data?.user?.contributionsCollection;

            if (!contributions) {
                return res.status(404).json({ error: "GitHub user not found" });
            }

            res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate");

            return res.status(200).json(contributions);
        }

        return res.status(400).json({ error: "Unknown resource" });
    } catch {
        return res.status(500).json({ error: "Failed to fetch from GitHub" });
    }
}

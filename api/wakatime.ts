import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const apiKey = process.env.WAKATIME_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: "Wakatime API key not configured" });
    }

    const { path, ...queryParams } = req.query;

    // `path` arrives from the vercel.json rewrite as the full sub-path
    // (e.g. "users/current/stats/last_7_days").
    const wakatimePath = Array.isArray(path) ? path.join("/") : (path ?? "");

    const queryString = new URLSearchParams(
        queryParams as Record<string, string>,
    ).toString();

    const url = `https://wakatime.com/api/v1/${wakatimePath}${queryString ? `?${queryString}` : ""}`;

    try {
        const response = await fetch(url, {
            headers: {
                Authorization: `Basic ${Buffer.from(apiKey + ":").toString("base64")}`,
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();

        res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate");

        return res.status(response.status).json(data);
    } catch {
        return res.status(500).json({ error: "Failed to fetch from Wakatime" });
    }
}

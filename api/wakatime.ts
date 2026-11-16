import type { VercelRequest, VercelResponse } from "@vercel/node";
import { resolveWakatime } from "./_wakatime.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { status, body, fresh } = await resolveWakatime(process.env.WAKATIME_ACCESS_TOKEN);

  if (status === 200) {
    // While WakaTime is still calculating, only hold the partial answer for a
    // minute so the finished numbers replace it quickly.
    res.setHeader(
      "Cache-Control",
      fresh ? "s-maxage=3600, stale-while-revalidate" : "s-maxage=60, stale-while-revalidate",
    );
  } else {
    res.setHeader("Cache-Control", "no-store, max-age=0");
  }

  return res.status(status).json(body);
}

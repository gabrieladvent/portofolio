import type { VercelRequest, VercelResponse } from "@vercel/node";
import { resolveVisit } from "./_visit.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Every other endpoint here sets s-maxage and lets Vercel serve one answer to
  // everyone. That is exactly wrong for a counter: the first visitor's number
  // would be handed out for the rest of the cache window, and nobody else's hit
  // would ever reach the counter at all.
  res.setHeader("Cache-Control", "no-store, max-age=0");

  const { status, body, cookie } = await resolveVisit(
    req.headers.cookie,
    req.headers["user-agent"],
    process.env.VISITOR_COUNTER_NAMESPACE,
  );

  if (cookie) res.setHeader("Set-Cookie", cookie);

  return res.status(status).json(body);
}

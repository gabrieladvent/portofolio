import type { VercelRequest, VercelResponse } from "@vercel/node";
import { streamChat } from "./_chat";

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const forwarded = req.headers["x-forwarded-for"];
    const ip = (Array.isArray(forwarded) ? forwarded[0] : forwarded || "unknown")
        .split(",")[0]
        .trim();

    await streamChat(req.body, ip, res, process.env.GEMINI_API_KEY);
}

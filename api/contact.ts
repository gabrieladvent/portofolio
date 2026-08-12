import type { VercelRequest, VercelResponse } from "@vercel/node";

const MAX_LENGTHS = { name: 100, email: 200, message: 5000 };

const RATE_LIMIT = { max: 3, windowMs: 10 * 60 * 1000 };

// Per-instance memory only: a warm Vercel function keeps this between requests,
// a cold start resets it. Enough to stop a single client hammering the endpoint
// without pulling in an external store.
const hits = new Map<string, number[]>();

function isRateLimited(ip: string) {
    const now = Date.now();
    const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT.windowMs);

    if (recent.length >= RATE_LIMIT.max) {
        hits.set(ip, recent);
        return true;
    }

    recent.push(now);
    hits.set(ip, recent);

    // Opportunistic cleanup so the map can't grow without bound.
    if (hits.size > 500) {
        for (const [key, times] of hits) {
            if (times.every((t) => now - t >= RATE_LIMIT.windowMs)) hits.delete(key);
        }
    }

    return false;
}

function escapeHtml(value: string) {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

/**
 * Delivers contact form submissions through Resend.
 * Returns 503 when no key is configured so the client can fall back to mailto.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const apiKey = process.env.RESEND_API_KEY;
    const to = process.env.CONTACT_TO_EMAIL;

    if (!apiKey || !to) {
        return res.status(503).json({ error: "Contact delivery not configured" });
    }

    const forwarded = req.headers["x-forwarded-for"];
    const ip = (Array.isArray(forwarded) ? forwarded[0] : forwarded || "unknown")
        .split(",")[0]
        .trim();

    if (isRateLimited(ip)) {
        return res
            .status(429)
            .json({ error: "Too many messages. Please try again later." });
    }

    const { name, email, message, company } = (req.body ?? {}) as Record<string, unknown>;

    // Honeypot: real visitors never see this field, bots fill everything.
    if (typeof company === "string" && company.trim() !== "") {
        return res.status(200).json({ ok: true });
    }

    if (
        typeof name !== "string" ||
        typeof email !== "string" ||
        typeof message !== "string" ||
        !name.trim() ||
        !message.trim() ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
        return res.status(400).json({ error: "Invalid form submission" });
    }

    if (
        name.length > MAX_LENGTHS.name ||
        email.length > MAX_LENGTHS.email ||
        message.length > MAX_LENGTHS.message
    ) {
        return res.status(400).json({ error: "Submission too long" });
    }

    try {
        const response = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                from: process.env.CONTACT_FROM_EMAIL || "onboarding@resend.dev",
                to: [to],
                reply_to: email,
                subject: `Portfolio message from ${name}`,
                html: `
                    <p><strong>From:</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p>
                    <hr />
                    <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
                `,
            }),
        });

        if (!response.ok) {
            return res.status(502).json({ error: "Failed to deliver message" });
        }

        return res.status(200).json({ ok: true });
    } catch {
        return res.status(500).json({ error: "Failed to deliver message" });
    }
}

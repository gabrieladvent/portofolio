import type { ServerResponse } from "node:http";
import { systemPrompt } from "./_persona";

const GEMINI_HOST = "https://generativelanguage.googleapis.com/v1beta/models";
const DEFAULT_MODEL = "gemini-flash-latest";
const LIMITS = {
    max: 20,
    windowMs: 10 * 60 * 1000,
    question: 600,
    history: 12,
    answer: 1200,
};

const hits = new Map<string, number[]>();

function isRateLimited(ip: string) {
    const now = Date.now();
    const recent = (hits.get(ip) ?? []).filter((time) => now - time < LIMITS.windowMs);

    if (recent.length >= LIMITS.max) {
        hits.set(ip, recent);
        return true;
    }

    recent.push(now);
    hits.set(ip, recent);

    if (hits.size > 500) {
        for (const [key, times] of hits) {
            if (times.every((time) => now - time >= LIMITS.windowMs)) hits.delete(key);
        }
    }

    return false;
}

const CACHE = { ttlMs: 24 * 60 * 60 * 1000, max: 200, similarity: 0.8 };
const answers = new Map<string, { text: string; at: number; words: Set<string> }>();

const FILLER = new Set([
    "a", "an", "the", "is", "are", "was", "do", "does", "did", "you", "your", "yours", "me", "my",
    "i", "of", "in", "on", "at", "to", "for", "with", "and", "or", "what", "whats", "how", "why",
    "can", "could", "would", "tell", "about", "please", "hi", "hello", "hey",
    "so", "well", "just", "ok", "okay", "oh", "actually", "really", "also", "now", "then", "some",
    "apa", "apakah", "yang", "kamu", "anda", "kah", "itu", "ini", "di", "ke", "dari", "untuk",
    "dan", "atau", "bagaimana", "gimana", "kenapa", "mengapa", "bisa", "tolong", "halo", "hai",
    "sih", "dong", "ya", "aja", "saja", "nya",
    "jadi", "terus", "lalu", "nah", "kalau", "kalo", "mau", "ingin", "pengen", "deh", "kok",
    "emang", "memang", "coba", "mas", "kak", "bang", "sebenarnya", "kira",
]);

function keywords(question: string) {
    const words = question
        .toLowerCase()
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .replace(/[^\p{L}\p{N}\s]/gu, " ")
        .split(/\s+/)
        .filter((word) => word && !FILLER.has(word));

    return new Set(words.length ? words : question.toLowerCase().split(/\s+/).filter(Boolean));
}

function overlap(a: Set<string>, b: Set<string>) {
    let shared = 0;
    for (const word of a) if (b.has(word)) shared++;
    return shared / (a.size + b.size - shared);
}

function cached(question: string, model: string) {
    const now = Date.now();
    const wanted = keywords(question);
    let best: { text: string; score: number } | null = null;

    for (const [key, entry] of answers) {
        if (now - entry.at >= CACHE.ttlMs) {
            answers.delete(key);
            continue;
        }
        if (!key.startsWith(`${model} `)) continue;

        const score = overlap(wanted, entry.words);
        if (score >= CACHE.similarity && (!best || score > best.score)) {
            best = { text: entry.text, score };
        }
    }

    return best?.text ?? null;
}

function remember(question: string, model: string, text: string) {
    if (!text.trim()) return;

    const words = keywords(question);
    answers.set(`${model} ${[...words].sort().join(" ")}`, { text, at: Date.now(), words });

    while (answers.size > CACHE.max) {
        const oldest = answers.keys().next().value;
        if (oldest === undefined) break;
        answers.delete(oldest);
    }
}

export type ChatMessage = { role: "user" | "assistant"; content: string };

function parseMessages(body: unknown): ChatMessage[] | null {
    const raw = (body as { messages?: unknown })?.messages;
    if (!Array.isArray(raw) || raw.length === 0) return null;

    const messages: ChatMessage[] = [];
    for (const entry of raw.slice(-LIMITS.history)) {
        const role = (entry as ChatMessage)?.role;
        const content = (entry as ChatMessage)?.content;
        if (role !== "user" && role !== "assistant") return null;
        if (typeof content !== "string" || !content.trim()) return null;
        messages.push({ role, content: content.slice(0, LIMITS.question) });
    }

    if (messages[0].role !== "user" || messages[messages.length - 1].role !== "user") {
        return null;
    }
    return messages;
}

function fail(res: ServerResponse, status: number, error: string, detail?: string) {
    if (detail) console.error(`[chat] ${status} — ${detail}`);

    res.statusCode = status;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(process.env.CHAT_DEBUG && detail ? { error, detail } : { error }));
}

export async function streamChat(
    body: unknown,
    ip: string,
    res: ServerResponse,
    apiKey: string | undefined,
) {
    if (!apiKey) {
        return fail(res, 503, "This chat isn't switched on yet.", "GEMINI_API_KEY is not set");
    }

    const messages = parseMessages(body);
    if (!messages) {
        return fail(res, 400, "I couldn't read that.", "Malformed conversation in the request body");
    }

    if (isRateLimited(ip)) {
        return fail(res, 429, "That's a lot of questions at once — give it a few minutes.");
    }

    const model = process.env.GEMINI_MODEL || DEFAULT_MODEL;

    const opening = messages.length === 1 ? messages[0].content : null;
    const hit = opening ? cached(opening, model) : null;

    if (hit) {
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/plain; charset=utf-8");
        res.setHeader("Cache-Control", "no-store");
        res.setHeader("X-Chat-Cache", "hit");
        return res.end(hit);
    }

    let upstream: Response;
    try {
        upstream = await fetch(`${GEMINI_HOST}/${model}:streamGenerateContent?alt=sse`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-goog-api-key": apiKey,
            },
            body: JSON.stringify({
                system_instruction: { parts: [{ text: systemPrompt() }] },
                contents: messages.map((message) => ({
                    role: message.role === "assistant" ? "model" : "user",
                    parts: [{ text: message.content }],
                })),
                generationConfig: {
                    maxOutputTokens: LIMITS.answer,
                    temperature: 0.7,
                    thinkingConfig: { thinkingLevel: "low" },
                },
            }),
        });
    } catch (cause) {
        const why = (cause as Error)?.cause ?? cause;
        return fail(res, 502, "I couldn't reach the model just now.", `fetch failed: ${cause} — ${why}`);
    }

    if (!upstream.ok || !upstream.body) {
        const detail = await upstream.text().catch(() => "");

        if (upstream.status === 429) {
            return fail(res, 429, "I've used up my quota for now — try later.", detail);
        }
        return fail(res, 502, "I couldn't reach the model just now.", `${upstream.status} ${detail}`);
    }

    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("X-Accel-Buffering", "no");
    res.setHeader("X-Chat-Cache", "miss");

    const reader = upstream.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let answer = "";

    try {
        for (;;) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() ?? "";

            for (const line of lines) {
                if (!line.startsWith("data:")) continue;
                const payload = line.slice(5).trim();
                if (!payload) continue;

                try {
                    const event = JSON.parse(payload);
                    const parts = event?.candidates?.[0]?.content?.parts;
                    if (Array.isArray(parts)) {
                        for (const part of parts) {
                            if (part?.thought) continue;
                            if (typeof part?.text !== "string") continue;
                            answer += part.text;
                            res.write(part.text);
                        }
                    }
                } catch {
                    // A frame we cannot read is one dropped word, not a dead stream.
                }
            }
        }
        
        if (opening) remember(opening, model, answer);
    } catch {
        // Connection died mid-answer; the visitor keeps whatever arrived, and
        // nothing is cached.
    }

    res.end();
}

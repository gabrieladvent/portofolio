import { useCallback, useRef, useState } from "react";

export type ChatMessage = { role: "user" | "assistant"; content: string };

/** Must match FOLLOWUP_MARKER in api/_persona.ts. */
const MARKER = "[[FOLLOWUPS]]";

/** What the panel offers before the visitor has asked anything. */
export const OPENERS = [
    "Tell me about your background",
    "What are you best at?",
    "What have you built lately?",
];

/**
 * The model ends its reply with a marker line of follow-up questions. Split it
 * off before anything is shown — mid-stream the marker itself arrives one
 * character at a time, so a partial marker has to stay hidden too.
 */
function split(raw: string) {
    const cut = raw.indexOf(MARKER);
    if (cut === -1) {
        // Hide a marker still being typed: "[[FOL" should not flash on screen.
        const partial = /\[\[?F?O?L?L?O?W?U?P?S?\]?\]?$/.exec(raw);
        return { answer: partial ? raw.slice(0, partial.index) : raw, followups: [] as string[] };
    }

    const followups = raw
        .slice(cut + MARKER.length)
        .split("|")
        .map((question) => question.trim().replace(/^[-•]\s*/, ""))
        .filter((question) => question.length > 1 && question.length < 80)
        .slice(0, 3);

    return { answer: raw.slice(0, cut).trimEnd(), followups };
}

/**
 * The endpoint writes its own visitor-facing line for every failure it knows
 * about — quota, rate limit, not configured, model unreachable. Reading it back
 * beats mapping status codes here, where the same generic sentence used to
 * stand in for four unrelated problems.
 */
async function reasonFrom(response: Response) {
    try {
        const body = await response.json();
        if (typeof body?.error === "string") {
            // Only present when CHAT_DEBUG is set on the server.
            if (typeof body?.detail === "string") console.error("[chat]", body.detail);
            return body.error;
        }
    } catch {
        // Not JSON — fall through to the generic line.
    }
    return "Something went wrong reaching me. Try again in a moment.";
}

/**
 * One conversation: the transcript, the reply currently arriving, and the
 * follow-up chips the last reply suggested.
 */
export function useChat() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [streaming, setStreaming] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [suggestions, setSuggestions] = useState<string[]>(OPENERS);
    const inFlight = useRef<AbortController | null>(null);

    const send = useCallback(
        async (text: string) => {
            const question = text.trim();
            if (!question || inFlight.current) return;

            const history: ChatMessage[] = [...messages, { role: "user", content: question }];
            setMessages([...history, { role: "assistant", content: "" }]);
            setSuggestions([]);
            setError(null);
            setStreaming(true);

            const controller = new AbortController();
            inFlight.current = controller;

            try {
                const response = await fetch("/api/chat", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ messages: history }),
                    signal: controller.signal,
                });

                if (!response.ok || !response.body) {
                    setError(await reasonFrom(response));
                    // Drop the empty bubble that was waiting for an answer.
                    setMessages(history);
                    setSuggestions(messages.length ? [] : OPENERS);
                    return;
                }

                const reader = response.body.getReader();
                const decoder = new TextDecoder();
                let raw = "";

                for (;;) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    raw += decoder.decode(value, { stream: true });
                    const { answer } = split(raw);
                    setMessages([...history, { role: "assistant", content: answer }]);
                }

                const { answer, followups } = split(raw);
                setMessages([...history, { role: "assistant", content: answer }]);
                setSuggestions(followups);
            } catch (cause) {
                if ((cause as Error)?.name === "AbortError") return;
                // fetch only throws for transport trouble — offline, DNS, a
                // connection cut mid-answer. The server never got to reply.
                setError("I couldn't reach the server. Check your connection and try again.");
                setMessages(history);
            } finally {
                inFlight.current = null;
                setStreaming(false);
            }
        },
        [messages],
    );

    const reset = useCallback(() => {
        inFlight.current?.abort();
        inFlight.current = null;
        setMessages([]);
        setSuggestions(OPENERS);
        setError(null);
        setStreaming(false);
    }, []);

    return { messages, streaming, error, suggestions, send, reset };
}

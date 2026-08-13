import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CornerDownRight, MessageCircle, RotateCcw, Send, Volume2, VolumeX, X } from "lucide-react";
import { personalInfo } from "../../data/portfolio";
import { useChat } from "../../hooks/useChat";
import { useMediaQuery } from "../../hooks/useMediaQuery";

const firstName = personalInfo.name.split(" ")[0];

const SPLIT_FROM = "(min-width: 1024px)";

const WIDTH = { min: 300, fallback: 380, max: 640, share: 0.55, step: 24 };
const WIDTH_KEY = "chat:width";

function clampWidth(px: number) {
    const ceiling = Math.min(WIDTH.max, window.innerWidth * WIDTH.share);
    return Math.round(Math.max(WIDTH.min, Math.min(px, ceiling)));
}

function storedWidth() {
    try {
        return clampWidth(Number(localStorage.getItem(WIDTH_KEY)) || WIDTH.fallback);
    } catch {
        return WIDTH.fallback;
    }
}

function setPane(px: number) {
    document.documentElement.style.setProperty("--chat-pane", `${px}px`);
}

const panelMotion = {
    initial: { x: "-100%" },
    animate: { x: 0 },
    exit: { x: "-100%" },
    transition: { duration: 0.32, ease: [0.32, 0.72, 0, 1] as const },
};

function Bubble({
    role,
    content,
    streaming,
}: {
    role: "user" | "assistant";
    content: string;
    streaming?: boolean;
}) {
    if (role === "user") {
        return (
            <li className="flex justify-end">
                <p className="max-w-[85%] rounded-2xl rounded-br-md bg-emerald-500 px-3.5 py-2 text-sm leading-relaxed text-white">
                    {content}
                </p>
            </li>
        );
    }

    return (
        <li className="flex justify-start">
            <p className="max-w-[92%] whitespace-pre-wrap rounded-2xl rounded-bl-md bg-black/[0.04] px-3.5 py-2 text-sm leading-relaxed text-zinc-700 dark:bg-white/[0.06] dark:text-zinc-200">
                {content}
                {streaming && (
                    <span className="ml-0.5 inline-block h-3.5 w-1.5 animate-pulse rounded-[1px] bg-emerald-500 align-middle" />
                )}
            </p>
        </li>
    );
}

function Thinking({ still }: { still: boolean }) {
    return (
        <li className="flex justify-start">
            <p className="flex items-center gap-2.5 rounded-2xl rounded-bl-md bg-black/[0.04] px-3.5 py-2.5 dark:bg-white/[0.06]">
                <span className="flex gap-1">
                    {[0, 1, 2].map((dot) => (
                        <motion.span
                            key={dot}
                            animate={still ? undefined : { opacity: [0.25, 1, 0.25] }}
                            transition={{
                                duration: 1.1,
                                repeat: Infinity,
                                delay: dot * 0.18,
                                ease: "easeInOut",
                            }}
                            className="h-1.5 w-1.5 rounded-full bg-emerald-500"
                        />
                    ))}
                </span>
                <span className="font-mono text-xs text-zinc-400 dark:text-zinc-500">thinking</span>
            </p>
        </li>
    );
}

export default function AskWidget() {
    const [open, setOpen] = useState(false);
    const [voice, setVoice] = useState(false);
    const [draft, setDraft] = useState("");
    const { messages, streaming, error, suggestions, send, reset } = useChat();
    const reduceMotion = useReducedMotion();
    const split = useMediaQuery(SPLIT_FROM);

    const input = useRef<HTMLInputElement>(null);
    const scroller = useRef<HTMLDivElement>(null);
    const spoken = useRef("");
    const width = useRef(WIDTH.fallback);

    const show = useCallback(() => {
        width.current = storedWidth();
        if (window.matchMedia(SPLIT_FROM).matches) setPane(width.current);
        setOpen(true);
    }, []);

    const hide = useCallback(() => {
        setPane(0);
        setOpen(false);
    }, []);

    useEffect(() => {
        if (!open) return;
        setPane(split ? width.current : 0);
        return () => setPane(0);
    }, [open, split]);

    const resize = useCallback((next: number) => {
        width.current = clampWidth(next);
        setPane(width.current);
        try {
            localStorage.setItem(WIDTH_KEY, String(width.current));
        } catch {
            // Not remembering the width is survivable.
        }
    }, []);

    useEffect(() => {
        if (!open) return;
        const onKey = (event: KeyboardEvent) => {
            if (event.key === "Escape") hide();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, hide]);

    useEffect(() => {
        if (open) input.current?.focus();
    }, [open]);

    useEffect(() => {
        const element = scroller.current;
        if (element) element.scrollTop = element.scrollHeight;
    }, [messages, suggestions]);

    useEffect(() => {
        if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
        if (!voice || streaming || !open) return;

        const last = messages[messages.length - 1];
        if (!last || last.role !== "assistant" || !last.content) return;
        if (spoken.current === last.content) return;

        spoken.current = last.content;
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(new SpeechSynthesisUtterance(last.content));
    }, [voice, streaming, messages, open]);

    useEffect(() => {
        if (voice && open) return;
        if (typeof window !== "undefined" && "speechSynthesis" in window) {
            window.speechSynthesis.cancel();
        }
    }, [voice, open]);

    const ask = (text: string) => {
        setDraft("");
        void send(text);
    };

    return (
        <>
            {/* Hidden while the drawer is out: at the bottom-left corner it
                would otherwise sit on top of the panel it opened. */}
            <AnimatePresence>
                {!open && (
                    <motion.button
                        type="button"
                        onClick={show}
                        aria-label={`Ask ${firstName} anything`}
                        aria-expanded={false}
                        initial={reduceMotion ? undefined : { opacity: 0, scale: 0.8 }}
                        animate={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
                        exit={reduceMotion ? undefined : { opacity: 0, scale: 0.8 }}
                        whileHover={reduceMotion ? undefined : { scale: 1.05 }}
                        whileTap={reduceMotion ? undefined : { scale: 0.95 }}
                        transition={{ duration: 0.18 }}
                        className="fixed bottom-5 left-5 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-900 text-white shadow-lg shadow-black/20 transition-colors hover:bg-emerald-600 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-emerald-500 dark:hover:text-white"
                    >
                        <MessageCircle className="h-5 w-5" />
                    </motion.button>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {open && (
                    <motion.div
                        role="dialog"
                        aria-label={`Ask ${firstName}`}
                        {...(reduceMotion ? {} : panelMotion)}
                        className="fixed inset-y-0 left-0 z-50 flex h-svh w-[min(26rem,100vw)] flex-col border-r border-black/[0.08] bg-white shadow-[8px_0_40px_-24px_rgba(0,0,0,0.5)] lg:w-[var(--chat-pane)] lg:shadow-none dark:border-white/10 dark:bg-zinc-900"
                    >
                        {/* The divider. A thin line to look at, a wider strip to
                            grab, and arrow keys for anyone not using a pointer. */}
                        <div
                            role="separator"
                            aria-orientation="vertical"
                            aria-label="Resize the chat panel"
                            tabIndex={0}
                            onPointerDown={(event) => {
                                event.preventDefault();
                                event.currentTarget.setPointerCapture(event.pointerId);
                                document.documentElement.setAttribute("data-chat-dragging", "");
                            }}
                            onPointerMove={(event) => {
                                if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
                                resize(event.clientX);
                            }}
                            onPointerUp={(event) => {
                                event.currentTarget.releasePointerCapture(event.pointerId);
                                document.documentElement.removeAttribute("data-chat-dragging");
                            }}
                            onKeyDown={(event) => {
                                if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
                                event.preventDefault();
                                resize(width.current + (event.key === "ArrowRight" ? WIDTH.step : -WIDTH.step));
                            }}
                            className="group absolute inset-y-0 -right-1.5 z-10 hidden w-3 cursor-col-resize touch-none lg:block"
                        >
                            <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-transparent transition-colors duration-150 group-hover:bg-emerald-500/60 group-focus-visible:bg-emerald-500" />
                        </div>

                        <header className="flex items-center justify-between gap-3 border-b border-black/[0.06] px-4 py-3 dark:border-white/[0.07]">
                            <p className="font-mono text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                                Ask {firstName}
                            </p>
                            <div className="flex items-center gap-1">
                                <button
                                    type="button"
                                    onClick={reset}
                                    aria-label="Start over"
                                    className="rounded-md p-1.5 text-zinc-400 transition-colors hover:bg-black/[0.04] hover:text-zinc-700 dark:hover:bg-white/[0.06] dark:hover:text-zinc-200"
                                >
                                    <RotateCcw className="h-4 w-4" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setVoice((current) => !current)}
                                    aria-pressed={voice}
                                    aria-label={voice ? "Stop reading answers aloud" : "Read answers aloud"}
                                    className={`rounded-md p-1.5 transition-colors hover:bg-black/[0.04] dark:hover:bg-white/[0.06] ${voice
                                        ? "text-emerald-600 dark:text-emerald-400"
                                        : "text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                                        }`}
                                >
                                    {voice ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                                </button>
                                <button
                                    type="button"
                                    onClick={hide}
                                    aria-label="Close the chat"
                                    className="rounded-md p-1.5 text-zinc-400 transition-colors hover:bg-black/[0.04] hover:text-zinc-700 dark:hover:bg-white/[0.06] dark:hover:text-zinc-200"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        </header>

                        {/* data-lenis-prevent: without it the page's smooth scroll
                            swallows the wheel and this list never moves. */}
                        <div
                            ref={scroller}
                            data-lenis-prevent
                            className="flex-1 overflow-y-auto px-4 py-4"
                        >
                            {messages.length === 0 ? (
                                <div className="flex h-full flex-col items-center justify-center px-2 text-center">
                                    <img
                                        src={personalInfo.avatar}
                                        alt=""
                                        aria-hidden="true"
                                        className="h-14 w-14 rounded-full grayscale"
                                    />
                                    <p className="mt-4 font-mono text-sm text-zinc-900 dark:text-zinc-100">
                                        Ask {firstName} anything
                                    </p>
                                    <p className="mt-1.5 text-xs leading-relaxed text-zinc-400 dark:text-zinc-500">
                                        About the work, the stack, or how something was built. Answers come
                                        from what's on this site.
                                    </p>
                                </div>
                            ) : (
                                <ul className="space-y-3">
                                    {messages.map((message, index) => {
                                        const last = index === messages.length - 1;
                                        // An assistant turn with nothing in it
                                        // only exists while we are waiting.
                                        if (message.role === "assistant" && !message.content) {
                                            return <Thinking key={index} still={!!reduceMotion} />;
                                        }
                                        return (
                                            <Bubble
                                                key={index}
                                                {...message}
                                                streaming={last && streaming && message.role === "assistant"}
                                            />
                                        );
                                    })}
                                </ul>
                            )}

                            {error && (
                                <p className="mt-3 font-mono text-xs text-zinc-400 dark:text-zinc-500">
                                    {error}
                                </p>
                            )}
                        </div>

                        {suggestions.length > 0 && !streaming && (
                            <ul className="space-y-0.5 px-3 pb-2">
                                {suggestions.map((question) => (
                                    <li key={question}>
                                        <button
                                            type="button"
                                            onClick={() => ask(question)}
                                            className="flex w-full items-start gap-2 rounded-lg px-2 py-1.5 text-left font-mono text-xs text-zinc-500 transition-colors hover:bg-black/[0.04] hover:text-emerald-600 dark:text-zinc-400 dark:hover:bg-white/[0.06] dark:hover:text-emerald-400"
                                        >
                                            <CornerDownRight className="mt-0.5 h-3 w-3 shrink-0" />
                                            {question}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}

                        <form
                            onSubmit={(event) => {
                                event.preventDefault();
                                if (!streaming) ask(draft);
                            }}
                            className="flex items-center gap-2 border-t border-black/[0.06] px-3 py-2.5 dark:border-white/[0.07]"
                        >
                            <input
                                ref={input}
                                value={draft}
                                onChange={(event) => setDraft(event.target.value)}
                                maxLength={600}
                                placeholder="Ask me anything…"
                                aria-label="Your question"
                                className="min-w-0 flex-1 bg-transparent px-1 font-mono text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none dark:text-zinc-100 dark:placeholder:text-zinc-600"
                            />
                            <button
                                type="submit"
                                disabled={streaming || !draft.trim()}
                                aria-label="Send"
                                className="rounded-full bg-emerald-500 p-2 text-white transition-opacity hover:bg-emerald-600 disabled:opacity-30"
                            >
                                <Send className="h-4 w-4" />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

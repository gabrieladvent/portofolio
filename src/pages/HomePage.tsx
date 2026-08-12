import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { personalInfo } from "../data/portfolio";
import EditorStage from "../components/home/EditorStage";
import PageFooter from "../components/PageFooter";

const ease = [0.21, 0.47, 0.32, 0.98] as const;

const line = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
};

/** The one sentence that is different every time you come back. */
const CLOSERS = [
    "Today that means a queue worker and a Grafana panel nobody looks at until it turns red.",
    "Ask me about the migration that had to be safe to run twice.",
    "Currently: payments, dashboards, and the wiring in between.",
    "Mostly PHP by day, Go when the latency starts to matter.",
    "Three years in, and I still read the logs before the code.",
];

const CLOSER_KEY = "home:closing-line";

/**
 * A line at random — but never the one this browser saw last. Plain randomness
 * repeats itself a fifth of the time, and a repeat is exactly the "it always
 * says the same thing" this is meant to fix.
 */
function pickCloser() {
    let last = -1;
    try {
        last = Number(localStorage.getItem(CLOSER_KEY) ?? -1);
    } catch {
        // Private mode, or storage denied: fall back to plain random.
    }
    const pool = CLOSERS.map((_, index) => index).filter((index) => index !== last);
    return pool[Math.floor(Math.random() * pool.length)];
}

export default function HomePage() {
    const reduceMotion = useReducedMotion();

    // Chosen once per mount, not per render — a line that reshuffled on every
    // re-render would be noise, not a greeting.
    const [closer] = useState(pickCloser);

    useEffect(() => {
        document.title = `${personalInfo.name} — ${personalInfo.title}`;
    }, []);

    // Remembered after the fact rather than inside the picker: in development
    // React runs the initialiser twice, and writing there would rule out the
    // line actually on screen.
    useEffect(() => {
        try {
            localStorage.setItem(CLOSER_KEY, String(closer));
        } catch {
            // Nothing to remember by; the next visit just picks freely.
        }
    }, [closer]);

    return (
        <>
            <main>
                <motion.section
                    initial={reduceMotion ? undefined : "hidden"}
                    animate="show"
                    variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09 } } }}
                    // A full screen of its own. The window is pinned and centred
                    // in the next one, so anything shorter here just leaves a
                    // band of empty page between the two.
                    className="mx-auto flex min-h-svh max-w-4xl flex-col px-4 pt-24 pb-8 sm:px-6"
                >
                    {/* The copy takes the free space above the hint, which leaves
                        the hint at the foot of the screen — close to the window it
                        is pointing at, rather than stranded halfway up. */}
                    <div className="my-auto">
                        <motion.p
                            variants={line}
                            className="font-mono text-xs text-zinc-400 dark:text-zinc-500"
                        >
                            {personalInfo.title} · {personalInfo.location}
                        </motion.p>

                        <motion.h1
                            variants={line}
                            className="mt-4 text-3xl font-bold leading-[1.15] tracking-tight text-zinc-900 sm:text-5xl dark:text-zinc-100"
                        >
                            Building systems that{" "}
                            <span className="text-emerald-600 dark:text-emerald-400">
                                keep their promises
                            </span>
                            .
                        </motion.h1>

                        <motion.p
                            variants={line}
                            className="mt-6 max-w-2xl leading-relaxed text-zinc-500 dark:text-zinc-400"
                        >
                            Laravel and Go underneath, React and TypeScript on top.
                        </motion.p>

                        {/* The line that changes. Its own paragraph and a step
                            lighter, so it reads as an aside rather than as part
                            of the fixed introduction. */}
                        <motion.p
                            key={closer}
                            variants={line}
                            className="mt-3 max-w-2xl leading-relaxed text-zinc-400 dark:text-zinc-500"
                        >
                            {CLOSERS[closer]}
                        </motion.p>
                    </div>

                    {/* <motion.div variants={line} className="mt-8 flex flex-wrap items-center gap-5">
                        <a
                            href="/work"
                            className="group inline-flex items-center gap-2 rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-600 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-emerald-500 dark:hover:text-white"
                        >
                            See the work
                            <ArrowRight
                                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                                strokeWidth={2}
                            />
                        </a>
                        <a
                            href="/about"
                            className="text-sm text-zinc-400 transition-colors hover:text-emerald-600 dark:text-zinc-500 dark:hover:text-emerald-400"
                        >
                            About me
                        </a>
                    </motion.div> */}

                    <motion.p
                        variants={line}
                        aria-hidden="true"
                        className="mt-10 font-mono text-[11px] tracking-widest text-zinc-400 dark:text-zinc-600 center"
                    >
                        ↓ scroll to open the window
                    </motion.p>
                </motion.section>

                <EditorStage />
            </main>

            <PageFooter />
        </>
    );
}

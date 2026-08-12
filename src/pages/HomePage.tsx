import { useEffect } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { personalInfo } from "../data/portfolio";
import EditorStage from "../components/home/EditorStage";
import PageFooter from "../components/PageFooter";

const ease = [0.21, 0.47, 0.32, 0.98] as const;

const line = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
};

export default function HomePage() {
    const reduceMotion = useReducedMotion();

    useEffect(() => {
        document.title = `${personalInfo.name} — ${personalInfo.title}`;
    }, []);

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
                    className="mx-auto flex min-h-svh max-w-4xl flex-col justify-center px-4 pt-24 pb-16 sm:px-6"
                >
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
                        Building scalable systems and{" "}
                        <span className="text-emerald-600 dark:text-emerald-400">
                            usable interfaces
                        </span>
                        .
                    </motion.h1>

                    <motion.p
                        variants={line}
                        className="mt-6 max-w-2xl leading-relaxed text-zinc-500 dark:text-zinc-400"
                    >
                        Laravel and Go underneath, React and TypeScript on top. I care most about
                        whether a system fails in a way someone can debug — and about the next
                        person who opens the file.
                    </motion.p>

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

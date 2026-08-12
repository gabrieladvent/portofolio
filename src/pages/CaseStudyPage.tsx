import { useEffect, useMemo } from "react";
import { motion } from "motion/react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { personalInfo, projects, type Project } from "../data/portfolio";
import PageFooter from "../components/PageFooter";
import { byNewest, longStamp } from "../utils/projectDate";

const ease = [0.21, 0.47, 0.32, 0.98] as const;

const CATEGORY_LABELS: Record<Project["category"], string> = {
    web: "Web Development",
    backend: "Backend & Data",
    mobile: "Mobile",
    other: "Other",
};

/**
 * Paragraphs in portfolio.ts are written one per source line, with the template
 * literal's indentation baked in — so split on newlines and squash the leftover
 * whitespace rather than looking for blank-line separators, which only some of
 * the entries use.
 */
function paragraphsOf(project: Project) {
    return (project.longDescription ?? project.description)
        .split("\n")
        .map((line) => line.replace(/\s+/g, " ").trim())
        .filter(Boolean);
}

function NotFound() {
    return (
        <>
            <main className="px-4 pt-32 pb-24 sm:px-6">
                <div className="mx-auto max-w-7xl rounded-3xl border border-black/[0.06] bg-white p-10 text-center shadow-sm dark:border-white/[0.07] dark:bg-zinc-900">
                    <p className="font-mono text-xs uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                        404
                    </p>
                    <h1 className="mt-3 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                        No such project
                    </h1>
                    <a
                        href="/work"
                        className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-emerald-600 transition-colors hover:text-emerald-700 dark:text-emerald-400"
                    >
                        <ArrowLeft className="h-4 w-4" strokeWidth={2} />
                        Back to all work
                    </a>
                </div>
            </main>
            <PageFooter />
        </>
    );
}

export default function CaseStudyPage({ slug }: { slug: string }) {
    // Same ordering as the grid, so "next" on the page means "next" in the list.
    const ordered = useMemo(() => projects.slice().sort(byNewest), []);
    const index = ordered.findIndex((p) => p.id === slug);
    const project = index === -1 ? undefined : ordered[index];

    useEffect(() => {
        if (project) document.title = `${project.title} — ${personalInfo.name}`;
    }, [project]);

    if (!project) return <NotFound />;

    const previous = ordered[index - 1];
    const next = ordered[index + 1];
    const link = project.liveUrl ?? project.githubUrl;
    const paragraphs = paragraphsOf(project);

    return (
        <>
            <main className="pt-20 sm:pt-24">
                <motion.header
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease }}
                    className="mx-auto max-w-7xl px-4 sm:px-6"
                >
                    <a
                        href="/work"
                        className="inline-flex items-center gap-2 font-mono text-xs text-zinc-400 transition-colors hover:text-emerald-600 dark:text-zinc-500 dark:hover:text-emerald-400"
                    >
                        <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} />
                        all work
                    </a>
                    <h1 className="mt-5 text-3xl font-bold leading-tight text-zinc-900 sm:text-4xl dark:text-zinc-100">
                        {project.title}
                    </h1>
                    <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                        {project.description}
                    </p>
                </motion.header>

                {/* Cover bleeds past the layout, so it sits outside the wrapper.
                    Colour arrives on hover — but only where a pointer exists, or
                    phones would be stuck with a grey image forever. */}
                <motion.figure
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.1, ease }}
                    className="relative left-1/2 mt-8 w-screen -translate-x-1/2 overflow-hidden"
                >
                    <img
                        src={project.image}
                        alt={project.title}
                        decoding="async"
                        className="h-[42vh] min-h-[260px] w-full object-cover transition-[filter,transform] duration-700 ease-out md:grayscale md:hover:scale-[1.02] md:hover:grayscale-0"
                    />
                </motion.figure>

                <div className="mx-auto mt-4 flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
                    <span className="font-mono text-xs tabular-nums text-zinc-400 dark:text-zinc-500">
                        {longStamp(project.date)}
                    </span>
                    {link && (
                        <a
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-emerald-600 transition-colors hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
                        >
                            View project
                            <ArrowUpRight
                                className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                strokeWidth={2}
                            />
                        </a>
                    )}
                </div>

                <div className="mx-auto mt-16 grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-16">
                    <motion.article
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.05 }}
                        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
                        className="max-w-2xl"
                    >
                        {paragraphs.map((paragraph, i) => (
                            <motion.p
                                key={paragraph.slice(0, 40)}
                                variants={{
                                    hidden: { opacity: 0, y: 14 },
                                    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
                                }}
                                className={
                                    i === 0
                                        ? "text-lg font-medium leading-relaxed text-zinc-900 dark:text-zinc-100"
                                        : "mt-7 leading-relaxed text-zinc-600 dark:text-zinc-300"
                                }
                            >
                                {paragraph}
                            </motion.p>
                        ))}
                    </motion.article>

                    <motion.aside
                        initial={{ opacity: 0, y: 14 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.6, ease }}
                        className="space-y-3 text-sm leading-relaxed text-zinc-400 lg:sticky lg:top-24 lg:self-start dark:text-zinc-500"
                    >
                        <p>Contributed as {project.role ?? "Developer"}</p>
                        <p>{CATEGORY_LABELS[project.category]}</p>
                        <p>Made using {project.technologies.join(", ")}</p>
                    </motion.aside>
                </div>

                {/* Neighbours in the same order as the grid */}
                {(previous || next) && (
                    <nav className="mx-auto mt-24 grid max-w-7xl gap-4 px-4 sm:grid-cols-2 sm:px-6">
                        {previous ? (
                            <a
                                href={`/work/${previous.id}`}
                                className="group rounded-2xl border border-black/[0.06] bg-white p-5 transition-colors hover:border-emerald-500/40 dark:border-white/[0.07] dark:bg-zinc-900"
                            >
                                <span className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                                    <ArrowLeft className="h-3 w-3" strokeWidth={2} />
                                    Newer
                                </span>
                                <span className="mt-2 block text-sm font-semibold text-zinc-900 transition-colors group-hover:text-emerald-600 dark:text-zinc-100 dark:group-hover:text-emerald-400">
                                    {previous.title}
                                </span>
                            </a>
                        ) : (
                            <span />
                        )}
                        {next && (
                            <a
                                href={`/work/${next.id}`}
                                className="group rounded-2xl border border-black/[0.06] bg-white p-5 text-right transition-colors hover:border-emerald-500/40 dark:border-white/[0.07] dark:bg-zinc-900"
                            >
                                <span className="flex items-center justify-end gap-1.5 font-mono text-[11px] uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                                    Older
                                    <ArrowRight className="h-3 w-3" strokeWidth={2} />
                                </span>
                                <span className="mt-2 block text-sm font-semibold text-zinc-900 transition-colors group-hover:text-emerald-600 dark:text-zinc-100 dark:group-hover:text-emerald-400">
                                    {next.title}
                                </span>
                            </a>
                        )}
                    </nav>
                )}
            </main>

            <PageFooter />
        </>
    );
}

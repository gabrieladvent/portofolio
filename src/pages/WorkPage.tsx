import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { personalInfo, projects, type Project } from "../data/portfolio";
import FolderCard from "../components/work/FolderCard";
import ScrollDeck from "../components/work/ScrollDeck";
import PageFooter from "../components/PageFooter";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { byNewest, yearOf } from "../utils/projectDate";

const CATEGORY_LABELS: Record<Project["category"], string> = {
    web: "Web Development",
    backend: "Backend & Data",
    mobile: "Mobile",
    other: "Other",
};

function FilterGroup({
    title,
    options,
    active,
    onToggle,
}: {
    title: string;
    options: { value: string; label: string; count: number }[];
    active: string[];
    onToggle: (value: string) => void;
}) {
    return (
        <div>
            <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">{title}</h3>
            <ul className="mt-3 space-y-1">
                {options.map((option) => {
                    const on = active.includes(option.value);
                    return (
                        <li key={option.value}>
                            <button
                                type="button"
                                onClick={() => onToggle(option.value)}
                                aria-pressed={on}
                                className="group flex w-full items-center gap-2.5 py-1 text-left"
                            >
                                {/* Always rendered so switching state never shifts the label */}
                                <span
                                    aria-hidden="true"
                                    className={`h-1.5 w-1.5 shrink-0 rounded-full transition-colors ${on ? "bg-emerald-500" : "bg-transparent"
                                        }`}
                                />
                                <span
                                    className={`min-w-0 truncate text-sm transition-colors ${on
                                        ? "font-medium text-zinc-900 dark:text-zinc-100"
                                        : "text-zinc-400 group-hover:text-zinc-900 dark:text-zinc-500 dark:group-hover:text-zinc-200"
                                        }`}
                                >
                                    {option.label}
                                </span>
                                <span className="ml-auto font-mono text-[11px] tabular-nums text-zinc-300 dark:text-zinc-600">
                                    {option.count}
                                </span>
                            </button>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

/**
 * The work index as a filing cabinet: filters on the left, every project as a
 * folder on the right. Filters within a group are OR'd and the two groups are
 * AND'd — picking 2025 and Mobile means "mobile things from 2025", which is
 * what a reader expects when they narrow twice.
 */
export default function WorkPage() {
    const [years, setYears] = useState<string[]>([]);
    const [categories, setCategories] = useState<string[]>([]);

    useEffect(() => {
        document.title = `Work — ${personalInfo.name}`;
    }, []);

    // Options come from the data, so a filter can never advertise an empty set.
    const yearOptions = useMemo(() => {
        const counts = new Map<string, number>();
        for (const project of projects) {
            const year = yearOf(project.date);
            if (year) counts.set(year, (counts.get(year) ?? 0) + 1);
        }
        return [...counts.entries()]
            .sort((a, b) => b[0].localeCompare(a[0]))
            .map(([value, count]) => ({ value, label: value, count }));
    }, []);

    const categoryOptions = useMemo(
        () =>
            (["web", "backend", "mobile", "other"] as const)
                .map((value) => ({
                    value,
                    label: CATEGORY_LABELS[value],
                    count: projects.filter((p) => p.category === value).length,
                }))
                .filter((option) => option.count > 0),
        [],
    );

    const visible = useMemo(
        () =>
            projects
                .filter((p) => !years.length || years.includes(yearOf(p.date)))
                .filter((p) => !categories.length || categories.includes(p.category))
                .slice()
                .sort(byNewest),
        [years, categories],
    );

    const filtering = years.length > 0 || categories.length > 0;

    const toggle = (setter: typeof setYears) => (value: string) =>
        setter((current) =>
            current.includes(value) ? current.filter((v) => v !== value) : [...current, value],
        );

    const clear = () => {
        setYears([]);
        setCategories([]);
    };

    // The sideways shelf needs room for three rows and a pinned panel, so below
    // the desktop breakpoint the folders simply stack and scroll down the page.
    const wide = useMediaQuery("(min-width: 1024px)");
    const deck = wide && visible.length > 0;

    const header = (
        <div className="mb-5 flex items-baseline justify-between gap-4 px-1">
            <p className="font-mono text-xs tabular-nums text-zinc-400 dark:text-zinc-500">
                {visible.length} {visible.length === 1 ? "project" : "projects"}
            </p>
        </div>
    );

    // AnimatePresence has to be the cards' direct parent for exit to run, so it
    // travels with them into whichever container is in use.
    const cards = (
        <AnimatePresence mode="popLayout">
            {visible.map((project, index) => (
                <FolderCard key={project.id} project={project} index={index} compact={deck} />
            ))}
        </AnimatePresence>
    );

    return (
        <>
            {/* No top padding once the deck is in play: its pinned panel has to
                start at document top, and carries the nav clearance itself. */}
            <main className="px-4 pt-20 sm:px-6 sm:pt-24 lg:pt-0">
                <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-[248px_minmax(0,1fr)] lg:items-start">
                    {/* ── Filters ──────────────────────────────────────── */}
                    <motion.aside
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
                        className="min-w-0 rounded-3xl border border-black/[0.06] bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_18px_40px_-28px_rgba(0,0,0,0.35)] lg:sticky lg:top-24 lg:mt-24 dark:border-white/[0.07] dark:bg-zinc-900"
                    >
                        {/* Ghost lettering — filled, not just stroked, so it stays
                            visible if the browser drops -webkit-text-stroke. */}
                        <h1 className="text-2xl font-bold tracking-tight text-zinc-200 dark:text-zinc-700">
                            PROJECTS
                        </h1>

                        <div className="mt-6 flex items-center justify-between gap-3">
                            <h2 className="font-mono text-xs uppercase tracking-widest text-zinc-900 dark:text-zinc-100">
                                Filters
                            </h2>
                            {filtering && (
                                <button
                                    type="button"
                                    onClick={clear}
                                    className="font-mono text-[11px] text-emerald-600 transition-colors hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
                                >
                                    clear
                                </button>
                            )}
                        </div>

                        {/* Side by side on phones, where a stacked panel would
                            push the whole grid below the fold. */}
                        <div className="mt-5 grid grid-cols-2 gap-6 lg:grid-cols-1">
                            <FilterGroup
                                title="Year"
                                options={yearOptions}
                                active={years}
                                onToggle={toggle(setYears)}
                            />
                            <FilterGroup
                                title="Category"
                                options={categoryOptions}
                                active={categories}
                                onToggle={toggle(setCategories)}
                            />
                        </div>
                    </motion.aside>

                    {/* ── Shelf ────────────────────────────────────────── */}
                    {deck ? (
                        <ScrollDeck header={header} count={visible.length}>
                            {cards}
                        </ScrollDeck>
                    ) : (
                        <motion.section
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.05, ease: [0.21, 0.47, 0.32, 0.98] }}
                            className="min-w-0 rounded-3xl border border-black/[0.06] bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_18px_40px_-28px_rgba(0,0,0,0.35)] sm:p-6 lg:mt-24 dark:border-white/[0.07] dark:bg-zinc-900"
                        >
                            {header}

                            {visible.length === 0 ? (
                                <div className="rounded-2xl border border-dashed border-black/[0.12] px-6 py-16 text-center dark:border-white/10">
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                        Nothing filed under that combination.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={clear}
                                        className="mt-3 text-sm font-medium text-emerald-600 transition-colors hover:text-emerald-700 dark:text-emerald-400"
                                    >
                                        Show everything
                                    </button>
                                </div>
                            ) : (
                                <motion.div layout className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    {cards}
                                </motion.div>
                            )}
                        </motion.section>
                    )}
                </div>
            </main>

            <PageFooter />
        </>
    );
}

import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { projects } from "../data/portfolio";

type Project = {
    id: string;
    title: string;
    description: string;
    longDescription?: string;
    image: string;
    technologies: string[];
    githubUrl?: string;
    liveUrl?: string;
    featured?: boolean;
    category: string;
};

const ease = [0.21, 0.47, 0.32, 0.98] as const;

function ProjectModal({
    project,
    onClose,
}: {
    project: Project;
    onClose: () => void;
}) {
    return (
        <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ perspective: "1200px" }}
        >
            {/* Backdrop — blur the entire background */}
            <motion.div
                className="absolute inset-0 backdrop-blur-md bg-black/40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={onClose}
            />

            {/* Modal card — glass effect */}
            <motion.div
                data-lenis-prevent
                className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto overscroll-contain rounded-2xl border border-black/10 shadow-2xl scrollbar-hide bg-white"
                style={{
                    boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
                }}
                initial={{ opacity: 0, y: 32, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 24, scale: 0.97 }}
                transition={{ duration: 0.32, ease: [0.34, 1.56, 0.64, 1] }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header image */}
                <div className="relative aspect-video w-full overflow-hidden rounded-t-2xl">
                    <img
                        src={project.image}
                        alt={project.title}
                        decoding="async"
                        width={1280}
                        height={720}
                        className="w-full h-full object-cover"
                    />

                    <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

                    {/* Badge featured */}
                    {project.featured && (
                        <div className="absolute top-4 left-4">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 backdrop-blur-sm border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                Featured
                            </span>
                        </div>
                    )}

                    {/* Close button */}
                    <button
                        title="Close"
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 rounded-full bg-black/50 backdrop-blur-sm text-white border border-white/10 hover:bg-white/20 hover:scale-110 transition-all duration-200"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-5">
                    <div>
                        <h3 className="text-2xl font-bold text-zinc-900 mb-2 leading-tight">
                            {project.title}
                        </h3>
                        <div className="w-12 h-0.5 bg-emerald-500 rounded-full" />
                    </div>

                    <p className="text-zinc-600 text-sm leading-relaxed whitespace-pre-line">
                        {project.longDescription || project.description}
                    </p>

                    <div>
                        <p className="font-mono text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mb-3">
                            Tech Stack
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {project.technologies.map((tech) => (
                                <span
                                    key={tech}
                                    className="px-3 py-1 text-xs rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium"
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Action buttons — skipped entirely when a project has no links,
                        so the modal doesn't end on an empty padded row. */}
                    {(project.githubUrl || project.liveUrl) && (
                    <div className="flex gap-3 pt-1">
                        {project.githubUrl && (
                            <a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 py-2.5 rounded-xl bg-black/[0.03] border border-black/10 text-zinc-900 text-sm font-medium text-center hover:bg-black/[0.06] transition-all duration-200 flex items-center justify-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                                </svg>
                                View Code
                            </a>
                        )}
                        {project.liveUrl && (
                            <a
                                href={project.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 py-2.5 rounded-xl bg-emerald-500 text-white text-sm font-semibold text-center hover:bg-emerald-600 transition-all duration-200 flex items-center justify-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                                Live Demo
                            </a>
                        )}
                    </div>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
}

function ProjectCard({
    project,
    index,
    onSelect,
}: {
    project: Project;
    index: number;
    onSelect: () => void;
}) {
    // Per-card parallax — even/odd columns move differently → depth.
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
    // Keep the offset subtle — a large delta reads as a misaligned grid,
    // not as depth.
    const depth = index % 2 === 0 ? 36 : 14;
    const y = useTransform(scrollYProgress, [0, 1], [depth, -depth]);
    const reduceMotion = useReducedMotion();

    return (
        <motion.div
            ref={ref}
            layout
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.55, delay: (index % 3) * 0.08, ease }}
        >
            {/* Parallax lives on its own wrapper so it never fights the `layout` animation */}
            <motion.div style={{ y: reduceMotion ? undefined : y }}>
            <motion.div
                onClick={onSelect}
                whileHover={{ y: -6 }}
                className="group relative rounded-2xl overflow-hidden bg-white border border-black/[0.07] shadow-sm hover:border-emerald-500/40 hover:shadow-xl cursor-pointer"
            >
                {/* Image */}
                <div className="relative aspect-video overflow-hidden">
                    <img
                        src={project.image}
                        alt={project.title}
                        loading="lazy"
                        decoding="async"
                        width={640}
                        height={360}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Subtle hint text in the bottom corner */}
                    <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
                        <span className="text-xs text-white/70 italic">click for details →</span>
                    </div>
                </div>

                {/* Info card */}
                <div className="p-6">
                    {project.featured && (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 mb-3">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            Featured
                        </span>
                    )}
                    <h3 className="text-xl font-bold text-zinc-900 mb-2 group-hover:text-emerald-600 transition-colors duration-300">
                        {project.title}
                    </h3>
                    <p className="text-zinc-500 text-sm mb-4 line-clamp-2 leading-relaxed">
                        {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {project.technologies.slice(0, 4).map((tech) => (
                            <span
                                key={tech}
                                className="font-mono text-[11px] px-2 py-1 rounded-md bg-black/[0.03] text-zinc-600 border border-black/[0.08]"
                            >
                                {tech}
                            </span>
                        ))}
                        {project.technologies.length > 4 && (
                            <span className="font-mono text-[11px] px-2 py-1 rounded-md bg-black/[0.03] text-zinc-500">
                                +{project.technologies.length - 4}
                            </span>
                        )}
                    </div>
                </div>
            </motion.div>
            </motion.div>
        </motion.div>
    );
}

const CATEGORY_LABELS: Record<Project["category"], string> = {
    web: "Web",
    backend: "Backend",
    mobile: "Mobile",
    other: "Other",
};

export default function ProjectsSection() {
    const [filter, setFilter] = useState<string>("all");
    
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    // Derived from the data so a filter can never advertise an empty category
    // the way the hardcoded "Frontend" chip used to.
    const categories = [
        { key: "all", label: "All", count: projects.length },
        ...(["web", "backend", "mobile", "other"] as const)
            .map((key) => ({
                key,
                label: CATEGORY_LABELS[key],
                count: projects.filter((p) => p.category === key).length,
            }))
            .filter((c) => c.count > 0),
    ];

    const PAGE_SIZE = 6;
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

    // Featured first, so the section actually leads with what its title promises.
    const filteredProjects = (
        filter === "all" ? projects : projects.filter((p) => p.category === filter)
    )
        .slice()
        .sort((a, b) => Number(b.featured) - Number(a.featured));

    const visibleProjects = filteredProjects.slice(0, visibleCount);
    const hasMore = visibleCount < filteredProjects.length;

    const handleFilter = (key: string) => {
        setFilter(key);
        setVisibleCount(PAGE_SIZE); // reset paging when switching category
    };

    return (
        <>
            <section id="projects" className="py-20 md:py-24 px-6">
                <div className="max-w-7xl mx-auto lg:grid lg:grid-cols-12 lg:gap-12">
                    {/* Left column — sticky scroll-telling, tinyPod-style */}
                    <div className="lg:col-span-4">
                        <div className="lg:sticky lg:top-28 mb-12 lg:mb-0">
                            <motion.div
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, ease }}
                                className="flex items-center gap-4 font-mono text-xs tracking-widest uppercase"
                            >
                                <span className="text-emerald-600">03</span>
                                <span className="text-zinc-500">Projects</span>
                                <span className="h-px flex-1 bg-black/10 lg:hidden" />
                            </motion.div>
                            <motion.h2
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.7, delay: 0.1, ease }}
                                className="text-4xl sm:text-5xl font-bold text-zinc-900 mt-4 leading-tight"
                            >
                                Featured
                                <br />
                                Projects
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.7, delay: 0.2, ease }}
                                className="text-zinc-600 mt-5 max-w-sm leading-relaxed"
                            >
                                A collection of projects I’ve built, ranging from web and mobile applications to backend systems. 
                                Click any card to see the details.
                            </motion.p>

                            {/* Filter buttons */}
                            <div className="flex flex-wrap gap-3 mt-8">
                                {categories.map((cat) => (
                                    <button
                                        key={cat.key}
                                        onClick={() => handleFilter(cat.key)}
                                        className={`relative px-5 py-2 rounded-lg text-sm font-medium transition-colors duration-300 ${filter === cat.key
                                            ? "text-white"
                                            : "bg-black/[0.04] text-zinc-500 hover:bg-black/[0.08] hover:text-zinc-900"
                                            }`}
                                    >
                                        {filter === cat.key && (
                                            <motion.span
                                                layoutId="filter-pill"
                                                className="absolute inset-0 rounded-lg bg-emerald-500 shadow-lg shadow-emerald-500/20"
                                                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                            />
                                        )}
                                        <span className="relative z-10 flex items-center gap-1.5">
                                            {cat.label}
                                            <span
                                                className={`font-mono text-[11px] ${filter === cat.key ? "text-white/70" : "text-zinc-400"
                                                    }`}
                                            >
                                                {cat.count}
                                            </span>
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right column — card grid */}
                    <div className="lg:col-span-8">
                        {filteredProjects.length === 0 && (
                            <div className="rounded-2xl border border-dashed border-black/[0.12] bg-white/50 px-6 py-16 text-center">
                                <p className="text-zinc-500 text-sm">
                                    No projects in this category yet.
                                </p>
                                <button
                                    type="button"
                                    onClick={() => handleFilter("all")}
                                    className="mt-3 text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
                                >
                                    Show all projects
                                </button>
                            </div>
                        )}

                        <motion.div layout className="grid sm:grid-cols-2 gap-6">
                            <AnimatePresence mode="popLayout">
                                {visibleProjects.map((project, index) => (
                                    <ProjectCard
                                        key={project.id}
                                        project={project}
                                        index={index}
                                        onSelect={() => setSelectedProject(project)}
                                    />
                                ))}
                            </AnimatePresence>
                        </motion.div>

                        {/* Load more */}
                        {hasMore && (
                            <motion.div
                                layout
                                className="mt-12 flex flex-col items-center gap-4"
                            >
                                <span className="font-mono text-xs tracking-widest uppercase text-zinc-400">
                                    {visibleProjects.length} / {filteredProjects.length}
                                </span>
                                <motion.button
                                    onClick={() =>
                                        setVisibleCount((c) => c + PAGE_SIZE)
                                    }
                                    whileHover={{ y: -2 }}
                                    whileTap={{ scale: 0.97 }}
                                    className="group relative inline-flex items-center gap-2.5 px-7 py-3 rounded-full bg-zinc-900 text-white text-sm font-medium shadow-lg shadow-black/10 hover:bg-emerald-600 transition-colors duration-300"
                                >
                                    Show more
                                    <svg
                                        className="w-4 h-4 transition-transform duration-300 group-hover:translate-y-0.5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 9l-7 7-7-7"
                                        />
                                    </svg>
                                </motion.button>
                            </motion.div>
                        )}
                    </div>
                </div>
            </section>

            {/* Modal */}
            <AnimatePresence>
                {selectedProject && (
                    <ProjectModal
                        project={selectedProject}
                        onClose={() => setSelectedProject(null)}
                    />
                )}
            </AnimatePresence>
        </>
    );
}

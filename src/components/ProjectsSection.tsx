/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useInView } from "../utils/helpers";
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

function ProjectModal({
    project,
    onClose,
}: {
    project: Project;
    onClose: () => void;
}) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setVisible(true), 10);
        return () => clearTimeout(t);
    }, []);

    const handleClose = () => {
        setVisible(false);
        setTimeout(onClose, 300);
    };

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") handleClose();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = ""; };
    }, []);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ perspective: "1200px" }}
        >
            {/* Backdrop — blur keseluruhan background */}
            <div
                className="absolute inset-0 backdrop-blur-md transition-opacity duration-300"
                style={{ opacity: visible ? 1 : 0 }}
                onClick={handleClose}
            />

            {/* Modal card — glass effect */}
            <div
                className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/15 shadow-2xl scrollbar-hide"
                style={{
                    background: "rgba(13, 17, 23, 0.55)",
                    backdropFilter: "blur(24px) saturate(180%)",
                    WebkitBackdropFilter: "blur(24px) saturate(180%)",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)",
                    transition: "opacity 300ms ease, transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1)",
                    opacity: visible ? 1 : 0,
                    transform: visible ? "translateY(0) scale(1)" : "translateY(32px) scale(0.96)",
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Gambar header */}
                <div className="relative aspect-video w-full overflow-hidden rounded-t-2xl">
                    <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover"
                        style={{
                            transition: "transform 600ms ease",
                            transform: visible ? "scale(1)" : "scale(1.08)",
                        }}
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

                    {/* Tombol tutup */}
                    <button
                        title="Close"
                        onClick={handleClose}
                        className="absolute top-4 right-4 p-2 rounded-full bg-black/50 backdrop-blur-sm text-white border border-white/10 hover:bg-white/20 hover:scale-110 transition-all duration-200"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Konten */}
                <div className="p-6 space-y-5">
                    <div>
                        <h3 className="text-2xl font-bold text-white mb-2 leading-tight">
                            {project.title}
                        </h3>
                        <div className="w-12 h-0.5 bg-emerald-500 rounded-full" />
                    </div>

                    <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-line">
                        {project.longDescription || project.description}
                    </p>

                    <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                            Tech Stack
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {project.technologies.map((tech) => (
                                <span
                                    key={tech}
                                    className="px-3 py-1 text-xs rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium"
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Tombol aksi */}
                    <div className="flex gap-3 pt-1">
                        {project.githubUrl && (
                            <a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-medium text-center hover:bg-white/10 hover:border-white/20 transition-all duration-200 flex items-center justify-center gap-2"
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
                                className="flex-1 py-2.5 rounded-xl bg-emerald-500 text-black text-sm font-semibold text-center hover:bg-emerald-400 transition-all duration-200 flex items-center justify-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                                Live Demo
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ProjectsSection() {
    const { ref, isInView } = useInView();
    const [filter, setFilter] = useState<string>("all");
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    const categories = [
        { key: "all", label: "All" },
        { key: "web", label: "Web" },
        { key: "mobile", label: "Mobile" },
        { key: "backend", label: "Backend" },
    ];

    const filteredProjects =
        filter === "all" ? projects : projects.filter((p) => p.category === filter);

    return (
        <>
            <section id="projects" className="py-6 px-6" ref={ref}>
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-10">
                        <span
                            className={`text-emerald-400 font-semibold text-sm uppercase tracking-wider transition-all duration-700 ${isInView ? "opacity-100" : "opacity-0"}`}
                        >
                            Portfolio
                        </span>
                        <h2
                            className={`text-4xl sm:text-5xl font-bold text-white mt-4 transition-all duration-700 delay-100 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
                        >
                            Featured Projects
                        </h2>
                    </div>

                    {/* Filter buttons */}
                    <div
                        className={`flex flex-wrap justify-center gap-3 mb-12 transition-all duration-700 delay-200 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
                    >
                        {categories.map((cat) => (
                            <button
                                key={cat.key}
                                onClick={() => setFilter(cat.key)}
                                className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${filter === cat.key
                                    ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/20"
                                    : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                                    }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>

                    {/* Project grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredProjects.map((project, index) => (
                            <div
                                key={project.id}
                                onClick={() => setSelectedProject(project)}
                                className={`group relative rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:border-emerald-500/40 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-500 cursor-pointer hover:-translate-y-1 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"}`}
                                style={{ transitionDelay: `${index * 150}ms` }}
                            >
                                {/* Gambar */}
                                <div className="relative aspect-video overflow-hidden">
                                    <img
                                        src={project.image}
                                        alt={project.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                    {/* Hint text subtle di pojok bawah */}
                                    <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
                                        <span className="text-xs text-white/60 italic">
                                            klik untuk detail →
                                        </span>
                                    </div>
                                </div>

                                {/* Info card */}
                                <div className="p-6">
                                    {project.featured && (
                                        <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-400 mb-3">
                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                            Featured
                                        </span>
                                    )}
                                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors duration-300">
                                        {project.title}
                                    </h3>
                                    <p className="text-gray-400 text-sm mb-4 line-clamp-2 leading-relaxed">
                                        {project.description}
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {project.technologies.slice(0, 4).map((tech) => (
                                            <span
                                                key={tech}
                                                className="px-2 py-1 text-xs rounded-md bg-white/5 text-gray-400 border border-white/10"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                        {project.technologies.length > 4 && (
                                            <span className="px-2 py-1 text-xs rounded-md bg-white/5 text-gray-500">
                                                +{project.technologies.length - 4}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Modal */}
            {selectedProject && (
                <ProjectModal
                    project={selectedProject}
                    onClose={() => setSelectedProject(null)}
                />
            )}
        </>
    );
}
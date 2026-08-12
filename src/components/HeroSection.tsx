import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { personalInfo, socialLinks, skills, projects } from "../data/portfolio";
import { SocialIcon } from "../utils/helpers";

const ease = [0.21, 0.47, 0.32, 0.98] as const;

const [firstName, ...rest] = personalInfo.name.split(" ");
const lastName = rest.join(" ");
const featuredCount = projects.filter((p) => p.featured).length;

const meta = [
    { k: "Location", v: personalInfo.location },
    { k: "Experience", v: "3+ Years" },
    { k: "Focus", v: "Backend · UI" },
];

export default function HeroSection() {
    const ref = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"],
    });
    // Many parallax layers — large, divergent magnitudes so it really SHOWS.
    const nameY = useTransform(scrollYProgress, [0, 1], [0, -160]);
    const subY = useTransform(scrollYProgress, [0, 1], [0, -300]);
    const ctaY = useTransform(scrollYProgress, [0, 1], [0, -430]);
    const metaY = useTransform(scrollYProgress, [0, 1], [0, -560]);
    const ghostY = useTransform(scrollYProgress, [0, 1], [0, 420]);
    const ghostX = useTransform(scrollYProgress, [0, 1], ["0%", "-22%"]);
    const fade = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

    // Scroll-linked motion is the most nausea-inducing part of the page, so it
    // is dropped entirely for visitors who ask for reduced motion.
    const reduceMotion = useReducedMotion();
    const p = <T,>(value: T) => (reduceMotion ? undefined : value);

    const container = {
        hidden: {},
        show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
    };
    const line = {
        hidden: { opacity: 0, y: 28 },
        show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
    };

    return (
        <section
            id="hero"
            ref={ref}
            className="relative min-h-screen flex items-center px-6 pt-28 pb-16 overflow-hidden"
        >
            {/* Giant faint monogram in the background — slow parallax */}
            <motion.div
                style={{ y: p(ghostY), x: p(ghostX), opacity: p(fade) }}
                aria-hidden
                className="pointer-events-none absolute -right-10 top-1/4 select-none font-bold tracking-tighter leading-none text-[clamp(12rem,40vw,30rem)] text-black/[0.035]"
            >
                {firstName.charAt(0)}
            </motion.div>

            <div className="max-w-6xl mx-auto w-full grid lg:grid-cols-12 gap-10 items-end relative">
                {/* Main column */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="lg:col-span-8"
                >
                    <motion.div
                        variants={line}
                        className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-zinc-500 mb-8"
                    >
                        <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75 animate-ping" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                        </span>
                        Available for part-time or project work
                    </motion.div>

                    <motion.h1 style={{ y: p(nameY) }} className="font-bold tracking-tight leading-[0.86] text-zinc-900">
                        <motion.span variants={line} className="block text-[clamp(3rem,12vw,8.5rem)]">
                            {firstName}
                        </motion.span>
                        <motion.span
                            variants={line}
                            className="block text-[clamp(3rem,12vw,8.5rem)] text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500"
                        >
                            {lastName}
                        </motion.span>
                    </motion.h1>

                    <motion.div style={{ y: p(subY) }}>
                        <motion.p variants={line} className="mt-7 text-xl sm:text-2xl text-zinc-700 font-medium">
                            {personalInfo.title}
                        </motion.p>
                        <motion.p variants={line} className="mt-4 max-w-xl text-zinc-500 leading-relaxed">
                            {personalInfo.tagline}
                        </motion.p>
                    </motion.div>

                    <motion.div style={{ y: p(ctaY) }}>
                        <motion.div variants={line} className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
                            <a
                                href="#projects"
                                className="group inline-flex items-center gap-2 text-zinc-900 font-medium border-b-2 border-emerald-500 pb-1 hover:gap-3 transition-all"
                            >
                                <span className="text-emerald-600 font-mono text-sm">→</span>
                                View my work
                            </a>
                            <a
                                href="#contact"
                                className="group inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-900 font-medium border-b-2 border-transparent hover:border-black/20 pb-1 transition-all"
                            >
                                <span className="font-mono text-sm">→</span>
                                Get in touch
                            </a>
                            <div className="flex items-center gap-3 sm:ml-auto">
                                {socialLinks.map((l) => (
                                    <a
                                        key={l.name}
                                        href={l.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-10 h-10 rounded-lg border border-black/10 bg-white flex items-center justify-center text-zinc-500 hover:text-zinc-900 hover:border-emerald-500/50 transition-colors"
                                        aria-label={l.name}
                                    >
                                        <SocialIcon name={l.icon} />
                                    </a>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                </motion.div>

                {/* Meta column — fastest parallax */}
                <motion.div
                    style={{ y: p(metaY) }}
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="lg:col-span-4 lg:border-l border-black/10 lg:pl-8"
                >
                    <motion.div variants={line} className="grid grid-cols-3 lg:grid-cols-1 gap-px bg-black/[0.06] lg:bg-transparent rounded-xl lg:rounded-none overflow-hidden lg:gap-0">
                        {meta.map((m, i) => (
                            <div
                                key={m.k}
                                className={`bg-white lg:bg-transparent p-4 lg:px-0 lg:py-4 ${i !== 0 ? "lg:border-t border-black/10" : ""}`}
                            >
                                <div className="font-mono text-[10px] uppercase tracking-widest text-zinc-400 mb-1">
                                    {m.k}
                                </div>
                                <div className="text-zinc-900 text-sm font-medium">{m.v}</div>
                            </div>
                        ))}
                    </motion.div>

                    <motion.div variants={line} className="hidden lg:flex items-baseline gap-6 mt-6 pt-6 border-t border-black/10">
                        <div>
                            <div className="text-3xl font-bold text-zinc-900 tabular-nums">{featuredCount}+</div>
                            <div className="font-mono text-[10px] uppercase tracking-widest text-zinc-400 mt-1">Featured</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-zinc-900 tabular-nums">{skills.length}</div>
                            <div className="font-mono text-[10px] uppercase tracking-widest text-zinc-400 mt-1">Skills</div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>

            <motion.div
                style={{ opacity: p(fade) }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-widest text-zinc-400 flex flex-col items-center gap-2"
            >
                <span>Scroll</span>
                <motion.span animate={{ y: [0, 6, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}>
                    ↓
                </motion.span>
            </motion.div>
        </section>
    );
}

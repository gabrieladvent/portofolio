import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { experiences, personalInfo } from "../data/portfolio";
import { useGitHubProfile } from "../hooks/useApi";
import SectionHeader from "./ui/SectionHeader";

const ease = [0.21, 0.47, 0.32, 0.98] as const;

const tileBase =
    "rounded-2xl border border-black/[0.07] bg-white p-5 shadow-sm hover:border-black/15 transition-colors";

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.55, ease } },
};

export default function AboutSection() {
    const { profile } = useGitHubProfile();
    const current = experiences[0];

    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    });
    // Parallax gambar avatar di dalam frame + tile naik — magnitudo besar.
    const avatarImgY = useTransform(scrollYProgress, [0, 1], ["-16%", "16%"]);
    const bentoY = useTransform(scrollYProgress, [0, 1], [90, -90]);

    return (
        <section id="about" className="py-28 px-6">
            <div className="max-w-6xl mx-auto">
                <SectionHeader
                    index="01"
                    eyebrow="About"
                    title="A bit about me"
                    description={personalInfo.bio}
                />

                {/* Bento grid */}
                <motion.div
                    ref={ref}
                    style={{ y: bentoY }}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.15 }}
                    variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
                    className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-3 auto-rows-fr"
                >
                    {/* Avatar — tile tinggi, gambar parallax */}
                    <motion.div
                        variants={item}
                        className="col-span-2 md:col-span-1 md:row-span-2 rounded-2xl border border-black/[0.07] overflow-hidden relative min-h-[220px] shadow-sm"
                    >
                        <motion.img
                            style={{ y: avatarImgY, scale: 1.4 }}
                            src={profile?.avatar_url ?? personalInfo.avatar}
                            alt={personalInfo.name}
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <div className="absolute bottom-4 left-4">
                            <div className="text-white font-semibold">{personalInfo.name}</div>
                            <div className="font-mono text-[11px] text-emerald-300">@gabrieladvent</div>
                        </div>
                    </motion.div>

                    {/* Now — role sekarang */}
                    <motion.div variants={item} className={`col-span-2 md:col-span-3 ${tileBase}`}>
                        <div className="font-mono text-[10px] uppercase tracking-widest text-zinc-400 mb-2">
                            Currently
                        </div>
                        <div className="text-zinc-900 text-lg font-semibold">{current.position}</div>
                        <div className="text-zinc-500 text-sm">{current.company}</div>
                        <div className="flex flex-wrap gap-2 mt-3">
                            {current.technologies.slice(0, 6).map((t) => (
                                <span
                                    key={t}
                                    className="font-mono text-[11px] px-2 py-0.5 rounded-md bg-black/[0.04] border border-black/[0.08] text-zinc-600"
                                >
                                    {t}
                                </span>
                            ))}
                        </div>
                    </motion.div>

                    {/* Stat tiles */}
                    <motion.div variants={item} className={`${tileBase} flex flex-col justify-center`}>
                        <div className="text-3xl font-bold text-emerald-600 tabular-nums">2+</div>
                        <div className="font-mono text-[10px] uppercase tracking-widest text-zinc-400 mt-1">Years exp</div>
                    </motion.div>
                    <motion.div variants={item} className={`${tileBase} flex flex-col justify-center`}>
                        <div className="text-3xl font-bold text-zinc-900 tabular-nums">20+</div>
                        <div className="font-mono text-[10px] uppercase tracking-widest text-zinc-400 mt-1">Projects</div>
                    </motion.div>
                    <motion.div variants={item} className={`${tileBase} flex flex-col justify-center`}>
                        <div className="text-3xl font-bold text-zinc-900 tabular-nums">5+</div>
                        <div className="font-mono text-[10px] uppercase tracking-widest text-zinc-400 mt-1">Clients</div>
                    </motion.div>

                    {/* Location */}
                    <motion.div variants={item} className={`col-span-2 md:col-span-2 ${tileBase} flex items-center gap-3`}>
                        <svg className="w-5 h-5 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <div>
                            <div className="font-mono text-[10px] uppercase tracking-widest text-zinc-400">Based in</div>
                            <div className="text-zinc-900 text-sm font-medium">{personalInfo.location}</div>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Experience timeline */}
                <div className="mt-28">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.6 }}
                        transition={{ duration: 0.6, ease }}
                        className="flex items-center gap-4 font-mono text-xs tracking-widest uppercase mb-12"
                    >
                        <span className="text-zinc-500">Experience</span>
                        <span className="h-px flex-1 bg-black/10" />
                    </motion.div>

                    <div className="space-y-px">
                        {experiences.map((exp, index) => (
                            <motion.div
                                key={exp.id}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ duration: 0.6, delay: index * 0.06, ease }}
                                className="group grid md:grid-cols-12 gap-3 md:gap-8 py-8 border-t border-black/[0.08]"
                            >
                                <div className="md:col-span-3 font-mono text-xs text-zinc-500 tabular-nums">
                                    {exp.startDate} — {exp.endDate}
                                </div>
                                <div className="md:col-span-9">
                                    <h4 className="text-xl font-bold text-zinc-900 group-hover:text-emerald-600 transition-colors">
                                        {exp.position}
                                    </h4>
                                    <p className="text-zinc-500 text-sm mt-0.5">{exp.company}</p>
                                    <p className="text-zinc-600 text-sm mt-3 leading-relaxed max-w-2xl">
                                        {exp.description}
                                    </p>
                                    <div className="flex flex-wrap gap-2 mt-4">
                                        {exp.technologies.map((tech) => (
                                            <span
                                                key={tech}
                                                className="font-mono text-[11px] px-2 py-0.5 rounded-md bg-black/[0.03] border border-black/[0.08] text-zinc-600"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

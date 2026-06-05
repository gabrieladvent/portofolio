import { motion } from "motion/react";
import { skills } from "../data/portfolio";
import SectionHeader from "./ui/SectionHeader";

const ease = [0.21, 0.47, 0.32, 0.98] as const;

const groups: { key: string; label: string }[] = [
    { key: "frontend", label: "Frontend" },
    { key: "backend", label: "Backend" },
    { key: "mobile", label: "Mobile" },
    { key: "tools", label: "Tools & DevOps" },
];

const skillIconUrl = (iconId: string) =>
    `https://skillicons.dev/icons?i=${iconId}&theme=dark`;

export default function SkillsSection() {
    return (
        <section id="skills" className="py-28 px-6">
            <div className="max-w-5xl mx-auto">
                <SectionHeader
                    index="02"
                    eyebrow="Skills"
                    title={
                        <>
                            Technologies I{" "}
                            <span className="text-emerald-400">work with</span>
                        </>
                    }
                    description="My daily tech stack for building web, mobile, and backend applications."
                />

                <div className="mt-16 space-y-12">
                    {groups.map((group, gi) => {
                        const items = skills.filter((s) => s.category === group.key);
                        if (!items.length) return null;
                        return (
                            <motion.div
                                key={group.key}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.2 }}
                                transition={{ duration: 0.6, delay: gi * 0.05, ease }}
                                className="grid md:grid-cols-12 gap-4 md:gap-8 items-start"
                            >
                                {/* Label kategori */}
                                <div className="md:col-span-3">
                                    <h3 className="text-sm font-semibold text-zinc-900 uppercase tracking-wider">
                                        {group.label}
                                    </h3>
                                    <span className="font-mono text-xs text-zinc-400">{items.length} tools</span>
                                </div>

                                {/* Chips */}
                                <motion.div
                                    initial="hidden"
                                    whileInView="show"
                                    viewport={{ once: true, amount: 0.2 }}
                                    variants={{
                                        hidden: {},
                                        show: { transition: { staggerChildren: 0.04 } },
                                    }}
                                    className="md:col-span-9 flex flex-wrap gap-2.5"
                                >
                                    {items.map((skill) => (
                                        <motion.div
                                            key={skill.name}
                                            variants={{
                                                hidden: { opacity: 0, y: 12, scale: 0.96 },
                                                show: {
                                                    opacity: 1,
                                                    y: 0,
                                                    scale: 1,
                                                    transition: { duration: 0.4, ease },
                                                },
                                            }}
                                            whileHover={{ y: -3 }}
                                            className="group flex items-center gap-2.5 pl-2 pr-3.5 py-2 rounded-xl bg-white border border-black/[0.07] shadow-sm hover:border-emerald-500/50 hover:shadow-md transition-all duration-300 cursor-default"
                                        >
                                            <img
                                                src={skillIconUrl(skill.icon)}
                                                alt={skill.name}
                                                loading="lazy"
                                                className="w-6 h-6 rounded-md"
                                            />
                                            <span className="text-sm text-zinc-700 group-hover:text-zinc-900 transition-colors">
                                                {skill.name}
                                            </span>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* footer note */}
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="text-center text-zinc-400 text-sm mt-16 font-mono"
                >
                    Always learning and exploring new technologies.
                </motion.p>
            </div>
        </section>
    );
}

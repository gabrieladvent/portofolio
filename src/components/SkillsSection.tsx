import { skills } from "../data/portfolio";
import { useInView } from "../utils/helpers";

export default function SkillsSection() {
    const { ref, isInView } = useInView();

    const skillCategories = [
        { key: 'frontend', label: 'Frontend', color: 'emerald' },
        { key: 'backend', label: 'Backend', color: 'cyan' },
        { key: 'tools', label: 'Tools', color: 'violet' },
    ] as const;

    return (
        <section id="skills" className="py-32 px-6" ref={ref}>
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <span className={`text-emerald-400 font-semibold text-sm uppercase tracking-wider transition-all duration-700 ${isInView ? 'opacity-100' : 'opacity-0'}`}>
                        Skills & Expertise
                    </span>
                    <h2 className={`text-4xl sm:text-5xl font-bold text-white mt-4 transition-all duration-700 delay-100 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        Technologies I Work With
                    </h2>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {skillCategories.map((category, catIndex) => (
                        <div
                            key={category.key}
                            className={`p-6 rounded-2xl bg-white/5 border border-white/10 transition-all duration-700 hover:border-${category.color}-500/30`}
                            style={{ transitionDelay: `${catIndex * 200}ms` }}
                        >
                            <h3 className={`text-xl font-bold text-white mb-6 flex items-center gap-3 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                                <span className={`w-3 h-3 rounded-full bg-${category.color}-400`} />
                                {category.label}
                            </h3>

                            <div className="space-y-4">
                                {skills
                                    .filter((s) => s.category === category.key)
                                    .map((skill, index) => (
                                        <div
                                            key={skill.name}
                                            className={`transition-all duration-500 ${isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
                                            style={{ transitionDelay: `${catIndex * 200 + index * 100}ms` }}
                                        >
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-gray-300 font-medium">{skill.name}</span>
                                                <span className="text-gray-500 text-sm">{skill.level}%</span>
                                            </div>
                                            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full bg-gradient-to-r ${category.color === 'emerald' ? 'from-emerald-500 to-emerald-400' :
                                                        category.color === 'cyan' ? 'from-cyan-500 to-cyan-400' :
                                                            'from-violet-500 to-violet-400'
                                                        } transition-all duration-1000 ease-out`}
                                                    style={{
                                                        width: isInView ? `${skill.level}%` : '0%',
                                                        transitionDelay: `${catIndex * 200 + index * 100 + 300}ms`
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
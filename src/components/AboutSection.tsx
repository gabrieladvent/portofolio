import { experiences, personalInfo } from "../data/portfolio";
import { useInView } from "../utils/helpers";

export default function AboutSection() {
    const { ref, isInView } = useInView();

    return (
        <section id="about" className="py-32 px-6" ref={ref}>
            <div className="max-w-6xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div className={`relative transition-all duration-1000 ${isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'}`}>
                        <div className="relative">
                            <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-3xl blur-2xl" />
                            <img
                                src={personalInfo.avatar}
                                alt={personalInfo.name}
                                className="relative w-full max-w-md mx-auto rounded-2xl shadow-2xl"
                            />
                        </div>
                        <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-2xl -z-10" />
                        <div className="absolute -top-6 -left-6 w-24 h-24 border-2 border-emerald-500/30 rounded-2xl -z-10" />
                    </div>

                    <div className={`transition-all duration-1000 delay-300 ${isInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'}`}>
                        <span className="text-emerald-400 font-semibold text-sm uppercase tracking-wider">About Me</span>
                        <h2 className="text-4xl sm:text-5xl font-bold text-white mt-4 mb-6">
                            Crafting Digital Experiences
                        </h2>
                        <p className="text-gray-400 text-lg leading-relaxed mb-8">
                            {personalInfo.bio}
                        </p>

                        <div className="grid grid-cols-2 gap-6 mb-8">
                            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                <div className="text-3xl font-bold text-emerald-400 mb-1">5+</div>
                                <div className="text-gray-400 text-sm">Years Experience</div>
                            </div>
                            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                <div className="text-3xl font-bold text-cyan-400 mb-1">50+</div>
                                <div className="text-gray-400 text-sm">Projects Completed</div>
                            </div>
                            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                <div className="text-3xl font-bold text-violet-400 mb-1">30+</div>
                                <div className="text-gray-400 text-sm">Happy Clients</div>
                            </div>
                            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                <div className="text-3xl font-bold text-pink-400 mb-1">∞</div>
                                <div className="text-gray-400 text-sm">Cups of Coffee</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 text-gray-400">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>{personalInfo.location}</span>
                        </div>
                    </div>
                </div>

                {/* Experience Timeline */}
                <div className={`mt-32 transition-all duration-1000 delay-500 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
                    <h3 className="text-2xl font-bold text-white text-center mb-12">Work Experience</h3>
                    <div className="relative">
                        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-emerald-500 via-cyan-500 to-violet-500 hidden md:block" />
                        <div className="space-y-12">
                            {experiences.map((exp, index) => (
                                <div key={exp.id} className={`relative md:w-1/2 ${index % 2 === 0 ? 'md:pr-12 md:ml-auto md:text-right' : 'md:pl-12'}`}>
                                    <div className="absolute left-1/2 top-0 w-4 h-4 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 -translate-x-1/2 hidden md:block" />
                                    <div className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-500/30 transition-colors">
                                        <span className="text-emerald-400 text-sm font-medium">
                                            {exp.startDate} - {exp.endDate}
                                        </span>
                                        <h4 className="text-xl font-bold text-white mt-2">{exp.position}</h4>
                                        <p className="text-gray-400 mb-3">{exp.company}</p>
                                        <p className="text-gray-500 text-sm mb-4">{exp.description}</p>
                                        <div className={`flex flex-wrap gap-2 ${index % 2 === 0 ? 'md:justify-end' : ''}`}>
                                            {exp.technologies.map((tech) => (
                                                <span key={tech} className="px-2 py-1 text-xs rounded-md bg-emerald-500/10 text-emerald-400">
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
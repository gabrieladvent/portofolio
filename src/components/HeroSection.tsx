import { useEffect, useState } from "react";
import { personalInfo, socialLinks } from "../data/portfolio";
import { SocialIcon } from "../utils/helpers";

export default function HeroSection() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <section id="hero" className="min-h-screen flex items-center justify-center px-6 pt-20 relative">
            {/* Glass background effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 via-transparent to-transparent pointer-events-none" />
            
            <div className="max-w-5xl mx-auto text-center relative z-10">
                <div className={`transition-all duration-1000 ease-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/[0.08] backdrop-blur-2xl backdrop-saturate-150 border border-white/20 text-emerald-400 text-sm mb-8 shadow-xl shadow-emerald-500/10 hover:bg-white/[0.12] hover:border-emerald-400/40 transition-all duration-500">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-lg shadow-emerald-400/50" />
                        Available for work
                    </div>
                </div>

                <h1 className={`text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight mb-6 transition-all duration-1000 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                    }`}>
                    <span className="text-white">Hi, I'm </span>
                    <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-violet-400 bg-clip-text text-transparent">
                        {personalInfo.name}
                    </span>
                </h1>

                <p className={`text-xl sm:text-2xl text-gray-400 mb-4 transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                    }`}>
                    {personalInfo.title}
                </p>

                <div className={`flex flex-wrap items-center justify-center gap-4 mb-16 transition-all duration-1000 ease-out delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                    }`}>
                    <a
                        href="#projects"
                        className="group px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-semibold hover:shadow-2xl hover:shadow-emerald-500/30 transition-all duration-500 ease-out hover:-translate-y-1 hover:scale-105"
                    >
                        View My Work
                        <span className="inline-block ml-2 transition-transform duration-500 ease-out group-hover:translate-x-2">→</span>
                    </a>
                    <a
                        href="#contact"
                        className="px-8 py-4 rounded-2xl bg-white/[0.08] backdrop-blur-2xl backdrop-saturate-150 border border-white/20 text-white font-semibold hover:bg-white/[0.15] hover:border-white/30 transition-all duration-500 ease-out shadow-xl shadow-black/10 hover:-translate-y-1 hover:scale-105"
                    >
                        Get In Touch
                    </a>
                </div>

                <div className={`flex items-center justify-center gap-6 transition-all duration-1000 ease-out delay-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                    }`}>
                    {socialLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-12 h-12 rounded-2xl bg-white/[0.08] backdrop-blur-2xl backdrop-saturate-150 border border-white/20 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/[0.15] hover:border-white/30 hover:-translate-y-2 hover:scale-110 transition-all duration-500 ease-out shadow-xl shadow-black/10"
                            aria-label={link.name}
                        >
                            <SocialIcon name={link.icon} />
                        </a>
                    ))}
                </div>

                <div className={`mt-20 animate-bounce transition-all duration-1000 delay-1000 ${mounted ? 'opacity-100' : 'opacity-0'
                    }`}>
                    <a href="#about" className="text-gray-500 hover:text-white transition-colors">
                        <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                    </a>
                </div>
            </div>
        </section>
    );
}
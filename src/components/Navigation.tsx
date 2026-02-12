import { useEffect, useState } from "react";
import { personalInfo } from "../data/portfolio";

export default function Navigation() {
    const [scrolled, setScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState('hero');

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);

            const sections = ['hero', 'about', 'skills', 'projects', 'github', 'stats', 'contact'];
            for (const section of sections.reverse()) {
                const element = document.getElementById(section);
                if (element && window.scrollY >= element.offsetTop - 200) {
                    setActiveSection(section);
                    break;
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navItems = [
        { id: 'about', label: 'About' },
        { id: 'skills', label: 'Skills' },
        { id: 'projects', label: 'Projects' },
        { id: 'github', label: 'GitHub' },
        { id: 'stats', label: 'Activity' },
        { id: 'contact', label: 'Contact' },
    ];

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-out ${scrolled 
            ? 'bg-white/[0.08] backdrop-blur-2xl backdrop-saturate-200 border-b border-white/20 shadow-2xl shadow-black/10' 
            : 'bg-transparent'
            }`}>
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    <a href="#hero" className="group flex items-center gap-2">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center font-bold text-black text-lg transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 ease-out shadow-lg shadow-emerald-500/30">
                            {personalInfo.name.charAt(0)}
                        </div>
                        <span className="text-white font-semibold tracking-tight hidden sm:block group-hover:text-emerald-400 transition-colors duration-300">
                            {personalInfo.name.split(' ')[0]}
                        </span>
                    </a>

                    <div className="hidden md:flex items-center gap-1 bg-white/[0.08] backdrop-blur-2xl backdrop-saturate-150 rounded-2xl p-1.5 border border-white/20 shadow-xl shadow-black/10">
                        {navItems.map((item) => (
                            <a
                                key={item.id}
                                href={`#${item.id}`}
                                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-500 ease-out ${activeSection === item.id
                                    ? 'text-white bg-white/20 backdrop-blur-xl shadow-lg shadow-emerald-500/20 scale-105'
                                    : 'text-gray-400 hover:text-white hover:bg-white/10 hover:scale-105'
                                    }`}
                            >
                                {item.label}
                            </a>
                        ))}
                    </div>

                    <a
                        href={personalInfo.resumeUrl}
                        className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-semibold text-sm hover:shadow-xl hover:shadow-emerald-500/30 transition-all duration-500 ease-out hover:-translate-y-1 hover:scale-105"
                    >
                        Resume
                    </a>
                </div>
            </div>
        </nav>
    );
}
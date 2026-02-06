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
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-black/80 backdrop-blur-xl border-b border-white/5' : ''
            }`}>
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    <a href="#hero" className="group flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center font-bold text-black text-lg transform group-hover:rotate-12 transition-transform duration-300">
                            {personalInfo.name.charAt(0)}
                        </div>
                        <span className="text-white font-semibold tracking-tight hidden sm:block">
                            {personalInfo.name.split(' ')[0]}
                        </span>
                    </a>

                    <div className="hidden md:flex items-center gap-1">
                        {navItems.map((item) => (
                            <a
                                key={item.id}
                                href={`#${item.id}`}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${activeSection === item.id
                                    ? 'text-emerald-400 bg-emerald-400/10'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {item.label}
                            </a>
                        ))}
                    </div>

                    <a
                        href={personalInfo.resumeUrl}
                        className="px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-semibold text-sm hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 hover:-translate-y-0.5"
                    >
                        Resume
                    </a>
                </div>
            </div>
        </nav>
    );
}
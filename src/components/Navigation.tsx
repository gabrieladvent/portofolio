import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useLenis } from "lenis/react";
import { personalInfo } from "../data/portfolio";

const navItems = [
    { id: "about", label: "About" },
    { id: "skills", label: "Skills" },
    { id: "projects", label: "Projects" },
    { id: "github", label: "GitHub" },
    { id: "stats", label: "Activity" },
    { id: "contact", label: "Contact" },
];

export default function Navigation() {
    const [scrolled, setScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState("hero");
    const lenis = useLenis();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
            const sections = ["hero", "about", "skills", "projects", "github", "stats", "contact"];
            for (const section of [...sections].reverse()) {
                const element = document.getElementById(section);
                if (element && window.scrollY >= element.offsetTop - 200) {
                    setActiveSection(section);
                    break;
                }
            }
        };
        window.addEventListener("scroll", handleScroll);
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollTo = (e: React.MouseEvent, id: string) => {
        e.preventDefault();
        const target = document.getElementById(id);
        if (!target) return;
        if (lenis) lenis.scrollTo(target, { offset: -80 });
        else target.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <motion.nav
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
            className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-500 ${scrolled
                ? "bg-[#f6f6f4]/80 backdrop-blur-xl border-b border-black/[0.07]"
                : "bg-transparent border-b border-transparent"
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <a
                        href="#hero"
                        onClick={(e) => scrollTo(e, "hero")}
                        className="group flex items-center gap-2.5"
                    >
                        <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center font-bold text-white text-base transition-transform duration-300 group-hover:rotate-12">
                            {personalInfo.name.charAt(0)}
                        </div>
                        <span className="text-zinc-900 font-semibold tracking-tight hidden sm:block">
                            {personalInfo.name.split(" ")[0]}
                        </span>
                    </a>

                    {/* Center nav pill */}
                    <div className="hidden md:flex items-center gap-1 bg-black/[0.04] rounded-full p-1 border border-black/[0.06]">
                        {navItems.map((item) => {
                            const active = activeSection === item.id;
                            return (
                                <a
                                    key={item.id}
                                    href={`#${item.id}`}
                                    onClick={(e) => scrollTo(e, item.id)}
                                    className={`relative px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${active ? "text-white" : "text-zinc-500 hover:text-zinc-900"
                                        }`}
                                >
                                    {active && (
                                        <motion.span
                                            layoutId="nav-active"
                                            className="absolute inset-0 rounded-full bg-emerald-500"
                                            transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                        />
                                    )}
                                    <span className="relative z-10">{item.label}</span>
                                </a>
                            );
                        })}
                    </div>

                    {/* Resume */}
                    <motion.a
                        href={personalInfo.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.97 }}
                        className="px-5 py-2.5 rounded-full border border-black/15 text-zinc-900 font-medium text-sm hover:bg-black/[0.04] hover:border-black/30 transition-colors duration-300"
                    >
                        Resume
                    </motion.a>
                </div>
            </div>
        </motion.nav>
    );
}

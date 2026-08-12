import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
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

const sectionIds = ["hero", ...navItems.map((i) => i.id)];

export default function Navigation() {
    const [scrolled, setScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState("hero");
    const [menuOpen, setMenuOpen] = useState(false);
    const lenis = useLenis();
    const reduceMotion = useReducedMotion();

    // Cheap scrolled flag — no layout reads, so a plain listener is fine here.
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Active section via IntersectionObserver instead of reading offsetTop for
    // every section on every scroll event, which forced a layout recalculation.
    useEffect(() => {
        const visible = new Map<string, number>();

        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    visible.set(
                        entry.target.id,
                        entry.isIntersecting ? entry.intersectionRatio : 0,
                    );
                }

                let best = "";
                let bestRatio = 0;
                for (const id of sectionIds) {
                    const ratio = visible.get(id) ?? 0;
                    if (ratio > bestRatio) {
                        best = id;
                        bestRatio = ratio;
                    }
                }
                if (best) setActiveSection(best);
            },
            { threshold: [0, 0.15, 0.35, 0.6, 0.9], rootMargin: "-80px 0px 0px 0px" },
        );

        for (const id of sectionIds) {
            const element = document.getElementById(id);
            if (element) observer.observe(element);
        }

        return () => observer.disconnect();
    }, []);

    // Lock the page behind the mobile drawer, and let Escape close it.
    useEffect(() => {
        if (!menuOpen) return;

        lenis?.stop();
        document.body.style.overflow = "hidden";

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setMenuOpen(false);
        };
        window.addEventListener("keydown", onKeyDown);

        return () => {
            lenis?.start();
            document.body.style.overflow = "";
            window.removeEventListener("keydown", onKeyDown);
        };
    }, [menuOpen, lenis]);

    const scrollTo = (e: React.MouseEvent, id: string) => {
        e.preventDefault();
        setMenuOpen(false);

        const target = document.getElementById(id);
        if (!target) return;

        // Lenis is stopped while the drawer is open; resume before scrolling.
        lenis?.start();

        if (lenis) lenis.scrollTo(target, { offset: -80, immediate: !!reduceMotion });
        else target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
    };

    return (
        <>
            <motion.nav
                initial={reduceMotion ? false : { y: -80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
                className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-500 ${scrolled || menuOpen
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

                        {/* Center nav pill — desktop */}
                        <div className="hidden md:flex items-center gap-1 bg-black/[0.04] rounded-full p-1 border border-black/[0.06]">
                            {navItems.map((item) => {
                                const active = activeSection === item.id;
                                return (
                                    <a
                                        key={item.id}
                                        href={`#${item.id}`}
                                        onClick={(e) => scrollTo(e, item.id)}
                                        aria-current={active ? "true" : undefined}
                                        className={`relative px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${active ? "text-white" : "text-zinc-500 hover:text-zinc-900"
                                            }`}
                                    >
                                        {active && (
                                            <motion.span
                                                layoutId="nav-active"
                                                className="absolute inset-0 rounded-full bg-emerald-500"
                                                transition={
                                                    reduceMotion
                                                        ? { duration: 0 }
                                                        : { type: "spring", stiffness: 380, damping: 30 }
                                                }
                                            />
                                        )}
                                        <span className="relative z-10">{item.label}</span>
                                    </a>
                                );
                            })}
                        </div>

                        <div className="flex items-center gap-2">
                            {/* Resume */}
                            <motion.a
                                href={personalInfo.resumeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={reduceMotion ? undefined : { y: -2 }}
                                whileTap={reduceMotion ? undefined : { scale: 0.97 }}
                                className="px-5 py-2.5 rounded-full border border-black/15 text-zinc-900 font-medium text-sm hover:bg-black/[0.04] hover:border-black/30 transition-colors duration-300"
                            >
                                Resume
                            </motion.a>

                            {/* Hamburger — mobile only */}
                            <button
                                type="button"
                                onClick={() => setMenuOpen((open) => !open)}
                                aria-label={menuOpen ? "Close menu" : "Open menu"}
                                aria-expanded={menuOpen}
                                aria-controls="mobile-menu"
                                className="md:hidden w-10 h-10 rounded-full border border-black/15 flex items-center justify-center text-zinc-900 hover:bg-black/[0.04] transition-colors"
                            >
                                <span className="relative block w-4 h-3" aria-hidden="true">
                                    <motion.span
                                        animate={menuOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
                                        transition={{ duration: reduceMotion ? 0 : 0.2 }}
                                        className="absolute left-0 top-0 w-4 h-[1.5px] bg-current rounded-full"
                                    />
                                    <motion.span
                                        animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
                                        transition={{ duration: reduceMotion ? 0 : 0.2 }}
                                        className="absolute left-0 top-[5px] w-4 h-[1.5px] bg-current rounded-full"
                                    />
                                    <motion.span
                                        animate={menuOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
                                        transition={{ duration: reduceMotion ? 0 : 0.2 }}
                                        className="absolute left-0 top-[10px] w-4 h-[1.5px] bg-current rounded-full"
                                    />
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile drawer */}
            <AnimatePresence>
                {menuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: reduceMotion ? 0 : 0.25 }}
                            onClick={() => setMenuOpen(false)}
                            className="md:hidden fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
                        />
                        <motion.div
                            id="mobile-menu"
                            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -16 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -16 }}
                            transition={{
                                duration: reduceMotion ? 0 : 0.28,
                                ease: [0.21, 0.47, 0.32, 0.98],
                            }}
                            className="md:hidden fixed top-[72px] left-4 right-4 z-40 rounded-2xl border border-black/[0.08] bg-[#f6f6f4]/95 backdrop-blur-xl shadow-xl overflow-hidden"
                        >
                            <nav className="flex flex-col p-2">
                                {navItems.map((item, index) => {
                                    const active = activeSection === item.id;
                                    return (
                                        <a
                                            key={item.id}
                                            href={`#${item.id}`}
                                            onClick={(e) => scrollTo(e, item.id)}
                                            aria-current={active ? "true" : undefined}
                                            className={`flex items-center justify-between px-4 py-3.5 rounded-xl text-base font-medium transition-colors ${active
                                                ? "bg-emerald-500 text-white"
                                                : "text-zinc-600 hover:bg-black/[0.04] hover:text-zinc-900"
                                                }`}
                                        >
                                            {item.label}
                                            <span
                                                className={`font-mono text-[11px] ${active ? "text-white/70" : "text-zinc-400"
                                                    }`}
                                            >
                                                {String(index + 1).padStart(2, "0")}
                                            </span>
                                        </a>
                                    );
                                })}
                            </nav>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}

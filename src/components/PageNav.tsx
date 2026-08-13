import { FolderOpen, Moon, Sun, User } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import { personalInfo } from "../data/portfolio";
import { useTheme } from "../hooks/useTheme";

const tabs = [
    { href: "/about", label: "About", Icon: User },
    { href: "/work", label: "Work", Icon: FolderOpen },
];

/** Shared by the travelling pill and the tab it is growing into, so the two
 *  arrive together instead of the pill overshooting an empty box. */
const pill = { type: "spring", stiffness: 260, damping: 30, mass: 0.9 } as const;

/**
 * Floating pill nav for standalone pages. The homepage keeps its own scroll-spy
 * Navigation — this one only moves between documents, so it stays dumb: real
 * hrefs, no Lenis, no IntersectionObserver. The active tab is the only one that
 * shows its label; the rest collapse to their icon.
 */
export default function PageNav({ current }: { current: string }) {
    const reduceMotion = useReducedMotion();
    const { theme, toggle } = useTheme();

    // Reading progress for the whole document, smoothed so it glides rather
    // than snapping with each wheel tick.
    const { scrollYProgress } = useScroll();
    const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });

    return (
        <>
            {/* Content passes behind the floating pill, so it dissolves into the
                page colour instead of being cut off by it. */}
            <div
                aria-hidden="true"
                className="chat-shift pointer-events-none fixed top-0 left-[var(--chat-pane)] right-0 h-24 z-40 bg-gradient-to-b from-[#f6f6f4] via-[#f6f6f4]/80 dark:from-[#0a0c0b] dark:via-[#0a0c0b]/80 to-transparent"
            />
            <motion.header
            initial={reduceMotion ? false : { y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="chat-shift fixed top-0 left-[var(--chat-pane)] right-0 z-50 px-4 sm:px-6 py-3 sm:py-4"
        >
            <motion.div
                aria-hidden="true"
                style={{ scaleX: reduceMotion ? 0 : progress }}
                className="absolute top-0 left-0 right-0 h-0.5 origin-left bg-emerald-500/70"
            />

            <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
                <a
                    href="/"
                    aria-label="Home"
                    className="group w-10 h-10 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center font-bold shadow-sm transition-transform duration-300 hover:rotate-6"
                >
                    {personalInfo.name.charAt(0)}
                </a>

                <nav className="flex items-center gap-1 rounded-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-black/[0.06] dark:border-white/10 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_10px_30px_-18px_rgba(0,0,0,0.4)] p-1.5">
                    {tabs.map(({ href, label, Icon }) => {
                        const active = href === current;
                        return (
                            <motion.a
                                key={href}
                                // The tab resizes as its label appears; `layout`
                                // eases that width change instead of snapping it.
                                layout={!reduceMotion}
                                href={href}
                                aria-label={label}
                                aria-current={active ? "page" : undefined}
                                transition={pill}
                                className={`relative flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium transition-colors duration-300 ${active
                                    ? "text-white"
                                    : "text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-black/[0.04] dark:hover:bg-white/[0.06] rounded-full"
                                    }`}
                            >
                                {/* One pill shared by both tabs: giving it the
                                    same layoutId in each makes it travel across
                                    rather than disappear here and reappear there. */}
                                {active && (
                                    <motion.span
                                        aria-hidden="true"
                                        layoutId={reduceMotion ? undefined : "nav-pill"}
                                        transition={pill}
                                        className="absolute inset-0 rounded-full bg-emerald-500"
                                    />
                                )}
                                <Icon className="relative z-10 w-4 h-4" strokeWidth={2} />
                                <AnimatePresence initial={false} mode="popLayout">
                                    {active && (
                                        <motion.span
                                            key="label"
                                            layout={!reduceMotion}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.15 }}
                                            className="relative z-10"
                                        >
                                            {label}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </motion.a>
                        );
                    })}
                </nav>

                <button
                    type="button"
                    onClick={toggle}
                    aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
                    aria-pressed={theme === "dark"}
                    title={theme === "dark" ? "Light" : "Dark"}
                    className="w-10 h-10 rounded-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-black/[0.06] dark:border-white/10 shadow-sm flex items-center justify-center text-zinc-500 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                    {theme === "dark" ? (
                        <Sun className="w-4 h-4" strokeWidth={2} />
                    ) : (
                        <Moon className="w-4 h-4" strokeWidth={2} />
                    )}
                </button>
            </div>
            </motion.header>
        </>
    );
}

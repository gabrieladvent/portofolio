import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { personalInfo, socialLinks } from "../data/portfolio";

const columns = [
    {
        title: "Navigation",
        links: [
            { label: "Home", href: "/" },
            { label: "About", href: "/about" },
            { label: "Projects", href: "/#projects" },
        ],
    },
    {
        title: "Socials",
        links: socialLinks.map((link) => ({ label: link.name, href: link.url })),
    },
    {
        title: "Elsewhere",
        links: [
            { label: "Resume", href: personalInfo.resumeUrl },
            { label: "Email", href: `mailto:${personalInfo.email}` },
            { label: "Activity", href: "/#stats" },
        ],
    },
];

const [firstName, ...rest] = personalInfo.name.split(" ");
const lastName = rest.join(" ").toUpperCase();
const first = firstName.toUpperCase();

/**
 * Wordmark geometry. The face is monospace, so one glyph is one unit — the
 * split below is exact for any name, and the dot is sized like a wide glyph.
 * textLength then pins each word to its slot so the mark always spans the full
 * viewport without measuring anything at runtime.
 */
const DOT_UNITS = 1.15;
const totalUnits = first.length + lastName.length + DOT_UNITS;
const unit = 100 / totalUnits;
const firstWidth = first.length * unit;
const dotRadius = (DOT_UNITS * unit) / 2;

/**
 * Footer for standalone pages: link columns, then the name set as a wordmark
 * that bleeds to the edges. The homepage keeps the compact Footer.
 */
export default function PageFooter() {
    const ref = useRef<HTMLElement>(null);
    const reduceMotion = useReducedMotion();

    // The two halves of the name drift together — and the dot swells into the
    // gap — as the footer comes into view.
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end end"],
    });
    const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 });
    const shiftLeft = useTransform(progress, [0, 1], [-2.5, 0]);
    const shiftRight = useTransform(progress, [0, 1], [2.5, 0]);
    const dotScale = useTransform(progress, [0.2, 1], [0, 1]);
    const columnsY = useTransform(progress, [0, 1], [30, 0]);

    return (
        <footer ref={ref} className="px-4 sm:px-6 pt-16 pb-6 overflow-hidden">
            <motion.div style={reduceMotion ? undefined : { y: columnsY }} className="max-w-7xl mx-auto">
                <div className="flex flex-wrap justify-start md:justify-end gap-10 sm:gap-16">
                    {columns.map((column) => (
                        <div key={column.title}>
                            <h2 className="text-zinc-900 dark:text-zinc-100 font-semibold text-sm">{column.title}</h2>
                            <ul className="mt-4 space-y-2.5">
                                {column.links.map((link) => (
                                    <li key={link.label}>
                                        <a
                                            href={link.href}
                                            target={link.href.startsWith("http") ? "_blank" : undefined}
                                            rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                                            className="text-sm text-zinc-400 dark:text-zinc-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                                        >
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <p className="mt-10 md:text-right font-mono text-xs text-zinc-400 dark:text-zinc-500">
                    © {new Date().getFullYear()} {personalInfo.name}.
                </p>
            </motion.div>

            {/* Wordmark — full-bleed, so it lives outside the max-width wrapper */}
            <svg
                aria-hidden="true"
                viewBox="0 0 100 13"
                preserveAspectRatio="none"
                className="mt-10 w-screen relative left-1/2 -translate-x-1/2 h-[13vw] select-none"
            >
                <g className="fill-zinc-900 dark:fill-zinc-100" fontSize="13" fontWeight="700">
                    <motion.text
                        x="0"
                        y="12"
                        textLength={firstWidth}
                        lengthAdjust="spacingAndGlyphs"
                        style={reduceMotion ? undefined : { x: shiftLeft }}
                    >
                        {first}
                    </motion.text>
                    <motion.text
                        x={firstWidth + DOT_UNITS * unit}
                        y="12"
                        textLength={lastName.length * unit}
                        lengthAdjust="spacingAndGlyphs"
                        style={reduceMotion ? undefined : { x: shiftRight }}
                    >
                        {lastName}
                    </motion.text>
                </g>
                <motion.circle
                    cx={firstWidth + dotRadius}
                    cy={12 - 13 * 0.36}
                    r={dotRadius}
                    fill="#10b981"
                    style={reduceMotion ? undefined : { scale: dotScale }}
                />
            </svg>
        </footer>
    );
}

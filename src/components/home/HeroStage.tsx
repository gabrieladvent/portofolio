import { useRef } from "react";
import {
    motion,
    useReducedMotion,
    useScroll,
    useSpring,
    useTransform,
    type MotionValue,
} from "motion/react";
import { ArrowRight } from "lucide-react";
import { personalInfo } from "../../data/portfolio";
import { useMagnetic } from "../../hooks/useMagnetic";

const ease = [0.21, 0.47, 0.32, 0.98] as const;

const line = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
};

/**
 * How many numbers the gutter prints. Enough to run past the copy at any
 * viewport, and cheap: they are static text, not a measurement of anything.
 */
const GUTTER_LINES = 14;

/**
 * The button the hero was missing.
 *
 * It sits in its own component because the magnetic pull needs a ref and two
 * motion values of its own, and hooks cannot be called from inside the array
 * the actions are laid out with.
 */
function MagneticLink({
    href,
    children,
    primary = false,
}: {
    href: string;
    children: React.ReactNode;
    primary?: boolean;
}) {
    const { ref, style, handlers } = useMagnetic<HTMLAnchorElement>(primary ? 0.28 : 0.18);

    return (
        <motion.a
            ref={ref}
            href={href}
            style={style}
            {...handlers}
            className={
                primary
                    ? "group inline-flex items-center gap-2 rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors duration-300 hover:bg-emerald-600 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-emerald-500 dark:hover:text-white"
                    : "group inline-flex items-center gap-2 rounded-full border border-black/[0.12] px-5 py-2.5 text-sm text-zinc-500 transition-colors duration-300 hover:border-emerald-500/50 hover:text-emerald-600 dark:border-white/[0.14] dark:text-zinc-400 dark:hover:text-emerald-400"
            }
        >
            {children}
            <ArrowRight
                aria-hidden="true"
                className="h-4 w-4 transition-transform duration-300 ease-[cubic-bezier(0.21,0.47,0.32,0.98)] group-hover:translate-x-0.5"
                strokeWidth={2}
            />
        </motion.a>
    );
}

/**
 * The line-number gutter, drifting a little faster than the copy beside it.
 *
 * It is here because of what comes next. The section below this one is an
 * editor window, and the reader meets it cold — the hero says nothing about
 * where they are about to be taken. Numbering the hero's own lines makes the
 * window's arrival read as the same document opening rather than as an
 * unrelated widget, and it costs one column of 10px type to say so.
 *
 * Decorative in the strict sense: every fact on this screen is in the prose.
 */
function Gutter({ y }: { y?: MotionValue<number> }) {
    return (
        <motion.div
            aria-hidden="true"
            style={y ? { y } : undefined}
            className="pointer-events-none absolute top-0 -left-10 hidden select-none flex-col gap-[0.62rem] pt-1 font-mono text-[10px] leading-none tabular-nums text-zinc-300 lg:flex dark:text-zinc-700"
        >
            {Array.from({ length: GUTTER_LINES }, (_, index) => (
                <span key={index}>{String(index + 1).padStart(2, "0")}</span>
            ))}
        </motion.div>
    );
}

export interface HeroStageProps {
    /** The line that changes between visits. */
    closer: string;
}

/**
 * The opening screen.
 *
 * Every other section of this site is driven by the scroll — the editor window
 * unrolls, the shelf travels sideways, the wordmark closes its gap. This one
 * used to be the exception: it appeared once and then simply scrolled away,
 * which made the first screen the only still one on the page.
 *
 * What it does now is hand over. As the reader scrolls, the five parts of the
 * copy leave at five different rates and the gutter runs ahead of all of them,
 * so the hero pulls apart into depth instead of sliding off as a single sheet —
 * and the editor window rises into the space it leaves.
 *
 * The rates are small on purpose. This is type being read, not scenery: a
 * headline that travels far enough to notice is a headline that is hard to
 * finish reading.
 */
export default function HeroStage({ closer }: HeroStageProps) {
    const ref = useRef<HTMLElement>(null);
    const reduceMotion = useReducedMotion();

    // "start start" → "end start": the whole of the hero's own exit, measured
    // from the moment it fills the screen to the moment it has left it.
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
    const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 26, mass: 0.35 });

    // Five rates, nearest-to-the-reader moving least. The eyebrow and the hint
    // are furthest from the eye and go first; the headline is what the reader
    // is still finishing, so it is the last to move.
    const eyebrowY = useTransform(progress, [0, 1], [0, -190]);
    const headingY = useTransform(progress, [0, 1], [0, -70]);
    const subY = useTransform(progress, [0, 1], [0, -110]);
    const closerY = useTransform(progress, [0, 1], [0, -140]);
    const actionsY = useTransform(progress, [0, 1], [0, -165]);
    const gutterY = useTransform(progress, [0, 1], [0, -240]);
    const hintY = useTransform(progress, [0, 1], [0, -60]);

    // The copy clears the screen well before the section does, so the fade is
    // finished by 0.55 rather than trailing a ghost of the headline over the
    // window that is opening underneath it.
    const fade = useTransform(progress, [0, 0.55], [1, 0]);
    const hintFade = useTransform(progress, [0, 0.22], [1, 0]);

    const still = (value: MotionValue<number>) => (reduceMotion ? undefined : value);

    return (
        <motion.section
            ref={ref}
            initial={reduceMotion ? undefined : "hidden"}
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09 } } }}
            /*
                Jarak bawah ekstra di layar sempit. Gelembung chat menempel di
                pojok kiri bawah (`fixed bottom-5 left-5`, 48px), dan selama
                lebar layar belum cukup untuk menengahkan `max-w-4xl`, teks
                masih rata kiri di 16px — persis di belakang gelembung itu.
                Baru di `xl` wadahnya tergeser cukup jauh ke kanan sehingga
                keduanya tidak lagi berpotongan.
            */
            className="relative mx-auto flex min-h-svh max-w-4xl flex-col px-4 pt-24 pb-24 sm:px-6 xl:pb-8"
        >
            <motion.div style={{ opacity: still(fade) }} className="relative my-auto">
                <Gutter y={still(gutterY)} />

                <motion.p
                    variants={line}
                    style={{ y: still(eyebrowY) }}
                    className="font-mono text-xs text-zinc-400 dark:text-zinc-500"
                >
                    {personalInfo.title} · {personalInfo.location}
                </motion.p>

                <motion.h1
                    variants={line}
                    style={{ y: still(headingY) }}
                    className="mt-4 text-3xl font-bold leading-[1.15] tracking-tight text-zinc-900 sm:text-5xl dark:text-zinc-100"
                >
                    Building systems that{" "}
                    <span className="text-emerald-600 dark:text-emerald-400">
                        keep their promises
                    </span>
                    .
                    {/* The caret an editor leaves at the end of the line it is
                        sitting on. It blinks on a step, not a fade — a fading
                        caret reads as a glow, and no editor has ever had one. */}
                    <motion.span
                        aria-hidden="true"
                        animate={reduceMotion ? undefined : { opacity: [1, 1, 0, 0] }}
                        transition={{ duration: 1.1, repeat: Infinity, times: [0, 0.5, 0.5, 1], ease: "linear" }}
                        className="ml-1.5 inline-block h-[0.9em] w-[0.5ch] translate-y-[0.08em] bg-emerald-500/80 align-middle"
                    />
                </motion.h1>

                <motion.p
                    variants={line}
                    style={{ y: still(subY) }}
                    className="mt-6 max-w-2xl leading-relaxed text-zinc-500 dark:text-zinc-400"
                >
                    Laravel and Go underneath, React and TypeScript on top.
                </motion.p>

                <motion.p
                    key={closer}
                    variants={line}
                    style={{ y: still(closerY) }}
                    className="mt-3 max-w-2xl leading-relaxed text-zinc-400 dark:text-zinc-500"
                >
                    {closer}
                </motion.p>

                {/*
                    Restored. These two links spent a while commented out, which
                    left the landing screen with no way onward at all except the
                    two icons in the floating nav — and a reader who does not
                    recognise those icons has nowhere to go but back.
                */}
                <motion.div
                    variants={line}
                    style={{ y: still(actionsY) }}
                    className="mt-9 flex flex-wrap items-center gap-3"
                >
                    <MagneticLink href="/work" primary>
                        See the work
                    </MagneticLink>
                    <MagneticLink href="/about">About me</MagneticLink>
                </motion.div>
            </motion.div>

            {/*
                The scroll cue. No longer aria-hidden: it is the only thing on
                this screen that says what the next one is, and hiding it from a
                screen reader hid exactly that.
            */}
            <motion.p
                variants={line}
                style={{ y: still(hintY), opacity: still(hintFade) }}
                className="mt-10 flex items-center gap-2 font-mono text-[11px] tracking-widest text-zinc-400 dark:text-zinc-600"
            >
                <motion.span
                    aria-hidden="true"
                    animate={reduceMotion ? undefined : { y: [0, 4, 0] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                    className="inline-block"
                >
                    ↓
                </motion.span>
                scroll to open the window
            </motion.p>
        </motion.section>
    );
}

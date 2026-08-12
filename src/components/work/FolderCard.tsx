import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import type { Project } from "../../data/portfolio";
import { shortStamp } from "../../utils/projectDate";

/**
 * Pastel wash behind each folder. Picked by position rather than stored on the
 * project so the grid keeps its rhythm no matter how the data is filtered or
 * reordered — and so adding a project never means choosing a colour.
 */
const TINTS = [
    "#34d399", // emerald
    "#f472b6", // pink
    "#818cf8", // indigo
    "#fbbf24", // amber
    "#22d3ee", // cyan
    "#a3e635", // lime
    "#fb923c", // orange
    "#c084fc", // purple
];

/**
 * The folder itself. A soft mint carries dark text, which reads better than the
 * white-on-deep-green it replaced — that pairing sat below the contrast floor
 * for text this size, and looked heavy next to the pastel wash behind it.
 */
const FOLDER = "bg-emerald-300 dark:bg-emerald-800";

/**
 * Three sheets tucked behind the folder that fan out on hover, as if the file
 * were being opened. Decorative — the card's own text carries every fact, so
 * this stays out of the accessibility tree.
 *
 * Each sheet is centred with a negative margin instead of a translate, leaving
 * the transform axes free for the fan itself.
 */
function Sheets({ project, still }: { project: Project; still: boolean }) {
    const base =
        "absolute bottom-0 left-1/2 -ml-[34px] w-[68px] h-[84px] rounded-md shadow-[0_6px_16px_-8px_rgba(0,0,0,0.5)] origin-bottom transition-[transform,opacity] duration-500 ease-out";
    // Idle: stacked flat behind the folder. Hover: fanned above its top edge.
    const idle = "translate-y-8 rotate-0 opacity-0";

    if (still) return null;

    return (
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-[38%] z-0 h-0">
            <img
                src={project.image}
                alt=""
                loading="lazy"
                decoding="async"
                className={`${base} ${idle} object-cover grayscale group-hover:-translate-x-8 group-hover:-translate-y-2 group-hover:-rotate-12 group-hover:opacity-100`}
            />
            <div
                className={`${base} ${idle} flex flex-col gap-1.5 bg-white p-2.5 group-hover:translate-x-8 group-hover:-translate-y-1 group-hover:rotate-11 group-hover:opacity-100`}
            >
                <span className="h-1 w-4/5 rounded-full bg-zinc-200" />
                <span className="h-1 w-full rounded-full bg-zinc-200" />
                <span className="h-1 w-2/3 rounded-full bg-zinc-200" />
                <span className="mt-auto h-1.5 w-1/2 rounded-full bg-emerald-500/40" />
            </div>
            <div
                className={`${base} ${idle} flex flex-col gap-1.5 bg-white p-2.5 group-hover:-translate-y-6 group-hover:-rotate-3 group-hover:opacity-100`}
            >
                <span className="h-1 w-1/2 rounded-full bg-zinc-200" />
                <span className="h-1 w-full rounded-full bg-zinc-200" />
                <span className="h-1 w-full rounded-full bg-zinc-200" />
                <span className="h-1 w-3/4 rounded-full bg-zinc-200" />
            </div>
        </div>
    );
}

/**
 * A project as a file in a drawer: pastel card, folder with a tab, and the
 * paperwork peeking out from behind it on hover.
 */
const EASE = [0.21, 0.47, 0.32, 0.98] as const;

export default function FolderCard({
    project,
    index,
    compact = false,
}: {
    project: Project;
    index: number;
    /**
     * Sized by its row rather than by its own content. Used inside the deck,
     * where three rows share whatever height the pinned panel has.
     */
    compact?: boolean;
}) {
    const reduceMotion = useReducedMotion();
    const tint = TINTS[index % TINTS.length];

    return (
        // Reflow (layout) and the hover lift both drive `y`, so they get a
        // wrapper each rather than fighting over one element's transform.
        <motion.div layout exit={{ opacity: 0, scale: 0.96 }} className="h-full min-w-0">
            <motion.div
                className="h-full"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: EASE }}
            >
            <motion.a
                href={`/work/${project.id}`}
                whileHover={reduceMotion ? undefined : { y: -6 }}
                transition={{ duration: 0.3, ease: EASE }}
                className={`group relative flex h-full flex-col justify-end overflow-hidden rounded-[22px] border border-black/[0.05] bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_16px_36px_-30px_rgba(0,0,0,0.5)] transition-shadow duration-300 hover:shadow-[0_1px_2px_rgba(0,0,0,0.04),0_26px_50px_-28px_rgba(0,0,0,0.45)] dark:border-white/[0.07] dark:bg-zinc-900 ${compact ? "pt-8" : "min-h-[218px] pt-16"
                    }`}
            >
                {/* Colour wash — inline because the palette is data, not a design token */}
                <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 top-0 h-1/2"
                    style={{ background: `linear-gradient(180deg, ${tint}42, transparent)` }}
                />

                <Sheets project={project} still={!!reduceMotion} />

                {/* Folder: a tab that runs flush into the body, so the body's
                    top-left corner stays square while the rest are rounded. */}
                <div className="relative z-10">
                    <div className={`h-3 w-[46%] rounded-t-[10px] ${FOLDER}`} />
                    <div className={`flex min-h-[118px] flex-col rounded-[14px] rounded-tl-none p-3.5 ${FOLDER}`}>
                        <div className="flex items-start justify-between gap-2">
                            <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-emerald-950 dark:text-emerald-50">
                                {project.title}
                            </h3>
                            <ArrowUpRight
                                className="mt-0.5 h-4 w-4 shrink-0 text-emerald-900/55 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 dark:text-emerald-100/60"
                                strokeWidth={2}
                            />
                        </div>

                        <p className="mt-1.5 truncate text-xs text-emerald-900/75 dark:text-emerald-100/75">
                            {project.role ?? "Developer"}
                        </p>

                        <span className="mt-auto self-end pt-3 font-mono text-xs tabular-nums text-emerald-900/70 dark:text-emerald-100/70">
                            {shortStamp(project.date)}
                        </span>
                    </div>
                </div>
            </motion.a>
            </motion.div>
        </motion.div>
    );
}

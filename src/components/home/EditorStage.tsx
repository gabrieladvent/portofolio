import { useRef, useState, type ReactNode } from "react";
import {
    motion,
    useMotionTemplate,
    useMotionValueEvent,
    useReducedMotion,
    useScroll,
    useSpring,
    useTransform,
} from "motion/react";
import GithubAct from "./GithubAct";
import WakatimeAct from "./WakatimeAct";
import TechAct from "./TechAct";

/**
 * Where each panel owns the scroll. The window finishes unrolling at 0.14, so
 * the first act starts after that and never plays against a folded body.
 */
const ACTS = {
    github: { from: 0.16, to: 0.44 },
    wakatime: { from: 0.44, to: 0.72 },
    // Ends early on purpose: the last act holds, settled, while the section runs
    // out of scroll and hands over to the footer.
    tech: { from: 0.72, to: 1 },
};

const TABS = ["activity.tsx", "waka.json", "stack.ts"];

/**
 * Height of the title bar in pixels — py-2.5 either side of an 11px mono line,
 * plus its bottom border. The roll-up leaves exactly this much standing, so the
 * closed window reads as a bar waiting to be opened.
 */
const BAR_HEIGHT = 38;

const tabSpring = { type: "spring", stiffness: 320, damping: 32, mass: 0.8 } as const;

const windowChrome =
    "overflow-hidden rounded-[14px] border border-black/[0.08] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_40px_80px_-48px_rgba(0,0,0,0.5)] dark:border-white/10 dark:bg-zinc-900";

function TitleBar({ active }: { active: number }) {
    return (
        <div className="flex items-center gap-4 border-b border-black/[0.06] bg-zinc-100/70 px-4 py-2.5 dark:border-white/[0.07] dark:bg-zinc-800/50">
            <span aria-hidden="true" className="flex shrink-0 gap-1.5">
                <i className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                <i className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                <i className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
            </span>

            <ul className="flex min-w-0 items-center gap-1 overflow-hidden">
                {TABS.map((tab, i) => (
                    <li key={tab} className="relative shrink-0">
                        {/* One highlight shared by every tab, so it travels
                            between them rather than blinking out and back in. */}
                        {i === active && (
                            <motion.span
                                aria-hidden="true"
                                layoutId="editor-tab"
                                transition={tabSpring}
                                className="absolute inset-0 rounded-md bg-white shadow-sm dark:bg-zinc-900"
                            />
                        )}
                        <span
                            className={`relative block rounded-md px-2.5 py-1 font-mono text-[11px] transition-colors duration-300 ${i === active
                                ? "text-zinc-900 dark:text-zinc-100"
                                : "text-zinc-400 dark:text-zinc-500"
                                }`}
                        >
                            {tab}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function Body({ children }: { children: ReactNode }) {
    // Tall on phones: a wide box at 350px across leaves under 200px of height,
    // and the stack alone needs fifteen lines down there.
    //
    // Wider than 16/9 on desktop: the panels are laid out in columns, so the
    // room they want is sideways. Letterboxing buys that width without the
    // window growing taller and crowding the screen it is pinned to.
    return <div className="relative aspect-3/5 sm:aspect-21/9">{children}</div>;
}

/** The scrolling version: a tall section with a pinned window inside it. */
function ScrollStage() {
    const ref = useRef<HTMLDivElement>(null);

    // The pinned box is exactly one viewport tall, which is what makes
    // "start start"→"end end" line up with the pinned range to the pixel.
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
    const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 26, mass: 0.35 });

    // Opening: the window unrolls downward out of its own title bar. Clipping
    // rather than scaling keeps the type inside at its true size the whole way.
    //
    // The clip is on the frame, not on the body: clipping only the body leaves
    // the frame's white fill standing at full height behind it — an empty sheet
    // with a title bar on top. Subtracting the bar's height in px means the
    // strip left behind is exactly the bar, whatever the window is sized to.
    const rolled = useTransform(progress, [0, 0.14], [1, 0]);
    const clipPath = useMotionTemplate`inset(0% 0% calc((100% - ${BAR_HEIGHT}px) * ${rolled}) 0% round 14px)`;

    // The title bar stays put and the body grows down out of it. An earlier cut
    // dropped the closed window by half its unbuilt body, to keep the bar in the
    // middle of the pinned screen — but that also delayed it by that much on the
    // way in, leaving a screen-high gap under the hero before anything appeared.
    const scale = useTransform(progress, [0, 0.14], [0.96, 1]);

    const [active, setActive] = useState(0);
    useMotionValueEvent(progress, "change", (value) => {
        const next = value >= ACTS.tech.from ? 2 : value >= ACTS.wakatime.from ? 1 : 0;
        setActive((current) => (current === next ? current : next));
    });

    return (
        <div ref={ref} className="h-[440svh]">
            <div className="sticky top-0 flex h-svh items-center justify-center px-4 sm:px-6">
                <motion.div style={{ scale }} className="w-full max-w-310">
                    <motion.div style={{ clipPath }} className={windowChrome}>
                        <TitleBar active={active} />
                        <Body>
                            <GithubAct progress={progress} {...ACTS.github} />
                            <WakatimeAct progress={progress} {...ACTS.wakatime} />
                            <TechAct progress={progress} {...ACTS.tech} />
                        </Body>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}

/**
 * The reduced-motion version. Pinning a section for four screenfuls is exactly
 * what that preference asks us not to do, so the panels simply stack — same
 * content, no hijacked scroll.
 */
function StaticStage() {
    return (
        <div className="mx-auto max-w-310 space-y-6 px-4 py-16 sm:px-6">
            {[
                <GithubAct key="g" still {...ACTS.github} />,
                <WakatimeAct key="w" still {...ACTS.wakatime} />,
                <TechAct key="t" still {...ACTS.tech} />,
            ].map((act, i) => (
                <div key={TABS[i]} className={windowChrome}>
                    <TitleBar active={i} />
                    <Body>{act}</Body>
                </div>
            ))}
        </div>
    );
}

export default function EditorStage() {
    const reduceMotion = useReducedMotion();
    return reduceMotion ? <StaticStage /> : <ScrollStage />;
}

import { motion, useMotionValue, useTransform, type MotionValue } from "motion/react";
import { skills, type Skill } from "../../data/portfolio";
import ActHeader from "./ActHeader";
import type { ActProps } from "./act";

const GROUPS: { key: Skill["category"]; label: string }[] = [
    { key: "frontend", label: "front" },
    { key: "backend", label: "back" },
    { key: "mobile", label: "mobile" },
    { key: "tools", label: "tools" },
];

/** Characters a code line may hold before it wraps to the next one. Small
 *  enough that the column still fits a phone without shrinking the type. */
const LINE_BUDGET = 44;

type Token =
    | { kind: "keyword" | "key" | "punct"; text: string }
    | { kind: "string"; text: string; skill: Skill };

/** Fill lines to the budget rather than a fixed count, so a long tool name
 *  pushes the wrap instead of overflowing the window. */
function wrap(items: Skill[]) {
    const rows: Skill[][] = [];
    let row: Skill[] = [];
    let width = 0;

    for (const skill of items) {
        const cost = skill.name.length + 4; // two quotes, a comma, a space
        if (row.length && width + cost > LINE_BUDGET) {
            rows.push(row);
            row = [];
            width = 0;
        }
        row.push(skill);
        width += cost;
    }
    if (row.length) rows.push(row);
    return rows;
}

/**
 * The stack, written out as the file the tab claims to be showing. Built once at
 * module load — it only depends on the skills list.
 */
const LINES: Token[][] = (() => {
    const lines: Token[][] = [
        [
            { kind: "keyword", text: "export const " },
            { kind: "key", text: "stack" },
            { kind: "punct", text: " = {" },
        ],
    ];

    for (const group of GROUPS) {
        const items = skills.filter((skill) => skill.category === group.key);
        if (!items.length) continue;

        lines.push([
            { kind: "key", text: `  ${group.label}` },
            { kind: "punct", text: ": [" },
        ]);

        const rows = wrap(items);
        rows.forEach((row, index) => {
            const line: Token[] = [{ kind: "punct", text: "    " }];
            row.forEach((skill, i) => {
                line.push({ kind: "string", text: `"${skill.name}"`, skill });
                if (i < row.length - 1) line.push({ kind: "punct", text: ", " });
            });
            // The closer rides the last row instead of taking a line of its own.
            line.push({ kind: "punct", text: index === rows.length - 1 ? " ]," : "," });
            lines.push(line);
        });
    }

    lines.push([{ kind: "punct", text: "}" }]);
    return lines;
})();

const TONE: Record<Token["kind"], string> = {
    // The tool names carry the meaning, so they get the strongest colour —
    // the reverse of a normal theme, where strings sit back behind syntax.
    string: "text-zinc-900 dark:text-zinc-100",
    keyword: "text-emerald-600 dark:text-emerald-400",
    key: "text-zinc-500 dark:text-zinc-400",
    punct: "text-zinc-300 dark:text-zinc-600",
};

/** A quoted tool name. Its logo is the reward for hovering, not the headline. */
function StringToken({ token }: { token: Extract<Token, { kind: "string" }> }) {
    return (
        <span className="group/tok relative">
            <span className="rounded-[3px] transition-colors duration-200 group-hover/tok:bg-emerald-500/15">
                {token.text}
            </span>
            <img
                src={`https://skillicons.dev/icons?i=${token.skill.icon}&theme=dark`}
                alt=""
                aria-hidden="true"
                loading="lazy"
                decoding="async"
                className="pointer-events-none absolute -top-8 left-1/2 z-20 h-7 w-7 -translate-x-1/2 rounded-md opacity-0 shadow-lg transition-opacity duration-200 group-hover/tok:opacity-100"
            />
        </span>
    );
}

/** How wide a token draws in the minimap, as a share of the line budget. */
function share(text: string) {
    return `${Math.min((text.length / LINE_BUDGET) * 100, 100)}%`;
}

const MINIMAP_TONE: Record<Token["kind"], string> = {
    string: "bg-zinc-400 dark:bg-zinc-500",
    keyword: "bg-emerald-500/70",
    key: "bg-zinc-300 dark:bg-zinc-600",
    punct: "bg-zinc-200 dark:bg-zinc-700",
};

/**
 * The minimap a real editor puts down the right-hand edge: the same file at a
 * size too small to read, which is the point — it shows the file's shape while
 * the words are busy being written.
 */
function MinimapLine({
    progress,
    start,
    tokens,
    still,
}: {
    progress: MotionValue<number>;
    start: number;
    tokens: Token[];
    still: boolean;
}) {
    const opacity = useTransform(progress, [start, start + 0.012], [0, 1]);

    return (
        <motion.div style={still ? undefined : { opacity }} className="flex h-[3px] gap-[2px]">
            {tokens.map((token, i) => (
                <span
                    key={i}
                    style={{ width: share(token.text) }}
                    className={`rounded-full ${MINIMAP_TONE[token.kind]}`}
                />
            ))}
        </motion.div>
    );
}

function CodeLine({
    progress,
    start,
    number,
    tokens,
    still,
}: {
    progress: MotionValue<number>;
    start: number;
    number: number;
    tokens: Token[];
    still: boolean;
}) {
    const opacity = useTransform(progress, [start, start + 0.012], [0, 1]);
    const x = useTransform(progress, [start, start + 0.018], [-10, 0]);

    return (
        <motion.div
            style={still ? undefined : { opacity, x }}
            className="flex gap-3 leading-5 sm:gap-4"
        >
            <span className="w-4 shrink-0 select-none text-right tabular-nums text-zinc-300 dark:text-zinc-700">
                {number}
            </span>
            <span className="min-w-0 whitespace-pre-wrap break-words">
                {tokens.map((token, i) =>
                    token.kind === "string" ? (
                        <StringToken key={i} token={token} />
                    ) : (
                        <span key={i} className={TONE[token.kind]}>
                            {token.text}
                        </span>
                    ),
                )}
            </span>
        </motion.div>
    );
}

/**
 * Act three: the stack as source.
 *
 * Two earlier passes showed it as logos — first a grid, then labelled pills —
 * and both read as a wall of pictures. The window is an editor and the tab says
 * `stack.ts`, so the file itself is the honest thing to put on screen; the logos
 * stay, one hover at a time.
 *
 * An even earlier version keyed that grid by icon to avoid drawing a logo twice,
 * which quietly dropped five tools — and the wrong five, since a Map keeps the
 * last entry for a repeated key. React, PHP, Node.js, PostgreSQL and Redis each
 * lost their slot to a library that borrows their logo.
 */
export default function TechAct({ progress, from, to, still = false }: ActProps) {
    const idle = useMotionValue(1);
    const p = progress ?? idle;

    // The last act holds to the end of the section instead of fading out, so the
    // screen is never blank on the way to the footer.
    const opacity = useTransform(p, [from, from + 0.07, to], [0, 1, 1]);

    // Every line has to be written before the section runs out of scroll.
    const step = 0.16 / LINES.length;

    return (
        <motion.div
            style={still ? undefined : { opacity }}
            className="absolute inset-0 flex flex-col justify-between p-5 sm:p-7"
        >
            {/* Not "stack.ts" — the tab above already says that, and a heading
                that repeats its own tab tells the reader nothing. */}
            <ActHeader eyebrow="Stack" value="What I build with" caption={`${skills.length} tools`} />

            <div className="flex items-start gap-6 sm:gap-10">
                {/* The explorer an editor keeps on the left. It earns its place:
                    the group sizes are the one thing the file itself buries. */}
                <div
                    aria-hidden="true"
                    className="hidden w-40 shrink-0 border-r border-black/[0.06] pr-6 font-mono text-[11px] lg:block dark:border-white/[0.07]"
                >
                    <p className="mb-3 text-[10px] uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                        Explorer
                    </p>
                    <p className="mb-1.5 text-zinc-500 dark:text-zinc-400">stack.ts</p>
                    {GROUPS.map((group) => (
                        <p key={group.key} className="flex items-baseline justify-between gap-2 py-0.5">
                            <span className="text-zinc-400 dark:text-zinc-500">└ {group.label}</span>
                            <span className="tabular-nums text-zinc-300 dark:text-zinc-600">
                                {skills.filter((skill) => skill.category === group.key).length}
                            </span>
                        </p>
                    ))}
                </div>

                <div className="min-w-0 flex-1 font-mono text-[10px] sm:text-[11px] xl:text-[13px]">
                    {LINES.map((tokens, index) => (
                        <CodeLine
                            key={index}
                            progress={p}
                            start={from + 0.04 + index * step}
                            number={index + 1}
                            tokens={tokens}
                            still={still}
                        />
                    ))}
                </div>

                <div
                    aria-hidden="true"
                    className="hidden w-24 shrink-0 space-y-[7px] border-l border-black/[0.06] pl-4 sm:block dark:border-white/[0.07]"
                >
                    {LINES.map((tokens, index) => (
                        <MinimapLine
                            key={index}
                            progress={p}
                            start={from + 0.04 + index * step}
                            tokens={tokens}
                            still={still}
                        />
                    ))}
                </div>
            </div>

            <div className="flex items-center justify-between gap-4 border-t border-black/[0.06] pt-3 font-mono text-[10px] text-zinc-400 dark:border-white/[0.07] dark:text-zinc-500">
                {/* Both halves at once wrap to two lines on a phone, which is
                    two lines more than a status bar is worth. */}
                <span className="hidden sm:inline">
                    TypeScript · {LINES.length} lines · {GROUPS.length} groups
                </span>
                <span>Hover a name for its logo</span>
            </div>
        </motion.div>
    );
}

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

            <div className="font-mono text-[10px] sm:text-[11px]">
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

            <p className="font-mono text-[10px] text-zinc-400 dark:text-zinc-500">
                Hover a name for its logo
            </p>
        </motion.div>
    );
}

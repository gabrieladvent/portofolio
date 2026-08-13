import { useRef, type PointerEvent as ReactPointerEvent } from "react";
import {
    motion,
    useMotionTemplate,
    useMotionValue,
    useReducedMotion,
    useScroll,
    useSpring,
    useTransform,
} from "motion/react";
import { personalInfo } from "../../data/portfolio";
import { useGitHubProfile } from "../../hooks/useApi";

function rosette(R: number, a: number, k: number, phase: number) {
    const steps = 340;
    const points: string[] = [];

    for (let i = 0; i <= steps; i++) {
        const t = (i / steps) * Math.PI * 2;
        const r = R + a * Math.cos(k * t + phase);
        points.push(
            `${(300 + r * Math.cos(t)).toFixed(1)} ${(190 + r * Math.sin(t) * 0.72).toFixed(1)}`,
        );
    }

    return `M${points.join("L")}Z`;
}

const rings = Array.from({ length: 18 }, (_, i) => ({
    d: rosette(70 + i * 8, 14 + i * 0.9, 11, i * 0.19),
    opacity: 0.3 - i * 0.012,
}));

const petals = Array.from({ length: 7 }, (_, i) => ({
    d: rosette(150 + i * 16, 30, 19, i * 0.31),
    opacity: 0.12 - i * 0.012,
}));

function Guilloche() {
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 600 380"
            preserveAspectRatio="xMidYMid slice"
            className="absolute inset-0 w-full h-full"
        >
            <defs>
                <linearGradient id="id-guilloche" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="50%" stopColor="#38bdf8" />
                    <stop offset="100%" stopColor="#a78bfa" />
                </linearGradient>
            </defs>
            <g fill="none" stroke="url(#id-guilloche)" strokeWidth="0.4">
                {petals.map((petal) => (
                    <path key={petal.d} d={petal.d} opacity={petal.opacity} />
                ))}
                {rings.map((ring) => (
                    <path key={ring.d} d={ring.d} opacity={ring.opacity} />
                ))}
            </g>
        </svg>
    );
}

const PRINT = {
    core: { x: 50, y: 42 },
    delta: { x: 33, y: 80 },
    spacing: 3.5,
    step: 0.8,
    maxSteps: 260,
};

function orientation(x: number, y: number) {
    const toCore = Math.atan2(y - PRINT.core.y, x - PRINT.core.x);
    const toDelta = Math.atan2(y - PRINT.delta.y, x - PRINT.delta.x);
    return Math.PI / 2 + 0.5 * (toCore - toDelta);
}

function inPad(x: number, y: number) {
    const dx = (x - 50) / 41;
    const dy = (y - 54) / 50;
    const wobble = 1 + 0.06 * Math.sin(Math.atan2(dy, dx) * 3 + 0.7);
    return dx * dx + dy * dy < wobble;
}

function nearSingularity(x: number, y: number) {
    return (
        Math.hypot(x - PRINT.core.x, y - PRINT.core.y) < 1.6 ||
        Math.hypot(x - PRINT.delta.x, y - PRINT.delta.y) < 1.6
    );
}

function makeGrid() {
    const cell = PRINT.spacing;
    const cols = Math.ceil(100 / cell) + 2;
    const rows = Math.ceil(108 / cell) + 2;
    const buckets: [number, number][][] = Array.from({ length: cols * rows }, () => []);
    const indexOf = (x: number, y: number) =>
        Math.floor(y / cell + 1) * cols + Math.floor(x / cell + 1);

    return {
        add(x: number, y: number) {
            const i = indexOf(x, y);
            if (buckets[i]) buckets[i].push([x, y]);
        },
        tooClose(x: number, y: number, limit: number) {
            const cx = Math.floor(x / cell + 1);
            const cy = Math.floor(y / cell + 1);
            for (let j = cy - 1; j <= cy + 1; j++) {
                for (let i = cx - 1; i <= cx + 1; i++) {
                    const bucket = buckets[j * cols + i];
                    if (!bucket) continue;
                    for (const [px, py] of bucket) {
                        if ((px - x) ** 2 + (py - y) ** 2 < limit * limit) return true;
                    }
                }
            }
            return false;
        },
    };
}

const ridgePaths = (() => {
    const grid = makeGrid();
    const paths: { d: string; opacity: number }[] = [];
    const stopDistance = PRINT.spacing * 0.62;

    const trace = (seedX: number, seedY: number, direction: 1 | -1) => {
        const points: [number, number][] = [];
        let x = seedX;
        let y = seedY;
        let previous = orientation(x, y);

        for (let i = 0; i < PRINT.maxSteps; i++) {
            let angle = orientation(x, y);
            while (angle - previous > Math.PI / 2) angle -= Math.PI;
            while (previous - angle > Math.PI / 2) angle += Math.PI;
            previous = angle;

            x += direction * Math.cos(angle) * PRINT.step;
            y += direction * Math.sin(angle) * PRINT.step;

            if (!inPad(x, y) || nearSingularity(x, y)) break;
            if (grid.tooClose(x, y, stopDistance)) break;
            points.push([x, y]);
        }

        return points;
    };

    const seeds: [number, number][] = [];
    for (let y = 4; y < 106; y += 1.6) {
        for (let x = 4; x < 97; x += 1.6) {
            if (inPad(x, y)) seeds.push([x, y]);
        }
    }
    seeds.sort(
        (a, b) =>
            Math.hypot(a[0] - PRINT.core.x, a[1] - PRINT.core.y) -
            Math.hypot(b[0] - PRINT.core.x, b[1] - PRINT.core.y),
    );

    let index = 0;
    for (const [sx, sy] of seeds) {
        if (nearSingularity(sx, sy) || grid.tooClose(sx, sy, PRINT.spacing)) continue;

        const forward = trace(sx, sy, 1);
        const backward = trace(sx, sy, -1).reverse();
        const line: [number, number][] = [...backward, [sx, sy], ...forward];
        if (line.length < 8) continue;

        for (const [px, py] of line) grid.add(px, py);

        const cuts = new Set<number>();
        if (line.length > 40) cuts.add((index * 37) % (line.length - 12) + 6);
        if (index % 3 === 0 && line.length > 70) {
            cuts.add((index * 53) % (line.length - 12) + 6);
        }

        const segments: string[] = [];
        let run: string[] = [];
        line.forEach(([px, py], i) => {
            const cut = [...cuts].some((c) => i >= c && i < c + 4);
            if (cut) {
                if (run.length > 3) segments.push(`M${run.join("L")}`);
                run = [];
                return;
            }
            run.push(`${px.toFixed(1)} ${py.toFixed(1)}`);
        });
        if (run.length > 3) segments.push(`M${run.join("L")}`);

        for (const d of segments) {
            paths.push({ d, opacity: index % 7 === 6 ? 0.62 : 0.92 });
        }
        index++;
    }

    return paths;
})();

function Fingerprint() {
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 100 108"
            className="w-full h-full"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.1"
            strokeLinecap="round"
        >
            {ridgePaths.map((ridge, index) => (
                <path key={index} d={ridge.d} opacity={ridge.opacity} />
            ))}
        </svg>
    );
}

function Signature() {
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 160 46"
            className="w-full h-full"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M6 34 C14 10, 22 8, 24 20 C26 32, 20 38, 18 30 C16 22, 26 14, 38 20 C46 24, 44 34, 40 32 C36 30, 42 18, 54 20 C62 21, 60 32, 56 31 C52 30, 58 16, 72 22 C80 25, 84 33, 92 26 C98 21, 96 14, 92 16 C88 18, 92 30, 104 28 C116 26, 122 16, 134 24 C142 29, 148 24, 154 14" />
        </svg>
    );
}

const barcode = Array.from({ length: 30 }, (_, i) => 1 + ((i * 7) % 4));

const classes = [
    { code: "A", label: "Backend" },
    { code: "B", label: "Frontend" },
    { code: "C", label: "Mobile & Ops" },
];

const SURNAME = "Ritan";

const fields = [
    { label: "Nama", value: `${personalInfo.name} ${SURNAME}` },
    { label: "Profesi", value: personalInfo.title },
    { label: "Domisili", value: personalInfo.location },
    { label: "Stack Utama", value: "Laravel · Go · React" },
    { label: "Zona Waktu", value: "GMT+7 · WIB" },
    { label: "Status", value: "Open to work" },
];

export default function IdCard() {
    const { profile } = useGitHubProfile();
    const reduceMotion = useReducedMotion();
    const photo = profile?.avatar_url ?? personalInfo.avatar;

    const px = useMotionValue(0.5);
    const py = useMotionValue(0.5);
    const lift = useMotionValue(0);

    const spring = { stiffness: 220, damping: 26, mass: 0.6 };
    const rotateY = useSpring(useTransform(px, [0, 1], [-7, 7]), spring);
    const pointerRotateX = useSpring(useTransform(py, [0, 1], [5.5, -5.5]), spring);
    const glareOpacity = useSpring(lift, { stiffness: 180, damping: 30 });

    const cardRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: cardRef,
        offset: ["start end", "end start"],
    });
    const travel = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.35 });
    const scrollY = useTransform(travel, [0, 1], [16, -16]);
    const rotateX = pointerRotateX;

    const glareX = useTransform(px, (v) => v * 100);
    const glareY = useTransform(py, (v) => v * 100);
    const holoAngle = useTransform(px, [0, 1], [65, 205]);

    const glare = useMotionTemplate`radial-gradient(340px circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.5), rgba(255,255,255,0) 62%)`;
    const holo = useMotionTemplate`linear-gradient(${holoAngle}deg, rgba(16,185,129,0.3) 8%, rgba(56,189,248,0.26) 34%, rgba(167,139,250,0.28) 58%, rgba(251,191,36,0.24) 82%)`;

    const handlePointerMove = (event: ReactPointerEvent<HTMLElement>) => {
        if (reduceMotion) return;
        const rect = event.currentTarget.getBoundingClientRect();
        px.set((event.clientX - rect.left) / rect.width);
        py.set((event.clientY - rect.top) / rect.height);
    };

    return (
        <motion.section
            ref={cardRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
            style={
                reduceMotion
                    ? undefined
                    : {
                        rotateX,
                        rotateY,
                        y: scrollY,
                        transformPerspective: 1400,
                        transformStyle: "preserve-3d",
                    }
            }
            onPointerMove={handlePointerMove}
            onPointerEnter={() => lift.set(1)}
            onPointerLeave={() => {
                px.set(0.5);
                py.set(0.5);
                lift.set(0);
            }}
            className="relative rounded-3xl border border-black/[0.06] dark:border-white/[0.07] bg-white dark:bg-zinc-900 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_18px_40px_-28px_rgba(0,0,0,0.35)] overflow-hidden"
        >
            {/* ── Card face ────────────────────────────────────────────── */}
            <div className="relative px-5 sm:px-6 pt-4 sm:pt-4.5 pb-4">
                <div className="absolute inset-0 bg-emerald-50/40 dark:bg-emerald-950/30" />
                <Guilloche />

                <div className="relative flex items-start justify-between gap-4 pb-3 border-b border-emerald-900/10 dark:border-emerald-100/10">
                    <div className="min-w-0">
                        <div className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.24em] font-semibold text-emerald-800 dark:text-emerald-300 truncate">
                            Republik Pengembang
                        </div>
                        <div className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-emerald-700/60 dark:text-emerald-400/60 mt-0.5">
                            Kartu Izin Membangun
                        </div>
                    </div>

                    {/* Contact pad, the way a chip card carries one */}
                    <div
                        aria-hidden="true"
                        className="shrink-0 w-10 h-7 rounded-[4px] bg-gradient-to-br from-amber-200 to-amber-400 p-[3px] shadow-sm"
                    >
                        <div className="w-full h-full rounded-[2px] border border-amber-700/40 grid grid-cols-2 grid-rows-3 gap-[1px]">
                            {Array.from({ length: 6 }, (_, i) => (
                                <span key={i} className="bg-amber-700/25 rounded-[1px]" />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Thumbprint watermark. Sits under the record rather than
                    beside it, so it can be printed large without stealing room —
                    the faintness is what lets type cross it safely. */}
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute right-[124px] sm:right-[148px] top-[46%] -translate-y-1/2 w-[128px] sm:w-[158px] flex flex-col items-center text-emerald-950/20 dark:text-emerald-200/20"
                >
                    <Fingerprint />
                    <div className="font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.18em] text-emerald-800/40 dark:text-emerald-300/40 mt-1">
                        Sidik Jari
                    </div>
                </div>

                <div className="relative mt-2.5 flex gap-4 sm:gap-6">
                    {/* Left: the record itself */}
                    <div className="min-w-0 flex-1">
                        <div className="flex items-baseline gap-2">
                            <span className="font-mono text-[11px] uppercase tracking-widest text-emerald-700/70 dark:text-emerald-400/70 shrink-0">
                                NIK
                            </span>
                            <span className="font-mono text-lg sm:text-[22px] font-bold text-zinc-900 dark:text-zinc-100 tracking-[0.1em] tabular-nums truncate">
                                3404 0711 2202 0001
                            </span>
                        </div>

                        <dl className="mt-2 space-y-1">
                            {fields.map((field) => (
                                <div key={field.label} className="flex gap-2 text-xs sm:text-[13px]">
                                    <dt className="w-[84px] sm:w-[104px] shrink-0 font-mono uppercase tracking-wide text-emerald-700/70 dark:text-emerald-400/70">
                                        {field.label}
                                    </dt>
                                    <dd className="min-w-0 flex-1 flex gap-1.5 text-zinc-900 dark:text-zinc-100 font-semibold uppercase tracking-tight">
                                        <span className="text-emerald-700/40 dark:text-emerald-400/40">:</span>
                                        <span className="truncate">{field.value}</span>
                                    </dd>
                                </div>
                            ))}
                        </dl>

                        {/* Licence classes — what he's cleared to build */}
                        <div className="mt-3 pt-2.5 border-t border-emerald-900/10 dark:border-emerald-100/10">
                            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-emerald-700/60 dark:text-emerald-400/60">
                                Golongan
                            </div>
                            <div className="mt-1.5 flex flex-wrap gap-1.5">
                                {classes.map((item) => (
                                    <span
                                        key={item.code}
                                        className="flex items-center gap-1.5 pl-1.5 pr-2 py-1 rounded-md bg-white/70 dark:bg-white/[0.06] border border-emerald-900/10 dark:border-white/10"
                                    >
                                        <span className="w-[18px] h-[18px] rounded-[3px] bg-emerald-900 dark:bg-emerald-400 text-white dark:text-emerald-950 font-mono text-[10px] font-bold flex items-center justify-center">
                                            {item.code}
                                        </span>
                                        <span className="font-mono text-[10px] uppercase tracking-wide text-zinc-600 dark:text-zinc-300">
                                            {item.label}
                                        </span>
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right: portrait with the signature beneath it */}
                    <div className="shrink-0 w-[96px] sm:w-[112px] flex flex-col items-center">
                        <div className="w-full aspect-[3/4] rounded-sm overflow-hidden bg-white/70 dark:bg-white/5 ring-1 ring-emerald-900/15 dark:ring-emerald-100/15 shadow-sm">
                            <img src={photo} alt={personalInfo.name} className="w-full h-full object-cover" />
                        </div>

                        <div className="w-full mt-2 h-7 text-emerald-950/70 dark:text-emerald-100/70 border-b border-emerald-900/15 dark:border-emerald-100/15">
                            <Signature />
                        </div>
                        <div className="font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.16em] text-emerald-700/60 dark:text-emerald-400/60 mt-1">
                            Tanda Tangan
                        </div>
                    </div>
                </div>
            </div>

            {/* Barcode and issue line, parked in the corner the signature
                leaves empty — out of flow, so it costs the card no height */}
            <div className="hidden sm:block absolute bottom-4 right-6 text-right">
                <div aria-hidden="true" className="flex items-end justify-end gap-[2px] h-4">
                    {barcode.map((width, index) => (
                        <span
                            key={index}
                            style={{ width: `${width}px` }}
                            className={`h-full ${index % 3 === 0 ? "bg-zinc-400 dark:bg-zinc-600" : "bg-zinc-700 dark:bg-zinc-300"}`}
                        />
                    ))}
                </div>
                <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-zinc-400 dark:text-zinc-500 mt-1.5">
                    Yogyakarta · 2022
                </div>
            </div>

            {/* ── Lamination ───────────────────────────────────────────── */}
            {!reduceMotion && (
                <>
                    <motion.div
                        aria-hidden="true"
                        style={{ backgroundImage: holo }}
                        className="pointer-events-none absolute inset-0 mix-blend-overlay opacity-25"
                    />
                    <motion.div
                        aria-hidden="true"
                        style={{ backgroundImage: glare, opacity: glareOpacity }}
                        className="pointer-events-none absolute inset-0 mix-blend-soft-light"
                    />
                    <motion.div
                        aria-hidden="true"
                        initial={{ x: "-140%" }}
                        animate={{ x: "260%" }}
                        transition={{
                            duration: 1.6,
                            ease: "easeInOut",
                            repeat: Infinity,
                            repeatDelay: 4.5,
                        }}
                        className="pointer-events-none absolute inset-y-0 left-0 w-1/3 skew-x-[-18deg] bg-gradient-to-r from-transparent via-white/25 to-transparent"
                    />
                </>
            )}
        </motion.section>
    );
}

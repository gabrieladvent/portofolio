import { useState } from "react";
import { motion } from "motion/react";
import {
    Laptop,
    Mail,
    Server,
    Smartphone,
    Wrench,
    type LucideIcon,
} from "lucide-react";
import { experiences, personalInfo, skills, socialLinks } from "../data/portfolio";
import { SocialIcon } from "../utils/helpers";
import IdCard from "../components/about/IdCard";
import PhotoDeck, { type DeckItem } from "../components/about/PhotoDeck";
import GlobeCard from "../components/about/GlobeCard";
import ScrollCard from "../components/about/ScrollCard";
import PageFooter from "../components/PageFooter";
import PageNav from "../components/PageNav";

const ease = [0.21, 0.47, 0.32, 0.98] as const;

/** Shared child variant for the staggered lists inside the cards. */
const row = {
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
};

const cardTitle = "text-zinc-900 dark:text-zinc-100 font-semibold text-lg";

/** Highlighter pen, for the two phrases the page is actually about. */
function Mark({ children }: { children: React.ReactNode }) {
    return (
        <mark className="bg-emerald-500/20 dark:bg-emerald-400/25 text-zinc-900 dark:text-emerald-50 rounded-[3px] px-1 py-0.5 box-decoration-clone">
            {children}
        </mark>
    );
}

const expertise: { title: string; Icon: LucideIcon; categories: string[] }[] = [
    { title: "Web Development", Icon: Laptop, categories: ["frontend"] },
    { title: "Backend & Data", Icon: Server, categories: ["backend"] },
    { title: "Mobile Development", Icon: Smartphone, categories: ["mobile"] },
    { title: "Tools & DevOps", Icon: Wrench, categories: ["tools"] },
];

const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/** "2025-05" → "May 2025". "Present" passes through untouched. */
function formatDate(value: string) {
    const match = /^(\d{4})-(\d{2})$/.exec(value);
    if (!match) return value;
    return `${months[Number(match[2]) - 1]} ${match[1]}`;
}

/**
 * The Connect deck. Each item takes an optional `src` — drop a photo in
 * public/ and point at it (e.g. "/photos/jogja.jpg") to replace the placeholder.
 */
const deck: DeckItem[] = [
    {
        id: "portrait",
        caption: "the passport photo",
        meta: "2026",
        src: personalInfo.avatar,
        tint: "bg-zinc-100",
        emoji: "🙂",
    },
    { id: "kopi", caption: "kopi tubruk, no sugar", meta: "07:00", tint: "bg-amber-100", emoji: "☕" },
    { id: "night", caption: "night shift", meta: "23:40", tint: "bg-emerald-100", emoji: "⌨️" },
    { id: "ride", caption: "keliling Jogja", meta: "sun", tint: "bg-sky-100", emoji: "🏍️" },
];

/** github.com/gabrieladvent → gabrieladvent */
function handleOf(url: string) {
    return url.replace(/\/+$/, "").split("/").pop() ?? url;
}

function ExperienceItem({
    experience,
    last,
}: {
    experience: (typeof experiences)[number];
    last: boolean;
}) {
    const [expanded, setExpanded] = useState(false);
    // A missing or broken logo file falls back to the initial rather than the
    // browser's broken-image glyph.
    const [logoBroken, setLogoBroken] = useState(false);
    // Wordmark logos are far wider than tall; shrinking one to a 20px row makes
    // its lettering unreadable, so those get cropped to the mark on their left.
    const [isWordmark, setIsWordmark] = useState(false);
    const showLogo = experience.logo && !logoBroken;

    return (
        <div className={last ? "" : "pb-6 mb-6 border-b border-black/[0.06] dark:border-white/[0.07]"}>
            <h3 className="text-zinc-900 dark:text-zinc-100 font-semibold">{experience.position}</h3>

            <div className="mt-2 flex items-center gap-2.5 text-sm">
                {showLogo ? (
                    <img
                        src={experience.logo}
                        alt=""
                        loading="lazy"
                        onError={() => setLogoBroken(true)}
                        onLoad={(event) => {
                            const { naturalWidth, naturalHeight } = event.currentTarget;
                            setIsWordmark(naturalWidth / naturalHeight > 1.8);
                        }}
                        className={`h-5 shrink-0 ${isWordmark
                            ? "w-5 object-cover object-left"
                            : "w-auto max-w-14 object-contain object-left"
                            }`}
                    />
                ) : (
                    <span className="w-5 h-5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-mono text-[10px] flex items-center justify-center shrink-0">
                        {experience.company.charAt(0)}
                    </span>
                )}
                <span className="text-zinc-700 dark:text-zinc-300 truncate">{experience.company}</span>
            </div>

            <div className="mt-1.5 font-mono text-xs text-zinc-400 dark:text-zinc-500 tabular-nums">
                {formatDate(experience.startDate)} — {formatDate(experience.endDate)}
            </div>

            <p
                className={`mt-3 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed ${expanded ? "" : "line-clamp-2"
                    }`}
            >
                {experience.description}
            </p>

            <button
                type="button"
                onClick={() => setExpanded((open) => !open)}
                aria-expanded={expanded}
                className="mt-1.5 text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
            >
                {expanded ? "less" : "more"}
            </button>
        </div>
    );
}

export default function AboutPage() {

    return (
        <>
            <PageNav current="/about" />

            <main className="px-4 sm:px-6 pt-20 sm:pt-24">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-4 items-start">
                    {/* ── Left column ──────────────────────────────────── */}
                    <div className="flex flex-col gap-4 min-w-0">
                        <IdCard />

                        {/* Expertise */}
                        <ScrollCard delay={0.1} depth={0.7} className="p-6 sm:p-7">
                            <h2 className={cardTitle}>Expertise</h2>
                            <motion.div
                                initial="hidden"
                                whileInView="show"
                                viewport={{ once: true, amount: 0.3 }}
                                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
                                className="mt-5 space-y-5"
                            >
                                {expertise.map(({ title, Icon, categories }) => {
                                    const items = skills.filter((s) => categories.includes(s.category));
                                    if (!items.length) return null;
                                    return (
                                        <motion.div key={title} variants={row} className="flex gap-3.5">
                                            <Icon
                                                className="w-4.5 h-4.5 text-zinc-400 dark:text-zinc-500 mt-0.5 shrink-0"
                                                strokeWidth={1.75}
                                            />
                                            <div className="min-w-0">
                                                <h3 className="text-zinc-900 dark:text-zinc-100 font-medium text-sm">{title}</h3>
                                                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                                                    {items.map((s) => s.name).join(", ")}
                                                </p>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </motion.div>
                        </ScrollCard>

                        {/* Connect — overflow stays visible so a dragged photo can
                            leave the card instead of being clipped at its edge */}
                        <ScrollCard delay={0.15} depth={0.7} className="p-6 sm:p-7 relative">
                            <h2 className={cardTitle}>Connect</h2>

                            <div className="mt-5 flex items-center gap-6">
                                <ul className="space-y-4 min-w-0">
                                    {socialLinks.map((link) => (
                                        <li key={link.name}>
                                            <a
                                                href={link.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="group flex items-center gap-3"
                                            >
                                                <span className="text-zinc-400 dark:text-zinc-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors shrink-0">
                                                    <SocialIcon name={link.icon} />
                                                </span>
                                                <span className="min-w-0">
                                                    <span className="block text-sm font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                                        {link.name}
                                                    </span>
                                                    <span className="block font-mono text-xs text-zinc-400 dark:text-zinc-500 truncate">
                                                        {handleOf(link.url)}
                                                    </span>
                                                </span>
                                            </a>
                                        </li>
                                    ))}
                                    <li>
                                        <a
                                            href={`mailto:${personalInfo.email}`}
                                            className="group flex items-center gap-3"
                                        >
                                            <Mail
                                                className="w-5 h-5 text-zinc-400 dark:text-zinc-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors shrink-0"
                                                strokeWidth={1.75}
                                            />
                                            <span className="min-w-0">
                                                <span className="block text-sm font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                                    Email
                                                </span>
                                                <span className="block font-mono text-xs text-zinc-400 dark:text-zinc-500 truncate">
                                                    {personalInfo.email}
                                                </span>
                                            </span>
                                        </a>
                                    </li>
                                </ul>

                                {/* Draggable photo deck */}
                                <div className="hidden sm:flex flex-col items-center gap-2 ml-auto">
                                    <PhotoDeck items={deck} />
                                    <span className="font-mono text-[10px] text-zinc-300 dark:text-zinc-600 tracking-wide">
                                        drag me
                                    </span>
                                </div>
                            </div>
                        </ScrollCard>
                    </div>

                    {/* ── Right column ─────────────────────────────────── */}
                    <div className="flex flex-col gap-4 min-w-0">
                        {/* About */}
                        <ScrollCard delay={0.05} depth={1.25} className="p-6 sm:p-7">
                            <h2 className={cardTitle}>About</h2>
                            <div className="mt-4 space-y-4 text-zinc-600 dark:text-zinc-300 leading-relaxed">
                                <p>
                                    A full stack developer from Yogyakarta. Laravel and Go underneath,
                                    React and TypeScript on top — and I care most about whether a
                                    system <Mark>fails in a way someone can debug</Mark>.
                                </p>
                                <p>
                                    What I optimize for is{" "}
                                    <Mark>the next person who opens the file</Mark>. Off the clock:
                                    kopi tubruk, loud keyboards, aimless evening rides.
                                </p>
                            </div>
                        </ScrollCard>

                        {/* Experience */}
                        <ScrollCard delay={0.1} depth={1.25} className="p-6 sm:p-7">
                            <div className="flex items-center justify-between gap-4">
                                <h2 className={cardTitle}>Experience</h2>
                                <a
                                    href={personalInfo.resumeUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-mono text-xs text-zinc-400 dark:text-zinc-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                                >
                                    resume ↗
                                </a>
                            </div>

                            <motion.div
                                initial="hidden"
                                whileInView="show"
                                viewport={{ once: true, amount: 0.2 }}
                                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
                                className="mt-6"
                            >
                                {experiences.map((experience, index) => (
                                    <motion.div key={experience.id} variants={row}>
                                        <ExperienceItem
                                            experience={experience}
                                            last={index === experiences.length - 1}
                                        />
                                    </motion.div>
                                ))}
                            </motion.div>
                        </ScrollCard>

                        <GlobeCard />
                    </div>
                </div>
            </main>

            <PageFooter />
        </>
    );
}

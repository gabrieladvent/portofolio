import { useState } from "react";
import { motion, useReducedMotion, type PanInfo } from "motion/react";

export interface DeckItem {
    id: string;
    caption: string;
    meta: string;
    /** Drop a real photo here (e.g. "/photos/jogja.jpg"); falls back to the tint. */
    src?: string;
    tint: string;
    emoji: string;
}

// Where each card sits relative to the front of the deck.
const layout = [
    { rotate: -2, y: 0, x: 0, scale: 1 },
    { rotate: 5, y: 7, x: 6, scale: 0.96 },
    { rotate: -8, y: 13, x: -4, scale: 0.92 },
];

const SWIPE_THRESHOLD = 70;

/**
 * A stack of photos you can throw off the top — the one you drop goes to the
 * back and the next one surfaces. Tap or Enter cycles it too, so the interaction
 * isn't locked behind a pointer drag.
 */
export default function PhotoDeck({ items }: { items: DeckItem[] }) {
    const [front, setFront] = useState(0);
    const reduceMotion = useReducedMotion();

    const cycle = () => setFront((current) => (current + 1) % items.length);

    const handleDragEnd = (_: unknown, info: PanInfo) => {
        if (Math.abs(info.offset.x) > SWIPE_THRESHOLD || Math.abs(info.offset.y) > SWIPE_THRESHOLD) {
            cycle();
        }
    };

    return (
        <motion.div
            // A slow idle bob, so the deck reads as grabbable before you touch it.
            animate={reduceMotion ? undefined : { y: [0, -5, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="relative w-40 h-52 sm:w-44 sm:h-56 mb-5 shrink-0 select-none"
        >
            {items.map((item, index) => {
                const position = (index - front + items.length) % items.length;
                const place = layout[Math.min(position, layout.length - 1)];
                const isFront = position === 0;

                return (
                    <motion.div
                        key={item.id}
                        animate={reduceMotion ? { opacity: 1 } : place}
                        transition={{ type: "spring", stiffness: 260, damping: 26 }}
                        style={{ zIndex: items.length - position }}
                        drag={isFront && !reduceMotion}
                        dragSnapToOrigin
                        dragElastic={0.5}
                        whileDrag={{ scale: 1.04, cursor: "grabbing" }}
                        onDragEnd={handleDragEnd}
                        onTap={isFront ? cycle : undefined}
                        onKeyDown={
                            isFront
                                ? (event: React.KeyboardEvent) => {
                                    if (event.key === "Enter" || event.key === " ") {
                                        event.preventDefault();
                                        cycle();
                                    }
                                }
                                : undefined
                        }
                        role={isFront ? "button" : undefined}
                        tabIndex={isFront ? 0 : -1}
                        aria-label={isFront ? `${item.caption} — next photo` : undefined}
                        className={`absolute inset-0 rounded-xl bg-white dark:bg-zinc-800 border border-black/[0.07] dark:border-white/10 p-2 pb-6 shadow-md ${isFront ? "cursor-grab active:cursor-grabbing" : "pointer-events-none"
                            }`}
                    >
                        <div
                            className={`w-full h-full rounded-lg overflow-hidden flex items-center justify-center ${item.src ? "" : item.tint
                                }`}
                        >
                            {item.src ? (
                                <img
                                    src={item.src}
                                    alt={item.caption}
                                    draggable={false}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-3xl" aria-hidden="true">
                                    {item.emoji}
                                </span>
                            )}
                        </div>

                        <div className="absolute bottom-1.5 left-3 right-3 flex items-baseline justify-between gap-2">
                            <span className="text-[11px] text-zinc-700 dark:text-zinc-300 truncate">{item.caption}</span>
                            <span className="font-mono text-[9px] text-zinc-400 dark:text-zinc-500 shrink-0">{item.meta}</span>
                        </div>
                    </motion.div>
                );
            })}
        </motion.div>
    );
}

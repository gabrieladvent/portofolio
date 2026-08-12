import type { MotionValue } from "motion/react";

/** What every panel on the laptop screen is handed. */
export interface ActProps {
    /** The stage's scroll position, 0–1. Absent in the still layout. */
    progress?: MotionValue<number>;
    /** The slice of that scroll this panel owns. */
    from: number;
    to: number;
    /** Render the finished state outright, with no scroll-driven motion. */
    still?: boolean;
}

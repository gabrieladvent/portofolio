import { useEffect, useState } from "react";
import { personalInfo } from "../data/portfolio";
import EditorStage from "../components/home/EditorStage";
import HeroStage from "../components/home/HeroStage";
import PageFooter from "../components/PageFooter";

/** The one sentence that is different every time you come back. */
const CLOSERS = [
    "Today that means a queue worker and a Grafana panel nobody looks at until it turns red.",
    "Ask me about the migration that had to be safe to run twice.",
    "Currently: payments, dashboards, and the wiring in between.",
    "Mostly PHP by day, Go when the latency starts to matter.",
    "Three years in, and I still read the logs before the code.",
];

const CLOSER_KEY = "home:closing-line";

/**
 * A line at random — but never the one this browser saw last. Plain randomness
 * repeats itself a fifth of the time, and a repeat is exactly the "it always
 * says the same thing" this is meant to fix.
 */
function pickCloser() {
    let last = -1;
    try {
        last = Number(localStorage.getItem(CLOSER_KEY) ?? -1);
    } catch {
        // Private mode, or storage denied: fall back to plain random.
    }
    const pool = CLOSERS.map((_, index) => index).filter((index) => index !== last);
    return pool[Math.floor(Math.random() * pool.length)];
}

export default function HomePage() {
    // Chosen once per mount, not per render — a line that reshuffled on every
    // re-render would be noise, not a greeting.
    const [closer] = useState(pickCloser);

    useEffect(() => {
        document.title = `${personalInfo.name} — ${personalInfo.title}`;
    }, []);

    // Remembered after the fact rather than inside the picker: in development
    // React runs the initialiser twice, and writing there would rule out the
    // line actually on screen.
    useEffect(() => {
        try {
            localStorage.setItem(CLOSER_KEY, String(closer));
        } catch {
            // Nothing to remember by; the next visit just picks freely.
        }
    }, [closer]);

    return (
        <>
            <main id="main">
                <HeroStage closer={CLOSERS[closer]} />
                <EditorStage />
            </main>

            <PageFooter />
        </>
    );
}

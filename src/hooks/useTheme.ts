import { useCallback, useSyncExternalStore } from "react";

export type Theme = "light" | "dark";

const STORAGE_KEY = "theme";

function preferredTheme(): Theme {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/**
 * The theme lives in one module-level store rather than in component state.
 *
 * With useState, every component calling the hook got its *own* copy: the nav's
 * toggle flipped the nav's copy, and anything else reading the theme — the globe,
 * which has to pass colours to three.js because CSS can't reach WebGL materials —
 * never re-rendered. One store with subscribers means every reader updates.
 */
let current: Theme = preferredTheme();
const listeners = new Set<() => void>();

function apply(theme: Theme) {
    document.documentElement.classList.toggle("dark", theme === "dark");
}

// Applied at import, before React's first render, so the page never paints in
// the wrong theme on its way to the right one.
apply(current);

function subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
}

function setTheme(next: Theme) {
    if (next === current) return;
    current = next;
    apply(next);
    window.localStorage.setItem(STORAGE_KEY, next);
    for (const listener of listeners) listener();
}

/** Light/dark switch shared by every component on the standalone pages. */
export function useTheme() {
    const theme = useSyncExternalStore(
        subscribe,
        () => current,
        () => "light" as Theme,
    );

    const toggle = useCallback(() => {
        setTheme(current === "dark" ? "light" : "dark");
    }, []);

    return { theme, toggle };
}

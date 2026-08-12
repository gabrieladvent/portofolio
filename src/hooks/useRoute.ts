import { useEffect, useSyncExternalStore } from "react";

function normalise(pathname: string) {
    const path = pathname.replace(/\/+$/, "");
    return path === "" ? "/" : path;
}

/**
 * Paths this app actually renders. Anything else — the CV, any file dropped in
 * public/ — is left to the browser, so intercepting a click can never swallow a
 * real download.
 */
function isAppRoute(pathname: string) {
    const path = normalise(pathname);
    return path === "/" || path === "/about" || path === "/work" || path.startsWith("/work/");
}

let current = normalise(window.location.pathname);
const listeners = new Set<() => void>();

function sync() {
    const next = normalise(window.location.pathname);
    if (next === current) return;
    current = next;
    for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
}

/**
 * The current path, kept in step with the address bar.
 *
 * Links stay real `<a href>` elements — middle-click, "open in new tab" and
 * crawlers all still work — and a plain left-click is upgraded to a history
 * push. Without that, moving between pages tears the document down, and no
 * animation can survive the gap.
 */
export function useRoute() {
    const route = useSyncExternalStore(subscribe, () => current, () => "/");

    useEffect(() => {
        // Every route change lands at the top of its page, so let go of the
        // browser's own restoration rather than fight it mid-transition.
        const previous = window.history.scrollRestoration;
        window.history.scrollRestoration = "manual";

        const onClick = (event: MouseEvent) => {
            // Anything that means "not a plain navigation" is left alone:
            // modifier keys open tabs, a non-left button opens menus.
            if (event.defaultPrevented || event.button !== 0) return;
            if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

            const target = event.target;
            const anchor = target instanceof Element ? target.closest("a") : null;
            if (!anchor || (anchor.target && anchor.target !== "_self")) return;
            if (anchor.hasAttribute("download")) return;

            const href = anchor.getAttribute("href");
            if (!href) return;

            const url = new URL(href, window.location.href);
            if (url.origin !== window.location.origin) return;
            // Hash links are the browser's job — both the homepage's in-page
            // anchors and the footer's link into them.
            if (url.hash) return;
            if (normalise(url.pathname) === current || !isAppRoute(url.pathname)) return;

            event.preventDefault();
            window.history.pushState(null, "", url);
            sync();
        };

        window.addEventListener("popstate", sync);
        document.addEventListener("click", onClick);
        return () => {
            window.history.scrollRestoration = previous;
            window.removeEventListener("popstate", sync);
            document.removeEventListener("click", onClick);
        };
    }, []);

    return route;
}

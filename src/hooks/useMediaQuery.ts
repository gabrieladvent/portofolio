import { useEffect, useState } from "react";

/** Live answer to a media query — re-renders when the match changes. */
export function useMediaQuery(query: string) {
    const [matches, setMatches] = useState(() => window.matchMedia(query).matches);

    useEffect(() => {
        const list = window.matchMedia(query);
        const update = () => setMatches(list.matches);
        // Re-read on subscribe: the query may have flipped between the initial
        // state and this effect running.
        update();
        list.addEventListener("change", update);
        return () => list.removeEventListener("change", update);
    }, [query]);

    return matches;
}

import { useSyncExternalStore } from "react";

export type VisitorCount = {
  /** Which visitor this is. Assigned once, then kept for a month. */
  number: number | null;
  /** Everyone counted so far. Equals `number` on a first visit. */
  total: number | null;
  returning: boolean;
};

export type VisitorSnapshot = {
  visitor: VisitorCount | null;
  /** The request finished. A failed count settles too — it just has nothing. */
  settled: boolean;
};

/**
 * The count lives in one module-level store rather than in component state,
 * the same arrangement useTheme needs and for the same reason: it has more
 * than one reader.
 *
 * With useState per caller, the preloader and the footer would each mount
 * their own copy and each fire their own request — two round trips for one
 * number, and the second one racing a cookie the first hasn't been given yet.
 * One store means the request happens once and every reader sees the result.
 */
const PENDING: VisitorSnapshot = { visitor: null, settled: false };

let snapshot: VisitorSnapshot = PENDING;
let started = false;
const listeners = new Set<() => void>();

function publish(next: VisitorSnapshot) {
  snapshot = next;
  for (const listener of listeners) listener();
}

async function load() {
  try {
    const response = await fetch("/api/visit", {
      // Without this the browser can answer from its own cache and the number
      // freezes at whatever the first load returned.
      cache: "no-store",
    });

    if (!response.ok) throw new Error("Visitor count unavailable");

    publish({ visitor: (await response.json()) as VisitorCount, settled: true });
  } catch {
    // The number is decoration. Settling empty lets every reader move on.
    publish({ visitor: null, settled: true });
  }
}

function subscribe(listener: () => void) {
  // The first reader to mount starts the one request they all share. Guarding
  // on a flag rather than on listener count also keeps StrictMode's double
  // subscribe in development from counting the visitor twice.
  if (!started) {
    started = true;
    load();
  }

  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** The visitor's number and the running total, shared by every caller. */
export function useVisitorCount() {
  return useSyncExternalStore(
    subscribe,
    () => snapshot,
    () => PENDING,
  );
}

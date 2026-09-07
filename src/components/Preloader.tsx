import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, animate, motion, useReducedMotion } from 'motion/react';
import { useLenis } from 'lenis/react';
import { useVisitorCount } from '../hooks/useVisitorCount';

/**
 * Shown once per tab, not once per load. A reload is usually someone coming
 * back to a page they were already reading, and making them sit through the
 * intro again turns a nice touch into a toll booth.
 */
const SESSION_KEY = 'preloader-shown';

/** Long enough to read as deliberate rather than as a flash of something broken. */
const MIN_VISIBLE_MS = 900;
/** Past this we stop waiting on the counter and let the site through regardless. */
const MAX_WAIT_MS = 1800;
const COUNT_UP_MS = 900;
const HOLD_MS = 550;

/**
 * The overlay covers the entire site, and when there is a number to show its
 * only exit is the odometer finishing. That animation runs on rAF, which the
 * browser suspends in a background tab — so a visitor who opens the site in a
 * tab they don't look at yet can come back to a page still behind the intro.
 *
 * This is the floor under that: past it the overlay lifts no matter what the
 * animation is doing.
 */
const HARD_LIMIT_MS = MAX_WAIT_MS + COUNT_UP_MS + HOLD_MS + 600;

/** Never fewer than four digits — a lone "7" doesn't carry the layout. */
const MIN_DIGITS = 4;

function ordinal(value: number) {
  const lastTwo = value % 100;
  if (lastTwo >= 11 && lastTwo <= 13) return `${value}th`;

  switch (value % 10) {
    case 1:
      return `${value}st`;
    case 2:
      return `${value}nd`;
    case 3:
      return `${value}rd`;
    default:
      return `${value}th`;
  }
}

function seenThisSession() {
  try {
    return window.sessionStorage.getItem(SESSION_KEY) === '1';
  } catch {
    // Private mode, or storage blocked outright. Showing it is the safe miss.
    return false;
  }
}

function markSeen() {
  try {
    window.sessionStorage.setItem(SESSION_KEY, '1');
  } catch {
    // Nothing to do — worst case the intro plays again next reload.
  }
}

/**
 * The odometer. Leading zeros are padding rather than data, so they sit back at
 * a lower contrast and the digits that mean something read as the number.
 */
function Counter({ value, onDone }: { value: number; onDone: () => void }) {
  const reduceMotion = useReducedMotion();
  const [shown, setShown] = useState(reduceMotion ? value : 0);

  useEffect(() => {
    if (reduceMotion) {
      const timer = setTimeout(onDone, HOLD_MS);
      return () => clearTimeout(timer);
    }

    let hold: ReturnType<typeof setTimeout>;

    const controls = animate(0, value, {
      duration: COUNT_UP_MS / 1000,
      // Sprints through the middle and settles on the last few, so the final
      // number lands instead of arriving.
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (current) => setShown(Math.round(current)),
      onComplete: () => {
        setShown(value);
        hold = setTimeout(onDone, HOLD_MS);
      },
    });

    return () => {
      controls.stop();
      clearTimeout(hold);
    };
  }, [value, reduceMotion, onDone]);

  const width = Math.max(MIN_DIGITS, String(value).length);
  const padded = String(shown).padStart(width, '0');
  const firstSignificant = padded.search(/[1-9]/);
  const split = firstSignificant === -1 ? padded.length - 1 : firstSignificant;

  return (
    <div className="text-6xl sm:text-8xl font-medium tracking-tight tabular-nums leading-none">
      <span className="text-zinc-300 dark:text-zinc-800">{padded.slice(0, split)}</span>
      <span className="text-zinc-900 dark:text-zinc-100">{padded.slice(split)}</span>
    </div>
  );
}

function Overlay({
  value,
  total,
  returning,
  onSettled,
}: {
  value: number | null;
  total: number | null;
  returning: boolean;
  onSettled: () => void;
}) {
  const reduceMotion = useReducedMotion();

  // Only worth saying to someone who has been here before: their own number is
  // old news, so the interesting figure is how many arrived after them.
  const since =
    returning && value !== null && total !== null ? Math.max(0, total - value) : 0;

  return (
    <motion.div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center gap-6 bg-[#f6f6f4] dark:bg-[#0a0c0b] px-6"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduceMotion ? 0.2 : 0.55, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      <span className="text-[10px] uppercase tracking-[0.32em] text-zinc-400 dark:text-zinc-600">
        Visitor
      </span>

      {value === null ? (
        // Counter unavailable. Hold the same shape so the overlay doesn't
        // collapse on its way out, but say nothing we can't back up.
        <div className="h-16 sm:h-20 flex items-center">
          <motion.span
            className="h-1.5 w-1.5 rounded-full bg-emerald-500"
            animate={reduceMotion ? undefined : { opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      ) : (
        <Counter value={value} onDone={onSettled} />
      )}

      <div className="w-40 sm:w-56 h-px bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
        <motion.div
          className="h-full bg-emerald-500"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          style={{ transformOrigin: 'left' }}
          transition={{ duration: reduceMotion ? 0.2 : (COUNT_UP_MS + HOLD_MS) / 1000 }}
        />
      </div>

      <motion.div
        className="flex flex-col items-center gap-1.5 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.4,
          // The sentence names the number outright, so holding it back until
          // the odometer has nearly landed keeps it from spoiling the count.
          delay: value === null || reduceMotion ? 0 : (COUNT_UP_MS * 0.75) / 1000,
        }}
      >
        <p className="text-xs text-zinc-500 dark:text-zinc-500">
          {value === null
            ? 'Getting things ready'
            : `You're the ${ordinal(value)} person to open this.`}
        </p>

        {since > 0 && (
          <p className="text-[11px] text-zinc-400 dark:text-zinc-600">
            {since.toLocaleString()} have arrived since.
          </p>
        )}
      </motion.div>
    </motion.div>
  );
}

/**
 * The intro overlay: it holds the page for a beat and tells the visitor which
 * number they are.
 *
 * It is on a leash throughout. The count is fetched in parallel with the app
 * mounting, never before it, and MAX_WAIT_MS means a slow or dead counter costs
 * the visitor a fixed moment rather than the whole page.
 */
export default function Preloader() {
  // Fixed for the life of the mount: whether this tab has already had its
  // intro. Everything else about the overlay is derived from it.
  const [active] = useState(() => !seenThisSession());
  const [dismissed, setDismissed] = useState(false);
  const [minElapsed, setMinElapsed] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const [expired, setExpired] = useState(false);

  // Shared with the footer, which shows the same numbers further down the page,
  // so this reads a request that happens once per load either way.
  const { visitor, settled } = useVisitorCount();
  const lenis = useLenis();

  // Counter restarts its animation whenever this identity changes, and it is
  // running while the rest of the app mounts around it.
  const dismiss = useCallback(() => setDismissed(true), []);

  // Done waiting: either the counter answered or it ran out of time, and the
  // overlay has been up long enough not to flicker.
  const ready = minElapsed && (settled || timedOut);
  const value = ready ? (visitor?.number ?? null) : null;
  // A missing number leaves nothing worth pausing for, so the overlay lifts as
  // soon as we know that — no waiting on a reveal that will never come.
  const gone = !active || dismissed || expired || (ready && value === null);

  useEffect(() => {
    if (!active) return;

    markSeen();

    const minTimer = setTimeout(() => setMinElapsed(true), MIN_VISIBLE_MS);
    const waitTimer = setTimeout(() => setTimedOut(true), MAX_WAIT_MS);
    // setTimeout keeps running in a background tab; rAF does not. That is the
    // whole reason this one is the backstop rather than another animation.
    const limitTimer = setTimeout(() => setExpired(true), HARD_LIMIT_MS);

    return () => {
      clearTimeout(minTimer);
      clearTimeout(waitTimer);
      clearTimeout(limitTimer);
    };
  }, [active]);

  // Scrolling behind a full-screen overlay only means the visitor arrives
  // somewhere in the middle of the page once it lifts.
  useEffect(() => {
    if (gone) return;

    const root = document.documentElement;
    const previous = root.style.overflow;

    root.style.overflow = 'hidden';
    lenis?.stop();

    return () => {
      root.style.overflow = previous;
      lenis?.start();
    };
  }, [gone, lenis]);

  return (
    <AnimatePresence>
      {!gone && (
        <Overlay
          key="preloader"
          value={value}
          total={visitor?.total ?? null}
          returning={visitor?.returning ?? false}
          onSettled={dismiss}
        />
      )}
    </AnimatePresence>
  );
}

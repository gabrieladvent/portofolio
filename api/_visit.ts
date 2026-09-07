/**
 * Visitor counter, without a database of our own.
 *
 * Abacus (abacus.jasoncameron.dev) stores one integer per namespace/key and
 * returns its new value on every hit. Everything that makes that usable as a
 * visitor counter lives here: the once-per-visitor rule, bot filtering, and
 * keeping the namespace off the client.
 *
 * The browser only ever talks to our own /api/visit, which is what lets the
 * CSP stay `connect-src 'self'` — and stops anyone reading the page source and
 * inflating the count by hitting Abacus directly.
 *
 * Shared by api/visit.ts (production) and the dev proxy in vite.config.ts,
 * the same arrangement _chat.ts has with the chat endpoint.
 */

const ABACUS = "https://abacus.jasoncameron.dev";

// Abacus namespaces are public and unauthenticated, so this is a random string
// rather than the site's name: the count is only as safe as the pair staying
// unguessable. VISITOR_COUNTER_NAMESPACE overrides it — change it and the count
// restarts from zero, which is also how you reset a count that got spammed.
const DEFAULT_NAMESPACE = "pf-hhPofyF9X1wD";
const COUNTER_KEY = "visits";

/**
 * `vite dev` talks to the same public service as production, so local work gets
 * its own namespace — otherwise every cleared cookie during development would
 * add a person to the real site's count.
 */
export const DEV_NAMESPACE = `${DEFAULT_NAMESPACE}-dev`;

/**
 * Carries the visitor's own number between visits. A month, then they count as
 * someone new — long enough that refreshing or coming back next week keeps the
 * number they were given, short enough that the count keeps moving.
 */
const COOKIE_NAME = "pv";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

// Upstream is a free service on someone else's box. The number is decoration —
// it is never worth making the visitor wait on it.
const UPSTREAM_TIMEOUT_MS = 2500;

// Crawlers would make the count meaningless, and there are more of them than
// there are people. Anything self-identifying as automated is served the total
// without being counted into it.
const BOT_AGENT =
  /bot|crawl|spider|slurp|facebookexternalhit|embedly|quora link preview|whatsapp|telegram|discord|preview|headlesschrome|lighthouse|pagespeed|gtmetrix|pingdom|uptime|curl|wget|python-requests|axios|node-fetch|go-http-client|java\/|okhttp/i;

export type VisitBody = {
  /** Which visitor this one is. Fixed for a month once assigned. */
  number: number | null;
  /** Everyone counted so far. Equals `number` on a first visit. */
  total: number | null;
  /** True when the number came from the cookie rather than a fresh hit. */
  returning: boolean;
};

export type VisitResult = {
  status: number;
  body: VisitBody | { error: string };
  /** Set-Cookie value, present only when a number was newly assigned. */
  cookie?: string;
};

function readCookie(header: string | undefined, name: string) {
  if (!header) return null;

  for (const part of header.split(";")) {
    const eq = part.indexOf("=");
    if (eq === -1) continue;
    if (part.slice(0, eq).trim() === name) return part.slice(eq + 1).trim();
  }

  return null;
}

/**
 * A cookie is visitor-editable, so this decides what we are willing to render.
 * A forged value only misleads the person who forged it, but it still has to be
 * a plausible integer or the overlay ends up displaying nonsense.
 */
function parseAssignedNumber(raw: string | null) {
  if (!raw || !/^\d{1,12}$/.test(raw)) return null;

  const value = Number(raw);
  return value > 0 ? value : null;
}

async function callAbacus(path: string) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);

  try {
    const response = await fetch(`${ABACUS}${path}`, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });

    // /get answers 404 until the very first hit creates the key, which is a
    // real state on a freshly deployed site rather than a failure.
    if (response.status === 404) return 0;
    if (!response.ok) return null;

    const payload = (await response.json()) as { value?: unknown };
    return typeof payload.value === "number" ? payload.value : null;
  } catch {
    // Timed out, DNS, upstream down — all the same to the caller.
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export async function resolveVisit(
  cookieHeader: string | undefined,
  userAgent: string | undefined,
  namespaceOverride?: string,
): Promise<VisitResult> {
  const namespace = namespaceOverride || DEFAULT_NAMESPACE;
  const base = `/${encodeURIComponent(namespace)}/${COUNTER_KEY}`;
  const assigned = parseAssignedNumber(readCookie(cookieHeader, COOKIE_NAME));

  // Already counted, or not a person: read the total, never increment it.
  if (assigned !== null || BOT_AGENT.test(userAgent ?? "")) {
    const total = await callAbacus(`/get${base}`);

    return {
      status: 200,
      body: { number: assigned, total, returning: assigned !== null },
    };
  }

  const value = await callAbacus(`/hit${base}`);

  if (value === null) {
    return { status: 503, body: { error: "Visitor counter unavailable" } };
  }

  return {
    status: 200,
    body: { number: value, total: value, returning: false },
    // Lax, not Strict: arriving from a link elsewhere is the normal way in, and
    // Strict would hand that visitor a second number every time.
    cookie: `${COOKIE_NAME}=${value}; Max-Age=${COOKIE_MAX_AGE}; Path=/; SameSite=Lax; HttpOnly; Secure`,
  };
}

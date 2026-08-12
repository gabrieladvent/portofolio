/**
 * Project dates are hand-typed as "YYYY-MM", and a missing leading zero is the
 * obvious slip. It used to be a silent one: "2026-7" failed the strict pattern,
 * so the card printed "—" instead of a stamp, and string comparison sorted it
 * above every properly-padded date in the same month. Parsing once, leniently,
 * keeps a typo from moving a project or blanking its date.
 */
function parse(date?: string) {
    const match = /^(\d{4})-(\d{1,2})$/.exec(date?.trim() ?? "");
    if (!match) return null;
    const month = Number(match[2]);
    if (month < 1 || month > 12) return null;
    return { year: match[1], month: String(month).padStart(2, "0") };
}

/** Comparable "YYYY-MM", or "" for a missing or unparseable date. */
export function sortKey(date?: string) {
    const parts = parse(date);
    return parts ? `${parts.year}-${parts.month}` : "";
}

/** Newest first. Undated projects sort last rather than being dropped. */
export function byNewest(a: { date?: string }, b: { date?: string }) {
    return sortKey(b.date).localeCompare(sortKey(a.date));
}

/** "2026" — drives the Year filter. */
export function yearOf(date?: string) {
    return parse(date)?.year ?? "";
}

/** "2026-07" → "07/26". The folder card has room for the stamp, not the date. */
export function shortStamp(date?: string) {
    const parts = parse(date);
    return parts ? `${parts.month}/${parts.year.slice(2)}` : "—";
}

/** "2026-07" → "07.2026". The case study masthead has room for the full date. */
export function longStamp(date?: string) {
    const parts = parse(date);
    return parts ? `${parts.month}.${parts.year}` : "";
}

/**
 * What the globe card shows when three.js cannot run.
 *
 * WebGL is missing more often than it looks from a developer's machine: older
 * phones, hardened or privacy-focused browsers, locked-down corporate builds,
 * and any device where the GPU process has crashed once already. Before this,
 * those visitors got an empty card with two zoom buttons that did nothing and a
 * caption inviting them to drag something that was not there.
 *
 * The drawing is a graticule rather than a map. A real coastline would have to
 * be fetched and projected — which is the work the globe was already doing —
 * and the point of this card is the pin, not the geography.
 */
export default function GlobeFallback() {
    return (
        <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center">
            <svg viewBox="0 0 200 200" className="h-[74%] w-auto max-w-full opacity-70">
                <circle
                    cx="100"
                    cy="100"
                    r="76"
                    fill="none"
                    strokeWidth="1"
                    className="stroke-zinc-300 dark:stroke-zinc-700"
                />

                {/* Latitudes: ellipses flattened by their distance from the
                    equator, which is what a sphere's parallels look like from
                    the side. */}
                {[-52, -26, 0, 26, 52].map((offset) => (
                    <ellipse
                        key={`lat-${offset}`}
                        cx="100"
                        cy={100 + offset}
                        rx={Math.sqrt(Math.max(76 * 76 - offset * offset, 0))}
                        ry={Math.abs(offset) < 1 ? 5 : 4}
                        fill="none"
                        strokeWidth="0.75"
                        className="stroke-zinc-200 dark:stroke-zinc-800"
                    />
                ))}

                {/* Meridians: the same circle squeezed horizontally, so they all
                    meet at the poles the way they should. */}
                {[76, 50, 24].map((rx) => (
                    <ellipse
                        key={`lon-${rx}`}
                        cx="100"
                        cy="100"
                        rx={rx}
                        ry="76"
                        fill="none"
                        strokeWidth="0.75"
                        className="stroke-zinc-200 dark:stroke-zinc-800"
                    />
                ))}

                {/* Yogyakarta. Placed by eye rather than by projection — there
                    is no map underneath for it to be accurate against. */}
                <circle cx="126" cy="118" r="4.5" className="fill-emerald-500" />
                <circle
                    cx="126"
                    cy="118"
                    r="9"
                    fill="none"
                    strokeWidth="1"
                    className="stroke-emerald-500/45"
                />
            </svg>
        </div>
    );
}

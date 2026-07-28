/**
 * Shown when a live-data section can't load, so the section degrades into
 * something intentional instead of an empty gap under its heading.
 */
export default function DataUnavailable({
    label,
    href,
    linkLabel,
}: {
    label: string;
    href?: string;
    linkLabel?: string;
}) {
    return (
        <div className="rounded-2xl border border-dashed border-black/[0.12] bg-white/50 px-6 py-10 text-center">
            <div className="font-mono text-[10px] uppercase tracking-widest text-zinc-400">
                Offline
            </div>
            <p className="text-zinc-500 text-sm mt-2 max-w-sm mx-auto">{label}</p>
            {href && linkLabel && (
                <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 mt-4 text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
                >
                    {linkLabel}
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                    </svg>
                </a>
            )}
        </div>
    );
}

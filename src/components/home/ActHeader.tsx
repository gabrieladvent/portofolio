/** The line every panel on the laptop screen opens with. */
export default function ActHeader({
    eyebrow,
    value,
    caption,
}: {
    eyebrow: string;
    value: string;
    caption?: string;
}) {
    return (
        <div className="flex items-baseline justify-between gap-4">
            <div className="min-w-0">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">
                    {eyebrow}
                </p>
                <p className="mt-1.5 text-2xl font-bold leading-none text-zinc-900 tabular-nums sm:text-3xl dark:text-zinc-100">
                    {value}
                </p>
            </div>
            {caption && (
                <p className="shrink-0 font-mono text-[10px] text-zinc-400 dark:text-zinc-500">
                    {caption}
                </p>
            )}
        </div>
    );
}

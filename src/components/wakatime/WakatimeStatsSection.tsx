import { motion } from "motion/react";
import SectionHeader from "../ui/SectionHeader";
import WakatimeStats from "./WakatimeStats";

export default function WakatimeStatsSection() {
    return (
        <section id="stats" className="py-28 px-6 relative">
            <div className="max-w-5xl mx-auto relative">
                <SectionHeader
                    index="05"
                    eyebrow="WakaTime"
                    title="Coding Activity"
                    description="Real coding activity statistics from my editor, including programming languages, daily averages, and total time."
                />

                <motion.div
                    initial={{ opacity: 0, y: 32 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.1 }}
                    transition={{ duration: 0.7, delay: 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
                    className="mt-14"
                >
                    <WakatimeStats />
                </motion.div>
            </div>
        </section>
    );
}

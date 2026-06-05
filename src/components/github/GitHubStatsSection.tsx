import { motion } from "motion/react";
import SectionHeader from "../ui/SectionHeader";
import GitHubContributions from "./GitHubContributions";

export default function GitHubStatsSection() {
  return (
    <section id="github" className="py-28 px-6 relative">
      <div className="max-w-5xl mx-auto relative">
        <SectionHeader
          index="04"
          eyebrow="GitHub"
          title="Contributions & Activity"
          description="A record of my GitHub commits, pull requests, and contributions throughout the year."
        />

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="mt-14"
        >
          <GitHubContributions />
        </motion.div>
      </div>
    </section>
  );
}

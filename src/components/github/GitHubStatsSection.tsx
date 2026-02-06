import { useInView } from "../../utils/helpers";
import GitHubContributions from "./GitHubContributions";

export default function GitHubStatsSection() {
  const { ref, isInView } = useInView();

  return (
    <section id="github" className="py-32 px-6 relative" ref={ref}>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/5 to-transparent" />
      <div className="max-w-7xl mx-auto relative">
        <div className="text-center mb-10">
          <span className={`text-emerald-400 font-semibold text-sm uppercase tracking-wider transition-all duration-700 ${isInView ? 'opacity-100' : 'opacity-0'}`}>
            GitHub
          </span>
          <h2 className={`text-4xl sm:text-5xl font-bold text-white mt-4 transition-all duration-700 delay-100 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            Contributions & Activity
          </h2>
        </div>

        <div className={`transition-all duration-1000 delay-300 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
          <GitHubContributions />
        </div>
      </div>
    </section>
  );
}
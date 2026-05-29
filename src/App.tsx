import Footer from './components/Footer';
import ContactSection from './components/ContactSection';
import WakatimeStatsSection from './components/wakatime/WakatimeStatsSection';
import GitHubStatsSection from './components/github/GitHubStatsSection';
import ProjectsSection from './components/ProjectsSection';
import SkillsSection from './components/SkillsSection';
import AboutSection from './components/AboutSection';
import HeroSection from './components/HeroSection';
import { AnimatedBackground } from './utils/helpers';
import Navigation from './components/Navigation';
import SmoothScroll from './components/SmoothScroll';

export default function App() {
  return (
    <SmoothScroll>
      <div className="relative min-h-screen bg-[#f6f6f4] text-zinc-900 overflow-x-hidden">
        <AnimatedBackground />
        <Navigation />
        <main>
          <HeroSection />
          <AboutSection />
          <SkillsSection />
          <ProjectsSection />
          <GitHubStatsSection />
          <WakatimeStatsSection />
          <ContactSection />
        </main>
        <Footer />
      </div>
    </SmoothScroll>
  );
}
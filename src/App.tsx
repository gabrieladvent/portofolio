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
import AboutPage from './pages/AboutPage';

function HomePage() {
  return (
    <>
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
    </>
  );
}

/**
 * Standalone pages navigate with real hrefs (full document loads), so the route
 * only has to be read once at mount — no history listener, no router dependency.
 */
function currentRoute() {
  const path = window.location.pathname.replace(/\/+$/, '');
  return path === '' ? '/' : path;
}

export default function App() {
  const route = currentRoute();

  return (
    <SmoothScroll>
      <div className="relative min-h-screen bg-[#f6f6f4] dark:bg-[#0a0c0b] text-zinc-900 dark:text-zinc-100 overflow-x-hidden transition-colors duration-500">
        <AnimatedBackground />
        {route === '/about' ? <AboutPage /> : <HomePage />}
      </div>
    </SmoothScroll>
  );
}

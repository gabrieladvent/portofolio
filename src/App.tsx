import { useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useLenis } from 'lenis/react';
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
import WorkPage from './pages/WorkPage';
import CaseStudyPage from './pages/CaseStudyPage';
import PageNav from './components/PageNav';
import { useRoute } from './hooks/useRoute';
import { personalInfo } from './data/portfolio';

function HomePage() {
  useEffect(() => {
    document.title = `${personalInfo.name} — ${personalInfo.title}`;
  }, []);

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

function pageFor(route: string) {
  if (route === '/about') return <AboutPage />;
  if (route === '/work') return <WorkPage />;
  // Anything deeper under /work is a project slug; CaseStudyPage renders its
  // own 404 when the slug matches nothing.
  if (route.startsWith('/work/')) {
    return <CaseStudyPage slug={decodeURIComponent(route.slice('/work/'.length))} />;
  }
  return <HomePage />;
}

/**
 * Everything that outlives a route change lives here: the background, the
 * floating nav, and the crossfade between pages.
 *
 * Keeping the nav above the swap is the whole point — it stays mounted, so its
 * active pill can travel from one tab to the other instead of being rebuilt in
 * its new place.
 */
function Shell() {
  const route = useRoute();
  const lenis = useLenis();
  const standalone = route !== '/';

  // Pages animate only their opacity. A transform here would make this a
  // containing block for `position: fixed`, and the homepage's own nav — fixed
  // to the viewport — would start scrolling with the page instead.
  return (
    <div className="relative min-h-screen bg-[#f6f6f4] dark:bg-[#0a0c0b] text-zinc-900 dark:text-zinc-100 overflow-x-clip transition-colors duration-500">
      <AnimatedBackground />

      {standalone && <PageNav current={route.startsWith('/work') ? '/work' : route} />}

      <AnimatePresence
        mode="wait"
        initial={false}
        // Fires once the outgoing page is gone, so the jump to the top of the
        // new one happens behind a blank frame rather than in plain sight.
        onExitComplete={() => {
          if (lenis) lenis.scrollTo(0, { immediate: true });
          else window.scrollTo(0, 0);
        }}
      >
        <motion.div
          key={route}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.21, 0.47, 0.32, 0.98] }}
        >
          {pageFor(route)}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <SmoothScroll>
      {/* `clip`, not `hidden`: overflow-x-hidden makes this a scroll container,
          and every `position: sticky` inside then pins to a box that never
          scrolls — which is to say, it never pins at all. `clip` trims the
          overflow without creating that container. */}
      <Shell />
    </SmoothScroll>
  );
}

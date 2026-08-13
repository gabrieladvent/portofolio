import { AnimatePresence, motion } from 'motion/react';
import { useLenis } from 'lenis/react';
import { AnimatedBackground } from './utils/helpers';
import SmoothScroll from './components/SmoothScroll';
import HomePage from './pages/HomePage';
import LegacyHomePage from './pages/LegacyHomePage';
import AboutPage from './pages/AboutPage';
import WorkPage from './pages/WorkPage';
import CaseStudyPage from './pages/CaseStudyPage';
import PageNav from './components/PageNav';
import AskWidget from './components/chat/AskWidget';
import { useRoute } from './hooks/useRoute';

function pageFor(route: string) {
  if (route === '/about') return <AboutPage />;
  if (route === '/work') return <WorkPage />;
  if (route === '/v3-old') return <LegacyHomePage />;
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
  // The archived homepage brings its own scroll-spy Navigation; two navs at once
  // would sit on top of each other.
  const floatingNav = route !== '/v3-old';

  // Pages animate only their opacity. A transform here would make this a
  // containing block for `position: fixed`, and the homepage's own nav — fixed
  // to the viewport — would start scrolling with the page instead.
  return (
    // pl-[var(--chat-pane)] is the split view: the drawer sets that variable to
    // its own width, so the page narrows beside it rather than being covered.
    // Sticky sections shift with it for free — their containing block moved.
    <div className="chat-shift relative min-h-screen bg-[#f6f6f4] dark:bg-[#0a0c0b] text-zinc-900 dark:text-zinc-100 overflow-x-clip pl-[var(--chat-pane)]">
      <AnimatedBackground />

      {floatingNav && <PageNav current={route.startsWith('/work') ? '/work' : route} />}

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

      {/* Outside the swap, like the nav: closing the panel by navigating would
          throw away a conversation the visitor is in the middle of. */}
      {floatingNav && <AskWidget />}
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

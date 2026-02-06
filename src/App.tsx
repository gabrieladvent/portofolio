import { useState, useEffect, useRef } from 'react';
import {
  personalInfo,
  socialLinks,
  skills,
  projects,
  experiences
} from './data/portfolio';
import { useGitHubStats, useWakatimeStats } from './hooks/useApi';
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


export default function App() {
  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">
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
  );
}
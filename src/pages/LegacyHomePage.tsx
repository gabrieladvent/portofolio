import { useEffect } from "react";
import Footer from "../components/Footer";
import ContactSection from "../components/ContactSection";
import WakatimeStatsSection from "../components/wakatime/WakatimeStatsSection";
import GitHubStatsSection from "../components/github/GitHubStatsSection";
import ProjectsSection from "../components/ProjectsSection";
import SkillsSection from "../components/SkillsSection";
import AboutSection from "../components/AboutSection";
import HeroSection from "../components/HeroSection";
import Navigation from "../components/Navigation";
import { personalInfo } from "../data/portfolio";

/**
 * The previous homepage, kept whole at /v3-old. It brings its own scroll-spy
 * Navigation, so the floating PageNav stays out of its way.
 */
export default function LegacyHomePage() {
    useEffect(() => {
        document.title = `${personalInfo.name} — v3`;
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

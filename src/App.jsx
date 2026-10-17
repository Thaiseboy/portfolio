import { MotionConfig } from "motion/react";
import AppHeader from "@/components/layout/AppHeader.jsx";
import AppFooter from "@/components/layout/AppFooter.jsx";
import ScrollProgress from "@/components/motion/ScrollProgress.jsx";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import HomePage from "@/views/HomePage.jsx";
import AboutPage from "@/views/AboutPage.jsx";
import SkillsPage from "@/views/SkillsPage.jsx";
import ProjectPage from "@/views/ProjectPage.jsx";
import ContactPage from "@/views/ContactPage.jsx";

export default function App() {
  useSmoothScroll();

  return (
    <MotionConfig reducedMotion="user">
      <div id="app" className="min-h-screen">
        <ScrollProgress />
        <AppHeader />
        <main>
          <section id="home">
            <HomePage />
          </section>
          <section id="about">
            <AboutPage />
          </section>
          <section id="skills">
            <SkillsPage />
          </section>
          <section id="project">
            <ProjectPage />
          </section>
          <section id="contact">
            <ContactPage />
          </section>
        </main>
        <AppFooter />
      </div>
    </MotionConfig>
  );
}

import AppHeader from "@/components/layout/AppHeader.jsx";
import AppFooter from "@/components/layout/AppFooter.jsx";
import AppNavigation from "@/components/layout/AppNavigation.jsx";
import HomePage from "@/views/HomePage.jsx";
import AboutPage from "@/views/AboutPage.jsx";
import SkillsPage from "@/views/SkillsPage.jsx";
import ProjectPage from "@/views/ProjectPage.jsx";
import ContactPage from "@/views/ContactPage.jsx";

export default function App() {
  return (
    <div id="app">
      <AppHeader />
      <AppNavigation />
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
  );
}

<template>
  <div id="app">
    <AppHeader />
    <AppNavigation />
    <main>
      <section id="home">
        <HomePage />
      </section>
      <section id="about">
        <LazySection>
          <AboutPage />
        </LazySection>
      </section>
      <section id="skills">
        <LazySection>
          <SkillsPage />
        </LazySection>
      </section>
      <section id="project">
        <LazySection>
          <ProjectPage />
        </LazySection>
      </section>
      <section id="contact">
        <LazySection>
          <ContactPage />
        </LazySection>
      </section>
    </main>
    <AppFooter />
  </div>
</template>

<script setup>
import { defineAsyncComponent } from 'vue'
import AppHeader from "@/components/layout/AppHeader.vue";
import AppFooter from "@/components/layout/AppFooter.vue";
import AppNavigation from "@/components/layout/AppNavigation.vue";
import HomePage from "@/views/HomePage.vue";

// Lazy load heavy components
const AboutPage = defineAsyncComponent(() => import("@/views/AboutPage.vue"));
const SkillsPage = defineAsyncComponent(() => import("@/views/SkillsPage.vue"));
const ProjectPage = defineAsyncComponent(() => import("@/views/ProjectPage.vue"));
const ContactPage = defineAsyncComponent(() => import("@/views/ContactPage.vue"));

// LazySection component to handle intersection observer
const LazySection = defineAsyncComponent(() => import("@/components/ui/LazySection.vue"));

defineOptions({
  name: "App"
});
</script>


<style>
html {
  scroll-behavior: smooth;
  overflow-x: hidden;
}

body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
}

#app {
  background-color: var(--color-background);
  background-attachment: fixed;
  min-height: 100vh;
  width: 100%;
  overflow-x: hidden;
}

section {
  padding: 50px 0;
  max-width: 100vw;
  overflow-x: hidden;
}

@media (max-width: 768px) {
  #app {
    background-attachment: scroll;
  }

  body {
    max-width: 100vw;
    overflow-x: hidden;
  }
}
</style>

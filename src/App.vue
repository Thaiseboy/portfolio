<template>
  <div id="app">
    <HeaderComponent />
    <NavigationComponent />
    <main>
      <section id="home">
        <HomePage />
      </section>
      <section id="about">
        <LazySection>
          <AboutMe />
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
    <FooterComponent />
  </div>
</template>

<script setup>
import { defineAsyncComponent } from 'vue'
import HeaderComponent from "@/components/layout/HeaderComponent.vue";
import FooterComponent from "@/components/layout/FooterComponent.vue";
import NavigationComponent from "@/components/layout/NavigationComponent.vue";
import HomePage from "@/views/HomePage.vue";

// Lazy load heavy components
const AboutMe = defineAsyncComponent(() => import("@/views/AboutMe.vue"));
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
#app {
  background: var(--color-background-gradient);
  background-color: var(--color-background);
  background-attachment: fixed;
  min-height: 100vh; 
}

html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  
}

section {
  padding: 50px 0;
}

html {
  scroll-behavior: smooth;
}

@media (max-width: 768px) {
  #app {
    background: var(--color-background-mobile);
    background-attachment: scroll;
  }
}
</style>

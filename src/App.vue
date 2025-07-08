<template>
  <div id="app">
    <HeaderComponent />
    <NavigationComponent />
    <main>
      <section id="home">
        <HomePage />
      </section>
      <section id="about">
        <AboutMe />
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
    <FooterComponent />
  </div>
</template>

<script setup>
import HeaderComponent from "@/components/layout/HeaderComponent.vue";
import FooterComponent from "@/components/layout/FooterComponent.vue";
import NavigationComponent from "@/components/layout/NavigationComponent.vue";
import HomePage from "@/views/HomePage.vue";
import AboutMe from "./views/AboutMe.vue";
import SkillsPage from "@/views/SkillsPage.vue";
import ProjectPage from "@/views/ProjectPage.vue";
import ContactPage from "@/views/ContactPage.vue";

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

<template>
  <div id="app">
    <HeaderComponent />
    <IconComponent />
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
    <FooterComponent />
  </div>
</template>

<script>
import HeaderComponent from "@/components/HeaderComponent.vue";
import FooterComponent from "@/components/FooterComponent.vue";
import HomePage from "@/views/HomePage.vue";
import AboutMe from "./views/AboutMe.vue";
import SkillsPage from "@/views/SkillsPage.vue";
import ProjectPage from "@/views/ProjectPage.vue";
import ContactPage from "@/views/ContactPage.vue";
import IconComponent from "@/components/IconComponent.vue";

export default {
  name: "App",
  components: {
    HeaderComponent,
    FooterComponent,
    HomePage,
    AboutMe,
    SkillsPage,
    ProjectPage,
    ContactPage,
    IconComponent,
  },
};
</script>


<style>
#app {
  background: linear-gradient(to bottom, rgb(0, 0, 0), rgb(80, 80, 80));
  background-color: rgb(0, 0, 0); /* Fallback voor oudere browsers */
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
    background: linear-gradient(to bottom, rgb(0, 0, 0), rgb(50, 50, 50));
    background-attachment: scroll;
  }
}
</style>

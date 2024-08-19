<template>
  <div id="app">
    <HeaderComponent />
    <section id="home">
      <HomePage />
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
import SkillsPage from "@/views/SkillsPage.vue";
import ProjectPage from "@/views/ProjectPage.vue";
import ContactPage from "@/views/ContactPage.vue";

export default {
  name: "App",
  components: {
    HeaderComponent,
    FooterComponent,
    HomePage,
    SkillsPage,
    ProjectPage,
    ContactPage,
  },
};
</script>

<style>
#app {
  background: linear-gradient(to bottom, rgb(29, 29, 29), rgb(80, 80, 80));
  background-attachment: fixed;
}

section {
  padding: 50px 0;
}

html {
  scroll-behavior: smooth;
}
</style>

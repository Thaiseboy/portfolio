import { createRouter, createWebHistory } from "vue-router";
import HomePage from "@/views/HomePage.vue";
import SkillsPage from "@/views/SkillsPage.vue";
import ProjectPage from "@/views/ProjectPage.vue";
import ContactPage from "@/views/ContactPage.vue";
// Importeer de Sanity Studio component
const SanityStudio = () => import("@/studio/schemaTypes"); 

const routes = [
  { path: "/", name: "HomePage", component: HomePage },
  { path: "/skills", name: "SkillsPage", component: SkillsPage },
  { path: "/project", name: "ProjectPage", component: ProjectPage },
  { path: "/contact", name: "ContactPage", component: ContactPage },
  { path: "/studio", name: "SanityStudio", component: SanityStudio },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: "smooth",
      };
    } else if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

export default router;

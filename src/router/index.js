import { createRouter, createWebHistory } from "vue-router";

const routes = [
  { 
    path: "/", 
    name: "HomePage", 
    component: () => import("@/views/HomePage.vue"),
    meta: {
      title: "Get - Front-End Developer",
      description: "Master Supakon Karanyawad - Front-end developer based in Netherlands. Specialized in Vue.js, TypeScript, and modern web technologies."
    }
  },
  { 
    path: "/about", 
    name: "AboutMe", 
    component: () => import("@/views/AboutMe.vue"),
    meta: {
      title: "About - Get Developer",
      description: "Learn more about Get, a passionate front-end developer with expertise in Vue.js, Laravel, and modern web development."
    }
  },
  { 
    path: "/skills", 
    name: "SkillsPage", 
    component: () => import("@/views/SkillsPage.vue"),
    meta: {
      title: "Skills - Get Developer",
      description: "Technical skills and expertise in front-end development, including Vue.js, TypeScript, CSS3, and modern frameworks."
    }
  },
  { 
    path: "/project", 
    name: "ProjectPage", 
    component: () => import("@/views/ProjectPage.vue"),
    meta: {
      title: "Projects - Get Developer",
      description: "Portfolio of web development projects showcasing modern front-end applications built with Vue.js and other technologies."
    }
  },
  { 
    path: "/contact", 
    name: "ContactPage", 
    component: () => import("@/views/ContactPage.vue"),
    meta: {
      title: "Contact - Get Developer",
      description: "Get in touch with Get for front-end development opportunities and collaborations."
    }
  },
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

// Dynamic meta tags
router.beforeEach((to, from, next) => {
  const nearestWithTitle = to.matched.slice().reverse().find(r => r.meta && r.meta.title);
  const nearestWithMeta = to.matched.slice().reverse().find(r => r.meta && r.meta.description);
  
  if (nearestWithTitle) {
    document.title = nearestWithTitle.meta.title;
  }
  
  if (nearestWithMeta) {
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', nearestWithMeta.meta.description);
  }
  
  next();
});

export default router;

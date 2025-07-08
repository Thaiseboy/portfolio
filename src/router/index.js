import { createRouter, createWebHistory } from "vue-router";

const routes = [
  { 
    path: "/", 
    name: "Portfolio", 
    component: () => import("@/App.vue"),
    meta: {
      title: "Get - Front-End Developer",
      description: "Master Supakon Karanyawad - Front-end developer based in Netherlands. Specialized in Vue.js, TypeScript, and modern web technologies."
    }
  },

  {
    path: "/:pathMatch(.*)*",
    redirect: "/"
  }
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

// Static meta tags for single page portfolio
router.beforeEach((_, __, next) => {
  document.title = "Get - Front-End Developer";
  
  let metaDescription = document.querySelector('meta[name="description"]');
  if (!metaDescription) {
    metaDescription = document.createElement('meta');
    metaDescription.setAttribute('name', 'description');
    document.head.appendChild(metaDescription);
  }
  metaDescription.setAttribute('content', 'Master Supakon Karanyawad - Front-end developer based in Netherlands. Specialized in Vue.js, TypeScript, and modern web technologies.');
  
  next();
});

export default router;

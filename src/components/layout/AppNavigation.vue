<template>
  <nav class="fixed top-4 left-0 right-0 z-[1000] bg-black/70 backdrop-blur-md rounded-[30px] shadow-[0_4px_8px_rgba(0,0,0,0.5)] px-5 py-2.5 w-[calc(100%-2rem)] md:w-[80vw] lg:w-[60vw] xl:w-[50vw] max-w-screen-xl mx-auto max-[640px]:w-[calc(100%-1rem)] max-[480px]:top-2 max-[480px]:px-3 max-[480px]:py-2">
    <ul class="flex justify-center items-center list-none m-0 p-0 gap-8 md:gap-6 sm:gap-4 max-[480px]:gap-2">
      <li class="flex items-center">
        <router-link
          class="nav-link text-gold font-bold no-underline relative flex items-center justify-center p-2 transition-all duration-normal hover:text-white hover:-translate-y-0.5 active:text-red"
          to="/#home"
          aria-label="Home"
        >
          <i class="bi bi-house-door text-5xl transition-all duration-normal md:text-[2.5rem] sm:text-3xl max-[480px]:text-2xl hover:scale-110" />
        </router-link>
      </li>
      <li class="flex items-center">
        <router-link
          class="nav-link text-gold font-bold no-underline relative flex items-center justify-center p-2 transition-all duration-normal hover:text-white hover:-translate-y-0.5 active:text-red"
          to="/#about"
          aria-label="About"
        >
          <i class="bi bi-person text-5xl transition-all duration-normal md:text-[2.5rem] sm:text-3xl max-[480px]:text-2xl hover:scale-110" />
        </router-link>
      </li>
      <li class="flex items-center">
        <router-link
          class="nav-link text-gold font-bold no-underline relative flex items-center justify-center p-2 transition-all duration-normal hover:text-white hover:-translate-y-0.5 active:text-red"
          to="/#skills"
          aria-label="Skills"
        >
          <i class="bi bi-tools text-5xl transition-all duration-normal md:text-[2.5rem] sm:text-3xl max-[480px]:text-2xl hover:scale-110" />
        </router-link>
      </li>
      <li class="flex items-center">
        <router-link
          class="nav-link text-gold font-bold no-underline relative flex items-center justify-center p-2 transition-all duration-normal hover:text-white hover:-translate-y-0.5 active:text-red"
          to="/#project"
          aria-label="Project"
        >
          <i class="bi bi-folder2-open text-5xl transition-all duration-normal md:text-[2.5rem] sm:text-3xl max-[480px]:text-2xl hover:scale-110" />
        </router-link>
      </li>
      <li class="flex items-center">
        <router-link
          class="nav-link text-gold font-bold no-underline relative flex items-center justify-center p-2 transition-all duration-normal hover:text-white hover:-translate-y-0.5 active:text-red"
          to="/#contact"
          aria-label="Contact"
        >
          <i class="bi bi-envelope text-5xl transition-all duration-normal md:text-[2.5rem] sm:text-3xl max-[480px]:text-2xl hover:scale-110" />
        </router-link>
      </li>
    </ul>
  </nav>

  <div class="fixed bottom-6 right-6 z-[1000] flex flex-col gap-3 max-[640px]:right-4 max-[640px]:bottom-4">
    <button
      type="button"
      @click="goPrev"
      class="w-11 h-11 rounded-full bg-black/70 text-gold shadow-[0_4px_8px_rgba(0,0,0,0.5)] backdrop-blur-md border border-white/10 flex items-center justify-center transition-all duration-200 hover:scale-105 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-red"
      aria-label="Vorige sectie"
    >
      <i class="bi bi-chevron-up text-2xl" />
    </button>
    <button
      type="button"
      @click="goNext"
      class="w-11 h-11 rounded-full bg-black/70 text-gold shadow-[0_4px_8px_rgba(0,0,0,0.5)] backdrop-blur-md border border-white/10 flex items-center justify-center transition-all duration-200 hover:scale-105 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-red"
      aria-label="Volgende sectie"
    >
      <i class="bi bi-chevron-down text-2xl" />
    </button>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

const sectionIds = ['home', 'about', 'skills', 'project', 'contact'];
const currentIndex = ref(0);
let observer;

const scrollToSection = (id) => {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

const goPrev = () => {
  const nextIndex = (currentIndex.value - 1 + sectionIds.length) % sectionIds.length;
  scrollToSection(sectionIds[nextIndex]);
};

const goNext = () => {
  const nextIndex = (currentIndex.value + 1) % sectionIds.length;
  scrollToSection(sectionIds[nextIndex]);
};

onMounted(() => {
  if (typeof window === 'undefined') return;

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          const foundIndex = sectionIds.indexOf(id);
          if (foundIndex !== -1) {
            currentIndex.value = foundIndex;
          }
        }
      });
    },
    { threshold: 0.55 }
  );

  sectionIds.forEach((id) => {
    const el = document.getElementById(id);
    if (el) {
      observer.observe(el);
    }
  });
});

onBeforeUnmount(() => {
  if (observer) observer.disconnect();
});

defineOptions({
  name: "AppNavigation"
});
</script>

<style scoped>
.nav-link::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -2px;
  width: 0;
  height: 3px;
  background-color: red;
  transition: width 0.5s ease;
}

.nav-link:hover::after {
  width: 100%;
}
</style>

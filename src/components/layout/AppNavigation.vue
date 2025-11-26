<template>
  <nav class="fixed top-4 left-0 right-0 z-[1000] mx-auto max-[640px]:top-3 max-[480px]:top-2" style="width: fit-content;">
    <ul class="flex justify-center items-center list-none m-0 p-0 gap-4 md:gap-3 sm:gap-2.5">
      <li class="nav-item">
        <router-link
          class="nav-link nav-link-icon"
          to="/#home"
          aria-label="Home"
        >
          <i class="bi bi-house-door nav-icon" />
        </router-link>
      </li>
      <li class="nav-item">
        <router-link
          class="nav-link nav-link-icon"
          to="/#about"
          aria-label="About"
        >
          <i class="bi bi-person nav-icon" />
        </router-link>
      </li>
      <li class="nav-item">
        <router-link
          class="nav-link nav-link-icon"
          to="/#skills"
          aria-label="Skills"
        >
          <i class="bi bi-tools nav-icon" />
        </router-link>
      </li>
      <li class="nav-item">
        <router-link
          class="nav-link nav-link-icon"
          to="/#project"
          aria-label="Project"
        >
          <i class="bi bi-folder2-open nav-icon" />
        </router-link>
      </li>
      <li class="nav-item">
        <router-link
          class="nav-link nav-link-icon"
          to="/#contact"
          aria-label="Contact"
        >
          <i class="bi bi-envelope nav-icon" />
        </router-link>
      </li>
    </ul>
  </nav>

  <div class="fixed bottom-6 right-6 z-[1000] flex flex-col gap-3 max-[640px]:right-4 max-[640px]:bottom-4">
    <button
      type="button"
      @click="goPrev"
      class="btn-scroll-glass"
      aria-label="Vorige sectie"
    >
      <i class="bi bi-chevron-up text-2xl" />
    </button>
    <button
      type="button"
      @click="goNext"
      class="btn-scroll-glass"
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

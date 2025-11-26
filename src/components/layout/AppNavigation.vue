<template>
  <button
    @click="isMenuOpen = !isMenuOpen"
    class="hamburger-btn fixed top-4 left-6 z-[1001]"
    :class="{ 'is-open': isMenuOpen }"
    aria-label="Toggle menu"
  >
    <span class="hamburger-line"></span>
    <span class="hamburger-line"></span>
    <span class="hamburger-line"></span>
  </button>

  <nav
    class="fixed top-20 left-6 z-[1000] transition-all"
    :class="{
      'opacity-100 visible duration-700 ease-out': isMenuOpen,
      'opacity-0 invisible -top-10 duration-500 ease-in': !isMenuOpen
    }"
  >
    <ul class="flex justify-center items-center list-none m-0 p-0 gap-4 md:gap-3 sm:gap-2.5">
      <li
        v-for="(item, index) in navItems"
        :key="item.id"
        class="nav-item"
        :style="{
          transitionDelay: isMenuOpen ? `${index * 0.08}s` : '0s',
          animationDelay: isMenuOpen ? `${index * 0.08}s` : '0s'
        }"
        :class="{ 'nav-item-show': isMenuOpen }"
        @click="isMenuOpen = false"
      >
        <router-link
          class="nav-link nav-link-icon"
          :to="`/#${item.id}`"
          :aria-label="item.label"
        >
          <i :class="`bi bi-${item.icon} nav-icon`" />
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

const isMenuOpen = ref(false);

const navItems = [
  { id: 'home', icon: 'house-door', label: 'Home' },
  { id: 'about', icon: 'person', label: 'About' },
  { id: 'skills', icon: 'tools', label: 'Skills' },
  { id: 'project', icon: 'folder2-open', label: 'Project' },
  { id: 'contact', icon: 'envelope', label: 'Contact' }
];

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

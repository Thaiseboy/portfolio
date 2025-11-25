<template>
  <nav class="fixed top-4 left-0 right-0 z-[1000] bg-black/70 backdrop-blur-md rounded-[30px] shadow-[0_4px_8px_rgba(0,0,0,0.5)] px-5 py-2.5 w-[calc(100%-2rem)] max-w-screen-xl mx-auto max-[480px]:top-2 max-[480px]:px-4 max-[480px]:py-2">
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
</template>

<script setup>
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

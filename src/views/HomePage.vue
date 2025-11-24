<template>
  <div class="container">
    <div class="flex flex-col items-center justify-center min-h-[80vh] text-center px-lg py-xxl md:min-h-[70vh] md:px-md md:py-lg">
      <div class="max-w-[800px] mx-auto">
        <h1 class="animate-fade-in mb-lg font-bold">
          <span class="text-red font-bold inline-block animate-bounce-slow">Nice</span> to meet you! &#x1F601;
        </h1>
        <h2 class="animate-fade-in-slow text-gold mb-xl opacity-90">
          Hi, My name is Master Supakon Karanyawad
        </h2>
        <h2 class="animate-fade-in-slow text-gold mb-xl opacity-90">
          but you can call me
          <span class="text-red font-bold">Get &#x1F680;</span>
        </h2>

        <img
          src="@/assets/foto/optimized/get.jpeg"
          alt="Master Supakon"
          class="w-[min(300px,60vw)] h-auto mx-auto my-xl md:w-[min(250px,70vw)] md:my-lg sm:w-[min(200px,80vw)]"
        />

        <div class="animate-fade-in-slower text-lg mb-xl leading-relaxed">
          <p class="text-white">
            Based in the <span class="text-gold">Netherlands</span>, I'm a
            <span class="text-red">front end developer</span> &#x1F4BB;
          </p>
        </div>

        <div class="animate-fade-in-slowest flex items-center justify-center gap-lg">
          <a
            href="https://www.linkedin.com/in/get-ms-karanyawad"
            target="_blank"
            class="social-icon text-5xl text-primary transition-all duration-normal relative hover:text-white hover:scale-125 md:text-[2.5rem] sm:text-3xl"
            aria-label="LinkedIn Profile"
          >
            <i class="bi bi-linkedin" />
          </a>
          <a
            href="https://github.com/Thaiseboy/Hi-"
            target="_blank"
            class="social-icon text-5xl text-primary transition-all duration-normal relative hover:text-white hover:scale-125 md:text-[2.5rem] sm:text-3xl"
            aria-label="GitHub Profile"
          >
            <i class="bi bi-github" />
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineOptions({
  name: "HomePage"
});
</script>

<style scoped>
.social-icon::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 3px;
  background-color: var(--color-secondary);
  transition: width 0.3s ease;
}

.social-icon:hover::after {
  width: 100%;
}
</style>

<template>
  <div class="container">
    <div class="home-hero">
      <div class="home-hero__content">
        <h1 class="home-hero__title header-font font-weight-bold">
          <span class="text-red font-weight-bold">Nice</span> to meet you! &#x1F601;
        </h1>
        <h2 class="home-hero__subtitle text-gold text-font">
          Hi, My name is Master Supakon Karanyawad
        </h2>
        <h2 class="home-hero__subtitle text-gold text-font">
          but you can call me
          <span class="text-red font-weight-bold">Get &#x1F680;</span>
        </h2>
        
        <img
          src="@/assets/foto/optimized/get.jpeg"
          alt="Master Supakon"
          class="home-hero__image"
        />
        
        <div class="home-hero__description">
          <p class="text-white">
            Based in the <span class="text-gold">Netherlands</span>, I'm a 
            <span class="text-red">front end developer</span> &#x1F4BB;
          </p>
        </div>
        
        <div class="home-hero__social">
          <a
            href="https://www.linkedin.com/in/get-ms-karanyawad"
            target="_blank"
            class="social-icon"
            aria-label="LinkedIn Profile"
          >
            <i class="bi bi-linkedin" />
          </a>
          <a
            href="https://github.com/Thaiseboy/Hi-"
            target="_blank"
            class="social-icon"
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

<style scoped lang="scss">
</style>

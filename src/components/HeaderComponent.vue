<template>
  <header class="text-gold py-5">
    <div class="container d-flex flex-column align-items-center">
      <div class="text-center">
        <img src="@/assets/foto/logo2.png" alt="Logo" class="logo-img" />
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: "HeaderComponent",
};
</script>

<style scoped>
/* Logo Styling */
.logo-img {
  max-height: 200px;
  margin: 300px;
}

/* Responsiveness voor verschillende schermen */
@media (max-width: 640px) {
  .logo-img {
    max-height: 15vh; 
  }
}

@media (max-width: 430px) {
  .logo-img {
    max-height: 12vh; 
  }
}

@media (max-width: 320px) {
  .logo-img {
    max-height: 10vh;
  }
}

</style>

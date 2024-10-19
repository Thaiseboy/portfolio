<template>
  <header class="text-gold header-container">
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
/* Header container vult volledige hoogte van het scherm */
.header-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh; 
  background-color: #000; 
  padding: 0; 
  margin: 0; 
  box-sizing: border-box;
}

/* Logo Styling voor grote schermen */
.logo-img {
  max-height: 200px;
  margin: 0 auto; 
}

/* Responsiveness voor verschillende schermen */
@media (max-width: 640px) {
  .logo-img {
    max-height: 12vh; 
  }
}

@media (max-width: 430px) { 
  .logo-img {
    max-height: 8vh;
    
  }
}

@media (max-width: 320px) {
  .logo-img {
    max-height: 7vh; 
  }
}
</style>

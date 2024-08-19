<template>
  <header class="text-gold py-5">
    <div class="container d-flex justify-content-between align-items-center">
      <div class="d-flex align-items-center">
        <div>
          <img src="@/assets/foto/logo.png" alt="Logo" class="logo-img" />
          <p class="mb-0 text-gold header-font lead">
            HTML5 | CSS3 | JavaScript | jQuery | PHP | MySQL | Vue.js
          </p>
        </div>
      </div>
      <nav>
        <ul class="nav">
          <li class="nav-item mx-5">
            <router-link
              class="nav-link text-gold font-weight-bold header-font"
              :to="{ hash: '#home' }"
              ><i class="bi bi-house-door icon-large"></i></router-link
            >
          </li>
          <li class="nav-item mx-5">
            <router-link
              class="nav-link text-gold font-weight-bold header-font"
              :to="{ hash: '#skills' }"
              ><i class="bi bi-tools icon-large"></i></router-link
            >
          </li>
          <li class="nav-item mx-5">
            <router-link
              class="nav-link text-gold font-weight-bold header-font"
              :to="{ hash: '#project' }"
              ><i class="bi bi-folder2-open icon-large"></i></router-link
            >
          </li>
          <li class="nav-item mx-5">
            <router-link
              class="nav-link text-gold font-weight-bold header-font"
              :to="{ hash: '#contact' }"
              ><i class="bi bi-envelope icon-large"></i></router-link
            >
          </li>
        </ul>
      </nav>
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
  max-height: 120px;
  margin-right: 10px;
}

/* Grotere Bootstrap Iconen */
.icon-large {
  font-size: 3rem;
}

/* Router Link Styling */
 .nav-link {
  text-decoration: none; 
  position: relative; 
}

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
.nav-link:hover {
  color: white;
}
</style>

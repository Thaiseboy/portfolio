<template>
  <nav class="sticky-icons">
    <ul class="nav justify-content-center">
      <li class="nav-item mx-3">
        <router-link
          class="nav-link text-gold font-weight-bold header-font"
          to="/#home"
        >
          <i class="bi bi-house-door icon-large"></i>
        </router-link>
      </li>
      <li class="nav-item mx-3">
        <router-link
          class="nav-link text-gold font-weight-bold header-font"
          to="/#skills"
        >
          <i class="bi bi-tools icon-large"></i>
        </router-link>
      </li>
      <li class="nav-item mx-3">
        <router-link
          class="nav-link text-gold font-weight-bold header-font"
          to="/#project"
        >
          <i class="bi bi-folder2-open icon-large"></i>
        </router-link>
      </li>
      <li class="nav-item mx-3">
        <router-link
          class="nav-link text-gold font-weight-bold header-font"
          to="/#contact"
        >
          <i class="bi bi-envelope icon-large"></i>
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: "IconComponent",
};
</script>

<style scoped>
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

/* Sticky Style */
.sticky-icons {
  position: sticky;
  top: 0;
  z-index: 1000;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 30px; 
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
  padding: 10px 20px; 
  display: flex; 
  justify-content: center; 
  align-items: center; 
  width: fit-content; 
  margin: 20px auto; 
}

/* Icon breder uit elkaar voor grotere schermen */
@media (min-width: 769px) {
  .nav-item {
    margin-right: 30px;
  }
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .icon-large {
    font-size: 2rem;
  }
}
</style>

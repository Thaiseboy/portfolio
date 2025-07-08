<template>
  <nav class="sticky-icons">
    <ul class="nav justify-content-center">
      <li class="nav-item mx-3">
        <router-link
          class="nav-link text-gold font-weight-bold header-font"
          to="/#home"
          aria-label="Home"
        >
          <i class="bi bi-house-door icon-large" />
        </router-link>
      </li>
      <li class="nav-item mx-3">
        <router-link
          class="nav-link text-gold font-weight-bold header-font"
          to="/#about"
          aria-label="About"
        >
          <i class="bi bi-person icon-large" />
        </router-link>
      </li>
      <li class="nav-item mx-3">
        <router-link
          class="nav-link text-gold font-weight-bold header-font"
          to="/#skills"
          aria-label="Skills"
        >
          <i class="bi bi-tools icon-large" />
        </router-link>
      </li>
      <li class="nav-item mx-3">
        <router-link
          class="nav-link text-gold font-weight-bold header-font"
          to="/#project"
          aria-label="Project"
        >
          <i class="bi bi-folder2-open icon-large" />
        </router-link>
      </li>
      <li class="nav-item mx-3">
        <router-link
          class="nav-link text-gold font-weight-bold header-font"
          to="/#contact"
          aria-label="Contact"
        >
          <i class="bi bi-envelope icon-large" />
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script setup>
defineOptions({
  name: "NavigationComponent"
});
</script>

<style scoped>
.icon-large {
  font-size: 3rem;
}

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

.nav-link.active {
  color: red;
}

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
  width: 100%;
  max-width: 1200px;
  margin: 20px auto;
}

@media (min-width: 640px) {
  .nav-item {
    margin-right: 30px;
  }
}

@media (max-width: 640px) {
  .icon-large {
    font-size: 2rem;
  }

  .nav-item {
    margin-right: 15px;
  }
}

@media (max-width: 320px) {
  .icon-large {
    font-size: 1.5rem;
  }

  .nav-item {
    margin-right: 10px;
  }
}
</style>

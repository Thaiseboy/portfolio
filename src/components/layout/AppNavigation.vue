<template>
  <nav class="sticky-icons">
    <ul class="nav-list">
      <li class="nav-item">
        <router-link
          class="nav-link text-gold font-weight-bold header-font"
          to="/#home"
          aria-label="Home"
        >
          <i class="bi bi-house-door icon-large" />
        </router-link>
      </li>
      <li class="nav-item">
        <router-link
          class="nav-link text-gold font-weight-bold header-font"
          to="/#about"
          aria-label="About"
        >
          <i class="bi bi-person icon-large" />
        </router-link>
      </li>
      <li class="nav-item">
        <router-link
          class="nav-link text-gold font-weight-bold header-font"
          to="/#skills"
          aria-label="Skills"
        >
          <i class="bi bi-tools icon-large" />
        </router-link>
      </li>
      <li class="nav-item">
        <router-link
          class="nav-link text-gold font-weight-bold header-font"
          to="/#project"
          aria-label="Project"
        >
          <i class="bi bi-folder2-open icon-large" />
        </router-link>
      </li>
      <li class="nav-item">
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
  name: "AppNavigation"
});
</script>

<style scoped>
.sticky-icons {
  position: sticky;
  top: 0;
  z-index: 1000;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 30px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
  padding: 10px 20px;
  width: 100%;
  max-width: 1200px;
  margin: 20px auto;
}

.nav-list {
  display: flex;
  justify-content: center;
  align-items: center;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 2rem;
}

.nav-item {
  display: flex;
  align-items: center;
}

.nav-link {
  text-decoration: none;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  transition: all 0.3s ease;
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
  transform: translateY(-2px);
}

.nav-link.active {
  color: red;
}

.icon-large {
  font-size: 3rem;
  transition: all 0.3s ease;
}

.nav-link:hover .icon-large {
  transform: scale(1.1);
}

@media (max-width: 768px) {
  .nav-list {
    gap: 1.5rem;
  }
  
  .icon-large {
    font-size: 2.5rem;
  }
}

@media (max-width: 640px) {
  .nav-list {
    gap: 1rem;
  }
  
  .icon-large {
    font-size: 2rem;
  }
}

@media (max-width: 480px) {
  .nav-list {
    gap: 0.5rem;
  }
  
  .icon-large {
    font-size: 1.5rem;
  }
  
  .sticky-icons {
    padding: 8px 16px;
  }
}
</style>

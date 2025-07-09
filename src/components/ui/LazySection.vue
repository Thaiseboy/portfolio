<template>
  <div ref="sectionRef" class="lazy-section">
    <div v-if="isVisible" class="lazy-section__content">
      <slot />
    </div>
    <div v-else class="lazy-section__placeholder">
      <SkeletonLoader type="card" width="100%" height="200px" />
    </div>
  </div>
</template>

<script setup>
import { useIntersectionObserver } from '@/composables/useIntersectionObserver'
import SkeletonLoader from './SkeletonLoader.vue'

defineOptions({
  name: "LazySection"
})

// Use intersection observer for lazy loading sections
const { isIntersecting: isVisible, targetRef: sectionRef } = useIntersectionObserver({
  rootMargin: '50px',
  threshold: 0.1,
  once: true // Stop observing after first intersection
})
</script>

<style scoped>
.lazy-section {
  min-height: 200px;
  width: 100%;
}

.lazy-section__content {
  animation: fadeIn 0.3s ease-in-out;
}

.lazy-section__placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  opacity: 0.7;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
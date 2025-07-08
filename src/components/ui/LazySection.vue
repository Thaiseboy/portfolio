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
import { ref, onMounted, onUnmounted } from 'vue'
import SkeletonLoader from './SkeletonLoader.vue'

defineOptions({
  name: "LazySection"
})

const sectionRef = ref(null)
const isVisible = ref(false)
let observer = null

const handleIntersection = (entries) => {
  const [entry] = entries
  if (entry.isIntersecting && !isVisible.value) {
    isVisible.value = true
    // Once visible, stop observing
    if (observer) {
      observer.disconnect()
    }
  }
}

onMounted(() => {
  if (sectionRef.value) {
    observer = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin: '50px', // Load 50px before entering viewport
      threshold: 0.1
    })
    observer.observe(sectionRef.value)
  }
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
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
<template>
  <div ref="containerRef" class="lazy-image-container">
    <img
      v-if="isLoaded"
      :src="src"
      :alt="alt"
      :class="imgClass"
      @load="onLoad"
      @error="handleError"
    >
    <div
      v-else-if="isIntersecting"
      class="image-placeholder"
      :class="placeholderClass"
    >
      <div class="loading-spinner"></div>
    </div>
    <div
      v-else
      class="image-placeholder"
      :class="placeholderClass"
    ></div>
  </div>
</template>

<script setup>
import { useIntersectionObserver } from '@/composables/useIntersectionObserver';
import { useImageLoader } from '@/composables/useImageLoader';

defineOptions({
  name: 'LazyImage'
});

const props = defineProps({
  src: {
    type: String,
    required: true
  },
  alt: {
    type: String,
    default: ''
  },
  imgClass: {
    type: String,
    default: ''
  },
  placeholderClass: {
    type: String,
    default: ''
  }
});

// Use intersection observer for lazy loading
const { isIntersecting, targetRef: containerRef } = useIntersectionObserver({
  rootMargin: '50px'
});

// Use image loader for loading states
const { isLoaded, onLoad, onError } = useImageLoader();

// Handle image error with props
const handleError = () => {
  onError(props.src);
};
</script>

<style scoped>
.lazy-image-container {
  position: relative;
  overflow: hidden;
}

.image-placeholder {
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid var(--color-primary, #FFD700);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

img {
  width: 100%;
  height: auto;
  transition: opacity 0.3s ease;
}
</style>
<template>
  <div ref="containerRef" class="lazy-image-container">
    <img
      v-if="isLoaded"
      :src="src"
      :alt="alt"
      :class="imgClass"
      @load="onLoad"
      @error="onError"
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
import { ref, onMounted, onUnmounted } from 'vue';

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

const isIntersecting = ref(false);
const isLoaded = ref(false);
const containerRef = ref(null);
let observer = null;

const startObserving = () => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          isIntersecting.value = true;
          observer.unobserve(entry.target);
        }
      });
    },
    {
      rootMargin: '50px'
    }
  );
  
  if (containerRef.value) {
    observer.observe(containerRef.value);
  }
};

const onLoad = () => {
  isLoaded.value = true;
};

const onError = () => {
  console.error('Failed to load image:', props.src);
};

onMounted(() => {
  startObserving();
});

onUnmounted(() => {
  if (observer) {
    observer.disconnect();
  }
});
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
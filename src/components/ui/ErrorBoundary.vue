<template>
  <div v-if="hasError" class="error-boundary">
    <div class="error-content">
      <div class="error-icon">⚠️</div>
      <h2 class="error-title">Something went wrong</h2>
      <p class="error-message">{{ errorMessage }}</p>
      <div class="error-actions">
        <button @click="retryAction" class="btn btn-primary retry-btn">
          Try Again
        </button>
        <button @click="reloadPage" class="btn btn-outline-secondary">
          Reload Page
        </button>
      </div>
    </div>
  </div>
  <slot v-else />
</template>

<script setup>
import { ref, onErrorCaptured } from 'vue';

defineOptions({
  name: 'ErrorBoundary'
});

const props = defineProps({
  fallback: {
    type: String,
    default: 'An unexpected error occurred'
  },
  onRetry: {
    type: Function,
    default: null
  }
});

const hasError = ref(false);
const errorMessage = ref('');

onErrorCaptured((error) => {
  hasError.value = true;
  errorMessage.value = error.message || props.fallback;
  console.error('Error caught by boundary:', error);
  return false;
});

const retryAction = () => {
  hasError.value = false;
  errorMessage.value = '';
  if (props.onRetry) {
    props.onRetry();
  }
};

const reloadPage = () => {
  window.location.reload();
};
</script>

<style scoped>
.error-boundary {
  @apply flex items-center justify-center min-h-[300px] p-xl rounded-lg border-2;
  background-color: rgba(248, 249, 250, 0.1);
  border-color: var(--color-border);
  backdrop-filter: blur(10px);
}

.error-content {
  @apply text-center max-w-md;
}

.error-icon {
  @apply text-5xl mb-lg;
  filter: grayscale(0.3);
}

.error-title {
  @apply text-white mb-md text-2xl font-semibold;
}

.error-message {
  @apply text-white mb-xl opacity-80 leading-relaxed;
}

.error-actions {
  @apply flex items-center justify-center gap-md flex-wrap md:flex-col;
}

.retry-btn {
  @apply bg-primary text-black border-none px-md py-sm rounded-md cursor-pointer transition-all duration-normal font-semibold;
}

.retry-btn:hover {
  @apply bg-secondary text-white -translate-y-0.5;
}

.retry-btn:active {
  @apply translate-y-0;
}

.btn-outline-secondary {
  @apply bg-transparent text-white border-2 px-md py-sm rounded-md;
  border-color: var(--color-border);
}

.btn-outline-secondary:hover {
  background-color: var(--color-card);
  border-color: var(--color-primary);
}

@media (max-width: 768px) {
  .error-content {
    @apply p-md;
  }
}
</style>
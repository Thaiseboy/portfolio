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

<style scoped lang="scss">
@import '@/assets/scss/utils/variables';
@import '@/assets/scss/utils/mixins';

.error-boundary {
  @include flex-center;
  min-height: 300px;
  padding: $spacing-xl;
  background-color: rgba(248, 249, 250, 0.1);
  border-radius: $border-radius-lg;
  border: 2px solid var(--color-border);
  backdrop-filter: blur(10px);
}

.error-content {
  text-align: center;
  max-width: 400px;
  
  .error-icon {
    font-size: 3rem;
    margin-bottom: $spacing-lg;
    filter: grayscale(0.3);
  }
  
  .error-title {
    color: var(--color-text);
    margin-bottom: $spacing-md;
    font-size: $font-size-xxl;
    font-weight: 600;
  }
  
  .error-message {
    color: var(--color-text);
    margin-bottom: $spacing-xl;
    opacity: 0.8;
    line-height: 1.5;
  }
}

.error-actions {
  @include flex-center;
  gap: $spacing-md;
  flex-wrap: wrap;
  
  .retry-btn {
    background-color: var(--color-primary);
    color: #000;
    border: none;
    padding: $spacing-sm $spacing-md;
    border-radius: $border-radius-md;
    cursor: pointer;
    transition: $transition-normal;
    font-weight: 600;
    
    &:hover {
      background-color: var(--color-secondary);
      color: var(--color-text);
      transform: translateY(-2px);
    }
    
    &:active {
      transform: translateY(0);
    }
  }
  
  .btn-outline-secondary {
    background: transparent;
    color: var(--color-text);
    border: 2px solid var(--color-border);
    padding: $spacing-sm $spacing-md;
    border-radius: $border-radius-md;
    
    &:hover {
      background-color: var(--color-card);
      border-color: var(--color-primary);
    }
  }
}

@include respond-to(md) {
  .error-actions {
    flex-direction: column;
  }
  
  .error-content {
    padding: $spacing-md;
  }
}
</style>
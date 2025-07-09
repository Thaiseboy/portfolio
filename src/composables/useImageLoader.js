import { ref } from 'vue';

/**
 * Image loader composable
 * Handles image loading states and events
 */
export function useImageLoader() {
  const isLoaded = ref(false);
  const hasError = ref(false);
  const isLoading = ref(false);

  const onLoad = () => {
    isLoaded.value = true;
    isLoading.value = false;
    hasError.value = false;
  };

  const onError = (src) => {
    isLoaded.value = false;
    isLoading.value = false;
    hasError.value = true;
    console.error('Failed to load image:', src);
  };

  const startLoading = () => {
    isLoading.value = true;
    hasError.value = false;
  };

  const reset = () => {
    isLoaded.value = false;
    hasError.value = false;
    isLoading.value = false;
  };

  return {
    isLoaded,
    hasError,
    isLoading,
    onLoad,
    onError,
    startLoading,
    reset,
  };
}
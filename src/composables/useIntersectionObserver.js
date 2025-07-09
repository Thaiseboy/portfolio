import { ref, onMounted, onUnmounted } from 'vue';

/**
 * Intersection Observer composable
 * Provides intersection observer functionality for lazy loading
 */
export function useIntersectionObserver(options = {}) {
  const isIntersecting = ref(false);
  const targetRef = ref(null);
  let observer = null;

  const defaultOptions = {
    rootMargin: '50px',
    threshold: 0.1,
    ...options
  };

  const startObserving = () => {
    if (!targetRef.value) return;

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isIntersecting.value = true;
            if (options.once !== false) {
              observer.unobserve(entry.target);
            }
          } else if (!options.once) {
            isIntersecting.value = false;
          }
        });
      },
      defaultOptions
    );
    
    observer.observe(targetRef.value);
  };

  const stopObserving = () => {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
  };

  onMounted(() => {
    startObserving();
  });

  onUnmounted(() => {
    stopObserving();
  });

  return {
    isIntersecting,
    targetRef,
    startObserving,
    stopObserving,
  };
}
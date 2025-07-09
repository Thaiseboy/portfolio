import { ref } from 'vue';
import { useSanity } from './useSanity';

/**
 * CV download composable
 * Handles fetching and downloading CV from Sanity CMS
 */
export function useCV() {
  const cvLink = ref(null);
  const cvLoading = ref(false);
  const { fetchContact, clearError } = useSanity();

  const fetchCV = async () => {
    cvLoading.value = true;
    try {
      const result = await fetchContact();
      if (result && result.length > 0) {
        cvLink.value = result[0].pdfUrl;
      }
    } catch (error) {
      console.error("Error fetching CV:", error);
    } finally {
      cvLoading.value = false;
    }
  };

  const downloadCV = () => {
    if (cvLink.value) {
      window.open(cvLink.value, '_blank');
    }
  };

  const retryFetchCV = () => {
    clearError();
    fetchCV();
  };

  return {
    cvLink,
    cvLoading,
    fetchCV,
    downloadCV,
    retryFetchCV,
  };
}
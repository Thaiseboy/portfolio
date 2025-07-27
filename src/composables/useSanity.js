import { ref } from 'vue';
import sanityClient from '@/sanityClient';

/**
 * Composable for handling Sanity CMS data fetching with enhanced error handling
 * @returns {Object} Object containing loading state, error state, retry functionality, and fetch methods
 */
export function useSanity() {
  const loading = ref(false);
  const error = ref(null);
  const retryCount = ref(0);
  const maxRetries = 3;

  const fetchData = async (query, retryOnFailure = true) => {
    loading.value = true;
    error.value = null;
    
    try {
      const data = await sanityClient.fetch(query);
      retryCount.value = 0;
      return data;
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch data from CMS';
      error.value = errorMessage;
      
      if (retryOnFailure && retryCount.value < maxRetries) {
        retryCount.value++;
        await new Promise(resolve => setTimeout(resolve, 1000 * retryCount.value));
        return fetchData(query, true);
      }
      
      console.error('Sanity fetch error:', err);
      throw new Error(errorMessage);
    } finally {
      loading.value = false;
    }
  };

  const clearError = () => {
    error.value = null;
    retryCount.value = 0;
  };

  const fetchPhotos = async () => {
    const query = `*[_type == "aboutMePhotos"] {
      _id,
      "imageUrl": image.asset->url
    }`;
    return fetchData(query);
  };

  const fetchSkills = async () => {
    const query = `*[_type == "skill"] {
      _id,
      name,
      "imageUrl": logo.asset->url,
      skillLevel
    }`;
    return fetchData(query);
  };

  const fetchProjects = async () => {
    const query = `*[_type == "project"] {
      _id,
      title,
      description,
      "imageUrl": image.asset->url,
      github,
      url
    }`;
    return fetchData(query);
  };

  const fetchContact = async () => {
    const query = `*[_type == "cv"] {
      "pdfUrl": cvFile.asset->url
    }`;
    return fetchData(query);
  };

  return {
    loading,
    error,
    retryCount,
    clearError,
    fetchPhotos,
    fetchSkills,
    fetchProjects,
    fetchContact
  };
}
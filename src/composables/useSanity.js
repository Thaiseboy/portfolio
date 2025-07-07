import { ref } from 'vue';
import sanityClient from '@/sanityClient';

/**
 * Composable for handling Sanity CMS data fetching
 * @returns {Object} Object containing loading state, error state, and fetch methods
 */
export function useSanity() {
  const loading = ref(false);
  const error = ref(null);

  const fetchData = async (query) => {
    loading.value = true;
    error.value = null;
    
    try {
      const data = await sanityClient.fetch(query);
      return data;
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const fetchPhotos = async () => {
    const query = `*[_type == "about"] {
      "imageUrls": images[].asset->url
    }`;
    return fetchData(query);
  };

  const fetchSkills = async () => {
    const query = `*[_type == "skill"] {
      _id,
      title,
      "imageUrl": image.asset->url,
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
      githubUrl,
      liveUrl
    }`;
    return fetchData(query);
  };

  const fetchContact = async () => {
    const query = `*[_type == "contact"] {
      "pdfUrl": pdf.asset->url
    }`;
    return fetchData(query);
  };

  return {
    loading,
    error,
    fetchPhotos,
    fetchSkills,
    fetchProjects,
    fetchContact
  };
}
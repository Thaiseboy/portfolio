import { useCallback, useState } from "react";
import sanityClient from "@/sanityClient";

export function useSanity() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  const fetchData = useCallback(
    async (query, retryOnFailure = true, currentRetry = 0) => {
      setLoading(true);
      setError(null);

      try {
        const data = await sanityClient.fetch(query);
        setRetryCount(0);
        return data;
      } catch (err) {
        const errorMessage = err.message || "Failed to fetch data from CMS";
        setError(errorMessage);

        if (retryOnFailure && currentRetry < maxRetries) {
          const nextRetry = currentRetry + 1;
          setRetryCount(nextRetry);
          await new Promise((resolve) => setTimeout(resolve, 1000 * nextRetry));
          return fetchData(query, true, nextRetry);
        }

        console.error("Sanity fetch error:", err);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const clearError = useCallback(() => {
    setError(null);
    setRetryCount(0);
  }, []);

  const fetchPhotos = useCallback(() => {
    const query = `*[_type == "aboutMePhotos"] {
      _id,
      title,
      "imageUrl": image.asset->url
    }`;
    return fetchData(query);
  }, [fetchData]);

  const fetchSkills = useCallback(() => {
    const query = `*[_type == "skill"] {
      _id,
      name,
      "imageUrl": logo.asset->url,
      level
    }`;
    return fetchData(query);
  }, [fetchData]);

  const fetchProjects = useCallback(() => {
    const query = `*[_type == "project"] {
      _id,
      title,
      description,
      "imageUrl": image.asset->url,
      "github": select(github == "null" => null, github),
      "url": select(url == "null" => null, url)
    }`;
    return fetchData(query);
  }, [fetchData]);

  const fetchCV = useCallback(() => {
    const query = `*[_type == "cv"] {
      "pdfUrl": cvFile.asset->url
    }`;
    return fetchData(query);
  }, [fetchData]);

  return {
    loading,
    error,
    retryCount,
    clearError,
    fetchPhotos,
    fetchSkills,
    fetchProjects,
    fetchCV,
  };
}

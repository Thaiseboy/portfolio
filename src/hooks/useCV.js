import { useCallback, useState } from "react";
import { useSanity } from "@/hooks/useSanity";

export function useCV() {
  const [cvLink, setCvLink] = useState(null);
  const { loading, fetchCV: fetchCVData, clearError } = useSanity();

  const fetchCV = useCallback(async () => {
    try {
      const result = await fetchCVData();
      if (result && result.length > 0) {
        setCvLink(result[0].pdfUrl);
      }
    } catch (error) {
      console.error("Error fetching CV:", error);
    }
  }, [fetchCVData]);

  const downloadCV = useCallback(() => {
    if (cvLink) window.open(cvLink, "_blank");
  }, [cvLink]);

  const retryFetchCV = useCallback(() => {
    clearError();
    fetchCV();
  }, [clearError, fetchCV]);

  return { cvLink, cvLoading: loading, fetchCV, downloadCV, retryFetchCV };
}

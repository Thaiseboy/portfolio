import { useState } from "react";
import { useSanity } from "@/hooks/useSanity";

export function useCV() {
  const [cvLink, setCvLink] = useState(null);
  const [cvLoading, setCvLoading] = useState(false);
  const { fetchContact, clearError } = useSanity();

  const fetchCV = async () => {
    setCvLoading(true);
    try {
      const result = await fetchContact();
      if (result && result.length > 0) {
        setCvLink(result[0].pdfUrl);
      }
    } catch (error) {
      console.error("Error fetching CV:", error);
    } finally {
      setCvLoading(false);
    }
  };

  const downloadCV = () => {
    if (cvLink) window.open(cvLink, "_blank");
  };

  const retryFetchCV = () => {
    clearError();
    fetchCV();
  };

  return { cvLink, cvLoading, fetchCV, downloadCV, retryFetchCV };
}

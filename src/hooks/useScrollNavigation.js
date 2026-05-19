import { useEffect, useState } from "react";

export function useScrollNavigation(sectionIds, options = {}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const threshold = options.threshold ?? 0.55;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const foundIndex = sectionIds.indexOf(entry.target.id);
          if (foundIndex !== -1) setCurrentIndex(foundIndex);
        });
      },
      { threshold }
    );

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [sectionIds, threshold]);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const goPrev = () => {
    const nextIndex = (currentIndex - 1 + sectionIds.length) % sectionIds.length;
    scrollToSection(sectionIds[nextIndex]);
  };

  const goNext = () => {
    const nextIndex = (currentIndex + 1) % sectionIds.length;
    scrollToSection(sectionIds[nextIndex]);
  };

  return {
    currentIndex,
    goNext,
    goPrev,
    scrollToSection,
  };
}

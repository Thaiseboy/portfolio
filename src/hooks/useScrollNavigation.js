import { useEffect, useState } from "react";

// A section is active while it crosses a thin line just above the middle of the
// viewport. Unlike a ratio threshold, this also works for sections taller than the screen.
const MIDDLE_LINE = "-45% 0px -54% 0px";

export function useScrollNavigation(sectionIds, options = {}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const rootMargin = options.rootMargin ?? MIDDLE_LINE;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const foundIndex = sectionIds.indexOf(entry.target.id);
          if (foundIndex !== -1) setCurrentIndex(foundIndex);
        });
      },
      { rootMargin, threshold: 0 }
    );

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [sectionIds, rootMargin]);

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

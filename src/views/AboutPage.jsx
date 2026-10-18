import { useCallback } from "react";
import { motion } from "motion/react";
import { useSanity } from "@/hooks/useSanity";
import { useDataFetch } from "@/hooks/useDataFetch";
import { normalizePhoto } from "@/utils/sanityMappers";
import ErrorBoundary from "@/components/ui/ErrorBoundary.jsx";
import DataState from "@/components/ui/DataState.jsx";
import SkeletonLoader from "@/components/ui/SkeletonLoader.jsx";
import SectionHeader from "@/components/ui/SectionHeader.jsx";
import Reveal from "@/components/motion/Reveal.jsx";

// Slight alternating tilt so the photos look pinned to a board.
const tilts = [-2, 1.5, -1, 2];

export default function AboutPage() {
  const { loading, fetchPhotos, clearError } = useSanity();
  const filterPhoto = useCallback((photo) => Boolean(photo.url), []);
  const logPhotoError = useCallback((error) => {
    console.error("Error fetching photos:", error);
  }, []);
  const { items: photos, retry: retryFetchPhotos } = useDataFetch(
    fetchPhotos,
    normalizePhoto,
    {
      clearError,
      filter: filterPhoto,
      onError: logPhotoError,
    },
  );

  return (
    <div className="section container">
      <SectionHeader index="01" eyebrow="About" title="Get to know me" />

      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <Reveal className="card-brutal p-6 md:p-10">
          <p className="tag tag-light m-0">
            Frontend developer with broad development experience
          </p>
          <h3 className="mb-6 mt-6 text-[clamp(1.6rem,3vw,2.5rem)] font-bold leading-tight">
            Dynamic web applications that are clear, fast and{" "}
            <span className="bg-accent px-1 text-on-accent">easy to use.</span>
          </h3>
          <div className="space-y-4 text-base leading-relaxed text-grey md:text-lg">
            <p className="m-0">
              I&apos;m Master Supakon Karanyawad, a frontend developer with a
              passion for building dynamic web applications that feel clear,
              fast and easy to use.
            </p>
            <p className="m-0">
              In frontend development I work a lot with React, TypeScript and
              Tailwind. In my current work I also maintain legacy frontend and
              backend code with PHP, Zend Framework 1 and Bootstrap 5, and I
              have backend experience with Laravel.
            </p>
            <p className="m-0">
              That combination helps me understand the full flow of a project,
              from interface to backend logic, with a focus on reusable
              components, clean structure, performance and maintainable code.
            </p>
          </div>
        </Reveal>

        <ErrorBoundary onRetry={retryFetchPhotos}>
          <div className="grid grid-cols-2 gap-5 self-start">
            <DataState
              loading={loading}
              items={photos}
              emptyMessage="No photos available"
              emptyClassName="empty-state surface-panel col-span-2"
              renderLoading={() => <SkeletonLoader type="list" count={4} />}
              renderItems={(items) => (
                <>
                  {items.map((photo, index) => (
                    <motion.figure
                      key={photo.id}
                      className="card-brutal m-0 overflow-hidden p-2"
                      initial={{ opacity: 0, y: 40, rotate: 0 }}
                      whileInView={{
                        opacity: 1,
                        y: 0,
                        rotate: tilts[index % tilts.length],
                      }}
                      whileHover={{ rotate: 0, scale: 1.04, zIndex: 2 }}
                      viewport={{ once: true, margin: "-10% 0px" }}
                      transition={{
                        type: "spring",
                        stiffness: 160,
                        damping: 18,
                        delay: index * 0.08,
                      }}
                    >
                      <img
                        src={photo.url}
                        alt={photo.title}
                        className="aspect-square w-full object-cover"
                      />
                    </motion.figure>
                  ))}
                </>
              )}
            />
          </div>
        </ErrorBoundary>
      </div>
    </div>
  );
}

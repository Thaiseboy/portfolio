import { useCallback, useEffect, useState } from "react";
import { motion } from "motion/react";
import { useSanity } from "@/hooks/useSanity";
import { useDataFetch } from "@/hooks/useDataFetch";
import { normalizeAbout, normalizePhoto } from "@/utils/sanityMappers";
import { ABOUT_DEFAULTS } from "../../studio/shared/aboutDefaults.js";
import ErrorBoundary from "@/components/ui/ErrorBoundary.jsx";
import RichText from "@/components/ui/RichText.jsx";
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

  // Own useSanity, so loading the text does not flip the photos' loading state.
  const { fetchAbout } = useSanity();
  const [about, setAbout] = useState(ABOUT_DEFAULTS);
  useEffect(() => {
    let active = true;
    fetchAbout()
      .then((doc) => {
        if (active) setAbout(normalizeAbout(doc));
      })
      .catch((error) => console.error("Error fetching About text:", error));
    return () => {
      active = false;
    };
  }, [fetchAbout]);

  return (
    <div className="section container">
      <SectionHeader index="01" eyebrow="About" title={about.title} />

      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <Reveal className="card-brutal p-6 md:p-10">
          {about.tagline && (
            <p className="tag tag-light m-0 mb-6">{about.tagline}</p>
          )}
          <h3 className="mb-6 text-[clamp(1.6rem,3vw,2.5rem)] font-bold leading-tight">
            {about.heading}
            {about.highlight && (
              <>
                {" "}
                <span className="bg-accent px-1 text-on-accent">
                  {about.highlight}
                </span>
              </>
            )}
          </h3>
          <RichText
            value={about.body}
            className="text-base leading-relaxed text-grey md:text-lg"
          />
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

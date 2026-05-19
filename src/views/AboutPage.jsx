import { useCallback } from "react";
import { useSanity } from "@/hooks/useSanity";
import { useDataFetch } from "@/hooks/useDataFetch";
import { normalizePhoto } from "@/utils/sanityMappers";
import ErrorBoundary from "@/components/ui/ErrorBoundary.jsx";
import DataState from "@/components/ui/DataState.jsx";
import SkeletonLoader from "@/components/ui/SkeletonLoader.jsx";

export default function AboutPage() {
  const { loading, fetchPhotos, clearError } = useSanity();
  const filterPhoto = useCallback((photo) => Boolean(photo.url), []);
  const logPhotoError = useCallback((error) => {
    console.error("Error fetching photos:", error);
  }, []);
  const { items: photos, retry: retryFetchPhotos } = useDataFetch(fetchPhotos, normalizePhoto, {
    clearError,
    filter: filterPhoto,
    onError: logPhotoError,
  });

  return (
    <div className="page-container">
      <h1 className="page-title">
        <span className="text-red">Get</span> to know me &#128526;
      </h1>

      <div className="section-shell">
        <div className="about-layout">
          <ErrorBoundary onRetry={retryFetchPhotos}>
            <div className="about-visual">
              <DataState
                loading={loading}
                items={photos}
                emptyMessage="No photos available"
                emptyClassName="empty-photos surface-panel empty-state"
                renderLoading={() => <SkeletonLoader type="list" count={4} />}
                renderItems={(items) => (
                  <>
                    {items.map((photo) => (
                      <figure key={photo.id} className="photo-tile surface-panel">
                        <img src={photo.url} alt={photo.title} />
                      </figure>
                    ))}
                  </>
                )}
              />
            </div>
          </ErrorBoundary>

          <section className="about-content surface-panel">
            <p className="about-eyebrow">Frontend developer with broad development experience</p>
            <h2>Dynamic web applications that are clear, fast and easy to use.</h2>
            <div className="about-copy">
              <p>
                I&apos;m Master Supakon Karanyawad, a frontend developer with a passion for building dynamic
                web applications that feel clear, fast and easy to use.
              </p>
              <p>
                In frontend development I work a lot with React, TypeScript and Tailwind. In my current
                work I also maintain legacy frontend and backend code with PHP, Zend Framework 1 and
                Bootstrap 5, and I have backend experience with Laravel.
              </p>
              <p>
                That combination helps me understand the full flow of a project, from interface to backend
                logic, with a focus on reusable components, clean structure, performance and maintainable code.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useSanity } from "@/hooks/useSanity";
import { normalizePhoto } from "@/utils/sanityMappers";
import ErrorBoundary from "@/components/ui/ErrorBoundary.jsx";
import SkeletonLoader from "@/components/ui/SkeletonLoader.jsx";

export default function AboutPage() {
  const [photos, setPhotos] = useState([]);
  const { loading, fetchPhotos, clearError } = useSanity();

  const loadPhotos = async () => {
    try {
      const data = await fetchPhotos();
      if (data && data.length > 0) {
        setPhotos(data.map(normalizePhoto).filter((photo) => photo.url));
      }
    } catch (err) {
      console.error("Error fetching photos:", err);
    }
  };

  const retryFetchPhotos = () => {
    clearError();
    loadPhotos();
  };

  useEffect(() => {
    loadPhotos();
  }, []);

  return (
    <div className="page-container">
      <h1 className="page-title">
        <span className="text-red">Get</span> to know me &#128526;
      </h1>

      <div className="section-shell">
        <div className="about-layout">
          <ErrorBoundary onRetry={retryFetchPhotos}>
            <div className="about-visual">
              {loading && <SkeletonLoader type="list" count={4} />}
              {!loading && photos.length > 0 && (
                <>
                  {photos.map((photo) => (
                    <figure key={photo.id} className="photo-tile surface-panel">
                      <img src={photo.url} alt={photo.title} />
                    </figure>
                  ))}
                </>
              )}
              {!loading && photos.length === 0 && (
                <div className="empty-photos surface-panel empty-state">
                  <p>No photos available</p>
                </div>
              )}
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

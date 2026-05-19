import { useCallback } from "react";
import { useSanity } from "@/hooks/useSanity";
import { useDataFetch } from "@/hooks/useDataFetch";
import { normalizeProject } from "@/utils/sanityMappers";
import ProjectCard from "@/components/project/ProjectCard.jsx";
import DataState from "@/components/ui/DataState.jsx";
import ErrorBoundary from "@/components/ui/ErrorBoundary.jsx";
import SkeletonLoader from "@/components/ui/SkeletonLoader.jsx";

export default function ProjectPage() {
  const { loading, fetchProjects, clearError } = useSanity();
  const logProjectError = useCallback((error) => {
    console.error("Error fetching projects:", error);
  }, []);
  const { items: projects, retry: retryFetchProjects } = useDataFetch(fetchProjects, normalizeProject, {
    clearError,
    onError: logProjectError,
  });

  return (
    <div className="page-container">
      <h1 className="page-title">
        <span className="text-red">Get</span> Inspired by my Projects &#x1F5C2;
      </h1>
      <ErrorBoundary onRetry={retryFetchProjects}>
        <div className="section-shell">
          <p className="section-intro">
            A selection of work where structure, frontend detail and practical logic come together.
          </p>

          <DataState
            loading={loading}
            items={projects}
            emptyMessage="No projects available"
            renderLoading={() => (
              <div className="projects-grid">
                {Array.from({ length: 6 }).map((_, index) => (
                  <SkeletonLoader key={index} type="card" className="project-skeleton" />
                ))}
              </div>
            )}
            renderItems={(items) => (
              <div className="projects-grid">
                {items.map((project) => (
                  <ProjectCard key={project._id} project={project} />
                ))}
              </div>
            )}
          />
        </div>
      </ErrorBoundary>
    </div>
  );
}

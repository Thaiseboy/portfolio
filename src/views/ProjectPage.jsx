import { useCallback } from "react";
import { useSanity } from "@/hooks/useSanity";
import { useDataFetch } from "@/hooks/useDataFetch";
import { normalizeProject } from "@/utils/sanityMappers";
import ProjectCard from "@/components/project/ProjectCard.jsx";
import DataState from "@/components/ui/DataState.jsx";
import ErrorBoundary from "@/components/ui/ErrorBoundary.jsx";
import SkeletonLoader from "@/components/ui/SkeletonLoader.jsx";
import SectionHeader from "@/components/ui/SectionHeader.jsx";

export default function ProjectPage() {
  const { loading, fetchProjects, clearError } = useSanity();
  const logProjectError = useCallback((error) => {
    console.error("Error fetching projects:", error);
  }, []);
  const { items: projects, retry: retryFetchProjects } = useDataFetch(
    fetchProjects,
    normalizeProject,
    {
      clearError,
      onError: logProjectError,
    },
  );

  return (
    <div className="section container">
      <SectionHeader
        index="03"
        eyebrow="Projects"
        title="Selected work"
        intro="A selection of work where structure, frontend detail and practical logic come together."
      />

      <ErrorBoundary onRetry={retryFetchProjects}>
        <DataState
          loading={loading}
          items={projects}
          emptyMessage="No projects available"
          renderLoading={() => (
            <div className="flex flex-col gap-8">
              {Array.from({ length: 3 }).map((_, index) => (
                <SkeletonLoader key={index} type="card" />
              ))}
            </div>
          )}
          renderItems={(items) => (
            <div className="flex flex-col gap-8">
              {items.map((project, index) => (
                <ProjectCard
                  key={project._id}
                  project={project}
                  index={index}
                />
              ))}
            </div>
          )}
        />
      </ErrorBoundary>
    </div>
  );
}

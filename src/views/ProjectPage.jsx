import { useEffect, useState } from "react";
import { useSanity } from "@/hooks/useSanity";
import { getInitials, normalizeProject } from "@/utils/sanityMappers";
import ErrorBoundary from "@/components/ui/ErrorBoundary.jsx";
import SkeletonLoader from "@/components/ui/SkeletonLoader.jsx";

export default function ProjectPage() {
  const [projects, setProjects] = useState([]);
  const { loading, fetchProjects, clearError } = useSanity();

  const loadProjects = async () => {
    try {
      const data = await fetchProjects();
      setProjects(data.map(normalizeProject));
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const retryFetchProjects = () => {
    clearError();
    loadProjects();
  };

  const toggleDescription = (projectId) => {
    setProjects((current) =>
      current.map((project) =>
        project._id === projectId
          ? { ...project, showFullDescription: !project.showFullDescription }
          : project
      )
    );
  };

  useEffect(() => {
    loadProjects();
  }, []);

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

          {loading && (
            <div className="projects-grid">
              {Array.from({ length: 6 }).map((_, index) => (
                <SkeletonLoader key={index} type="card" className="project-skeleton" />
              ))}
            </div>
          )}

          {!loading && projects.length > 0 && (
            <div className="projects-grid">
              {projects.map((project) => (
                <article key={project._id} className="project-card surface-panel surface-hover">
                  <div className="project-media">
                    {project.image ? (
                      <img src={project.image} alt={`${project.title} preview`} />
                    ) : (
                      <div className="project-media-fallback">
                        <span>{getInitials(project.title)}</span>
                      </div>
                    )}
                  </div>

                  <div className="project-body">
                    <h2>{project.title}</h2>
                    <p className={`project-description ${project.showFullDescription ? "expanded" : ""}`}>
                      {project.description}
                    </p>

                    {project.description && project.description.length > 150 && (
                      <button
                        type="button"
                        onClick={() => toggleDescription(project._id)}
                        className="project-read-more"
                      >
                        {project.showFullDescription ? "Show Less" : "Read More"}
                      </button>
                    )}
                  </div>

                  <div className="project-actions">
                    {project.url && (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-link project-link-primary"
                      >
                        View project
                      </a>
                    )}
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-link"
                      >
                        GitHub
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}

          {!loading && projects.length === 0 && (
            <div className="empty-state surface-panel">
              <p>No projects available</p>
            </div>
          )}
        </div>
      </ErrorBoundary>
    </div>
  );
}

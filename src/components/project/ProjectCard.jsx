import { useState } from "react";
import { getInitials } from "@/utils/sanityMappers";

export default function ProjectCard({ project }) {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const hasLongDescription = project.description && project.description.length > 150;

  return (
    <article className="project-card surface-panel surface-hover">
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
        <p className={`project-description ${showFullDescription ? "expanded" : ""}`}>
          {project.description}
        </p>

        {hasLongDescription && (
          <button
            type="button"
            onClick={() => setShowFullDescription((isVisible) => !isVisible)}
            className="project-read-more"
          >
            {showFullDescription ? "Show Less" : "Read More"}
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
  );
}

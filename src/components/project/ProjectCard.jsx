import { useState } from "react";
import { motion } from "motion/react";
import { getInitials } from "@/utils/sanityMappers";

export default function ProjectCard({ project, index }) {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const hasLongDescription = project.description && project.description.length > 150;
  // Alternate dark and light cards, like an index of case studies.
  const isDark = index % 2 === 0;
  const number = String(index + 1).padStart(2, "0");

  return (
    <motion.article
      className={`group grid border-2 border-ink shadow-brutal transition-shadow duration-200 hover:shadow-brutal-lg md:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] ${
        isDark ? "stripes-dark text-white" : "stripes-light text-ink"
      }`}
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ x: -4, y: -4 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex flex-col gap-5 p-6 md:p-8">
        <div className="flex items-start justify-between gap-6">
          <span className="font-mono text-5xl font-bold leading-none md:text-6xl">{number}</span>
          <span
            aria-hidden="true"
            className="text-3xl transition-transform duration-200 group-hover:-rotate-45 group-hover:text-accent"
          >
            →
          </span>
        </div>

        <h3 className="m-0 text-2xl font-bold uppercase leading-tight md:text-3xl">{project.title}</h3>

        <div>
          <p
            className={`m-0 leading-relaxed ${isDark ? "text-white/75" : "text-grey"} ${
              showFullDescription ? "" : "line-clamp-3"
            }`}
          >
            {project.description}
          </p>
          {hasLongDescription && (
            <button
              type="button"
              onClick={() => setShowFullDescription((isVisible) => !isVisible)}
              className="mt-3 cursor-pointer border-0 bg-transparent p-0 font-mono text-xs font-bold uppercase tracking-wider text-accent underline underline-offset-4"
            >
              {showFullDescription ? "Show less" : "Read more"}
            </button>
          )}
        </div>

        <div className="mt-auto flex flex-wrap gap-3 pt-2">
          {project.url && (
            <a href={project.url} target="_blank" rel="noopener noreferrer" className="btn btn-accent">
              View project ↗
            </a>
          )}
          {project.github && (
            <a href={project.github} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
              <i className="bi bi-github text-base" /> GitHub
            </a>
          )}
        </div>
      </div>

      <div className="relative min-h-[220px] overflow-hidden border-t-2 border-ink bg-paper md:border-l-2 md:border-t-0">
        {project.image ? (
          <img
            src={project.image}
            alt={`${project.title} preview`}
            className="absolute inset-0 h-full w-full object-cover grayscale transition duration-500 group-hover:scale-105 group-hover:grayscale-0"
          />
        ) : (
          <div className="flex h-full min-h-[220px] items-center justify-center">
            <span className="font-mono text-5xl font-bold text-ink">{getInitials(project.title)}</span>
          </div>
        )}
      </div>
    </motion.article>
  );
}

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { getInitials } from "@/utils/sanityMappers";
import RichText from "@/components/ui/RichText.jsx";

export default function ProjectCard({ project, index }) {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const hasLongDescription =
    project.excerpt.length > 150 ||
    (Array.isArray(project.description) && project.description.length > 1);
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
          <span className="font-mono text-5xl font-bold leading-none md:text-6xl">
            {number}
          </span>
          <span
            aria-hidden="true"
            className="text-3xl transition-transform duration-200 group-hover:-rotate-45 group-hover:text-accent"
          >
            →
          </span>
        </div>

        <h3 className="m-0 text-2xl font-bold uppercase leading-tight md:text-3xl">
          {project.title}
        </h3>

        {project.tags.length > 0 && (
          <ul
            className="m-0 flex list-none flex-wrap gap-2 p-0"
            aria-label="Built with"
          >
            {project.tags.map((tag) => (
              <li
                key={tag}
                className={`border px-2 py-1 font-mono text-[0.65rem] font-bold uppercase tracking-wider ${
                  isDark
                    ? "border-white/30 text-white/80"
                    : "border-ink/25 text-grey"
                }`}
              >
                {tag}
              </li>
            ))}
          </ul>
        )}

        <div
          className={`leading-relaxed ${isDark ? "text-white/75" : "text-grey"}`}
        >
          <AnimatePresence initial={false} mode="wait">
            {showFullDescription ? (
              <motion.div
                key="full"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <RichText value={project.description} />
              </motion.div>
            ) : (
              <motion.p
                key="excerpt"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="m-0 line-clamp-3"
              >
                {project.excerpt}
              </motion.p>
            )}
          </AnimatePresence>
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
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-accent"
            >
              View project ↗
            </a>
          )}
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost"
            >
              <i className="bi bi-github text-base" /> GitHub
            </a>
          )}
        </div>
      </div>

      <div className="relative min-h-[220px] overflow-hidden border-t-2 border-ink bg-paper md:border-l-2 md:border-t-0">
        {project.image ? (
          <img
            src={project.image}
            alt={project.imageAlt || `${project.title} preview`}
            className="absolute inset-0 h-full w-full object-cover grayscale transition duration-500 group-hover:scale-105 group-hover:grayscale-0"
          />
        ) : (
          <div className="flex h-full min-h-[220px] items-center justify-center">
            <span className="font-mono text-5xl font-bold text-ink">
              {getInitials(project.title)}
            </span>
          </div>
        )}
      </div>
    </motion.article>
  );
}

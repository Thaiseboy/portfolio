import { useCallback } from "react";
import { motion } from "motion/react";
import { useSanity } from "@/hooks/useSanity";
import { useDataFetch } from "@/hooks/useDataFetch";
import { getInitials, normalizeSkill } from "@/utils/sanityMappers";
import DataState from "@/components/ui/DataState.jsx";
import ErrorBoundary from "@/components/ui/ErrorBoundary.jsx";
import SkeletonLoader from "@/components/ui/SkeletonLoader.jsx";
import SectionHeader from "@/components/ui/SectionHeader.jsx";

const levelSteps = [1, 2, 3];

export default function SkillsPage() {
  const { loading, fetchSkills, clearError } = useSanity();
  const logSkillError = useCallback((error) => {
    console.error("Error fetching skills:", error);
  }, []);
  const { items: skills, retry: retryFetchSkills } = useDataFetch(
    fetchSkills,
    normalizeSkill,
    {
      clearError,
      onError: logSkillError,
    },
  );

  return (
    <div className="section stripes-light border-y-2 border-ink">
      <div className="container">
        <SectionHeader
          index="02"
          eyebrow="Skills"
          title="My toolbox"
          intro="Tools I use to build reliable interfaces and keep projects maintainable."
        />

        <ErrorBoundary onRetry={retryFetchSkills}>
          <DataState
            loading={loading}
            items={skills}
            emptyMessage="No skills available"
            renderLoading={() => (
              <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
                {Array.from({ length: 8 }).map((_, index) => (
                  <SkeletonLoader key={index} type="card" />
                ))}
              </div>
            )}
            renderItems={(items) => (
              <ul className="m-0 grid list-none grid-cols-2 gap-5 p-0 sm:grid-cols-3 lg:grid-cols-4">
                {items.map((skill, index) => (
                  <motion.li
                    key={skill._id}
                    id={`skill-${skill._id}`}
                    className="card-brutal group flex flex-col gap-5 p-5 transition-shadow duration-150 hover:shadow-brutal-accent"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -6 }}
                    viewport={{ once: true, margin: "-5% 0px" }}
                    transition={{ duration: 0.45, delay: (index % 4) * 0.06 }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex h-14 w-14 items-center justify-center border-2 border-ink bg-white">
                        {skill.logoUrl ? (
                          <img
                            src={skill.logoUrl}
                            alt={`${skill.name} logo`}
                            className="h-9 w-9 object-contain"
                          />
                        ) : (
                          <span className="font-mono font-bold text-night">
                            {getInitials(skill.name)}
                          </span>
                        )}
                      </div>
                      <span className="font-mono text-xs font-bold text-grey-light group-hover:text-accent">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <div>
                      <h3 className="mb-3 mt-0 text-lg font-bold leading-tight">
                        {skill.name}
                      </h3>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                        <div className="flex gap-1" aria-hidden="true">
                          {levelSteps.map((step) => (
                            <span
                              key={step}
                              className={`h-2.5 w-5 border-2 border-ink ${step <= skill.levelRank ? "bg-accent" : "bg-surface"}`}
                            />
                          ))}
                        </div>
                        <span className="font-mono text-[0.7rem] font-bold uppercase tracking-wider text-grey">
                          {skill.level}
                        </span>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </ul>
            )}
          />
        </ErrorBoundary>
      </div>
    </div>
  );
}

import { useCallback } from "react";
import { useSanity } from "@/hooks/useSanity";
import { useDataFetch } from "@/hooks/useDataFetch";
import { getInitials, normalizeSkill } from "@/utils/sanityMappers";
import DataState from "@/components/ui/DataState.jsx";
import ErrorBoundary from "@/components/ui/ErrorBoundary.jsx";
import SkeletonLoader from "@/components/ui/SkeletonLoader.jsx";

export default function SkillsPage() {
  const { loading, fetchSkills, clearError } = useSanity();
  const logSkillError = useCallback((error) => {
    console.error("Error fetching skills:", error);
  }, []);
  const { items: skills, retry: retryFetchSkills } = useDataFetch(fetchSkills, normalizeSkill, {
    clearError,
    onError: logSkillError,
  });

  return (
    <div className="page-container">
      <h1 className="page-title">
        <span className="text-red">Get</span> to Know My Skills &#x26A1;
      </h1>
      <ErrorBoundary onRetry={retryFetchSkills}>
        <div className="section-shell">
          <div className="section-intro">
            <p>Tools I use to build reliable interfaces and keep projects maintainable.</p>
          </div>

          <DataState
            loading={loading}
            items={skills}
            emptyMessage="No skills available"
            renderLoading={() => (
              <div className="skills-grid">
                {Array.from({ length: 6 }).map((_, index) => (
                  <SkeletonLoader key={index} type="card" className="skill-skeleton" />
                ))}
              </div>
            )}
            renderItems={(items) => (
              <div className="skills-grid">
                {items.map((skill) => (
                  <article key={skill._id} id={`skill-${skill._id}`} className="skill-card surface-panel surface-hover">
                    <div className="skill-logo">
                      {skill.logoUrl ? (
                        <img src={skill.logoUrl} alt={`${skill.name} logo`} />
                      ) : (
                        <span>{getInitials(skill.name)}</span>
                      )}
                    </div>

                    <div className="skill-content">
                      <h3>{skill.name}</h3>
                      <p>{skill.level}</p>
                    </div>
                  </article>
                ))}
              </div>
            )}
          />
        </div>
      </ErrorBoundary>
    </div>
  );
}

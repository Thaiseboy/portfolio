import { useEffect, useState } from "react";
import { useSanity } from "@/hooks/useSanity";
import { getInitials, normalizeSkill } from "@/utils/sanityMappers";
import ErrorBoundary from "@/components/ui/ErrorBoundary.jsx";
import SkeletonLoader from "@/components/ui/SkeletonLoader.jsx";

export default function SkillsPage() {
  const [skills, setSkills] = useState([]);
  const { loading, fetchSkills, clearError } = useSanity();

  const loadSkills = async () => {
    try {
      const data = await fetchSkills();
      setSkills(data.map(normalizeSkill));
    } catch (error) {
      console.error("Error fetching skills:", error);
    }
  };

  const retryFetchSkills = () => {
    clearError();
    loadSkills();
  };

  useEffect(() => {
    loadSkills();
  }, []);

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

          {loading && (
            <div className="skills-grid">
              {Array.from({ length: 6 }).map((_, index) => (
                <SkeletonLoader key={index} type="card" className="skill-skeleton" />
              ))}
            </div>
          )}

          {!loading && skills.length > 0 && (
            <div className="skills-grid">
              {skills.map((skill) => (
                <article key={skill._id} id={`skill-${skill._id}`} className="skill-card surface-panel surface-hover">
                  <div className="skill-logo">
                    {skill.logoUrl ? (
                      <img src={skill.logoUrl} alt={`${skill.name} logo`} />
                    ) : (
                      <span>{getInitials(skill.name || skill.title)}</span>
                    )}
                  </div>

                  <div className="skill-content">
                    <h3>{skill.name || skill.title}</h3>
                    <p>{skill.level}</p>
                  </div>
                </article>
              ))}
            </div>
          )}

          {!loading && skills.length === 0 && (
            <div className="empty-state surface-panel">
              <p>No skills available</p>
            </div>
          )}
        </div>
      </ErrorBoundary>
    </div>
  );
}

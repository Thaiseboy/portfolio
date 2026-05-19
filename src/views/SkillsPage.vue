<template>
  <div class="page-container">
    <h1 class="page-title">
      <span class="text-red">Get</span> to Know My Skills &#x26A1;
    </h1>
    <ErrorBoundary :on-retry="retryFetchSkills">
      <div class="section-shell">
        <div class="section-intro">
          <p>Tools I use to build reliable interfaces and keep projects maintainable.</p>
        </div>

        <div v-if="loading" class="skills-grid">
          <SkeletonLoader
            v-for="n in 6"
            :key="n"
            type="card"
            class="skill-skeleton"
          />
        </div>

        <div v-else-if="skills.length > 0" class="skills-grid">
          <article
            v-for="skill in skills"
            :id="`skill-${skill._id}`"
            :key="skill._id"
            class="skill-card surface-panel surface-hover"
          >
            <div class="skill-logo">
              <img
                v-if="skill.logoUrl"
                :src="skill.logoUrl"
                :alt="`${skill.name} logo`"
              >
              <span v-else>{{ getInitials(skill.name || skill.title) }}</span>
            </div>

            <div class="skill-content">
              <h3>{{ skill.name || skill.title }}</h3>
              <p>{{ skill.level }}</p>
            </div>
          </article>
        </div>

        <div v-else-if="!loading && skills.length === 0" class="empty-state surface-panel">
          <p>No skills available</p>
        </div>
      </div>
    </ErrorBoundary>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useSanity } from "@/composables/useSanity";
import { getInitials, normalizeSkill } from "@/utils/sanityMappers";
import ErrorBoundary from "@/components/ui/ErrorBoundary.vue";
import SkeletonLoader from "@/components/ui/SkeletonLoader.vue";

defineOptions({
  name: "SkillsPage",
});

const skills = ref([]);
const { loading, fetchSkills: fetchSkillsData, clearError } = useSanity();

const loadSkills = async () => {
  try {
    const data = await fetchSkillsData();
    skills.value = data.map(normalizeSkill);
  } catch (error) {
    console.error("Error fetching skills:", error);
  }
};

const retryFetchSkills = () => {
  clearError();
  loadSkills();
};

onMounted(loadSkills);
</script>

<style scoped>
.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
  gap: 1rem;
}

.skill-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.1rem;
  min-height: 210px;
  padding: 1.5rem 1rem;
  overflow: hidden;
  color: #fff;
}

.skill-card::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.08), transparent 55%);
  opacity: 0.65;
  pointer-events: none;
}

.skill-logo,
.skill-content,
.skill-card h3,
.skill-card p {
  position: relative;
  z-index: 1;
}

.skill-content {
  min-width: 0;
  width: 100%;
  text-align: center;
}

.skill-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 92px;
  height: 92px;
  background: rgba(0, 0, 0, 0.24);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
}

.skill-logo img {
  max-width: 64px;
  max-height: 64px;
  object-fit: contain;
  filter: drop-shadow(0 8px 12px rgba(0, 0, 0, 0.3));
}

.skill-logo span {
  color: #FFD700;
  font-weight: 800;
}

.skill-card h3 {
  margin: 0 0 0.65rem;
  color: #fff;
  font-size: 1.1rem;
  line-height: 1.25;
}

.skill-card p {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 108px;
  max-width: 100%;
  margin: 0;
  padding: 0.35rem 0.75rem;
  background: rgba(255, 215, 0, 0.12);
  border: 1px solid rgba(255, 215, 0, 0.22);
  border-radius: 999px;
  color: #FFD700;
  font-size: 0.8rem;
  font-weight: 700;
  line-height: 1.2;
  white-space: normal;
  text-align: center;
}

.skill-skeleton {
  min-height: 210px;
}

@media (max-width: 768px) {
  .skills-grid {
    grid-template-columns: 1fr;
  }

  .skill-card {
    min-height: 190px;
  }

  .skill-logo {
    width: 82px;
    height: 82px;
  }

  .skill-logo img {
    max-width: 58px;
    max-height: 58px;
  }
}
</style>

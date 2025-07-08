<template>
  <div class="skills-page">
    <h1 class="skills-page__title header-font font-weight-bold text-gold">
      <span class="text-red">Get</span> Skilled with Me &#x26A1;
    </h1>
    <ErrorBoundary :on-retry="retryFetchSkills">
      <div class="skills-container">
      <div class="skills-wrapper">
        <SkeletonLoader 
          v-if="loading" 
          type="list" 
          :count="6"
        />
        <div
          v-else-if="skills.length > 0"
          v-for="skill in skills"
          :id="`skill-${skill._id}`"
          :key="skill._id"
          class="skill-item"
        >
          <img
            v-if="skill.logoUrl" 
            :src="skill.logoUrl" 
            :alt="`${skill.name} logo`" 
            class="skill-logo"
          >
          <div
            v-else
            class="no-logo"
          >
            <span>No logo available</span>
          </div>
          <div class="skill-details">
            <h3>{{ skill.name || skill.title }}</h3>
            <p>{{ skill.level }}</p>
            <div class="progress">
              <div
                class="progress-bar bg-warning"
                role="progressbar"
                :style="{width: skill.rating + '%'}"
                :aria-valuenow="skill.rating"
                aria-valuemin="0"
                aria-valuemax="100"
              >
                {{ skill.rating }}%
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="!loading && skills.length === 0" class="no-skills">
          <p>No skills available</p>
        </div>
      </div>
    </div>
  </ErrorBoundary>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useSanity } from '@/composables/useSanity';
import ErrorBoundary from '@/components/ui/ErrorBoundary.vue';
import SkeletonLoader from '@/components/ui/SkeletonLoader.vue';

defineOptions({
  name: 'SkillsPage'
});

const skills = ref([]);
const { loading, fetchSkills: fetchSkillsData, clearError } = useSanity();

const loadSkills = async () => {
  try {
    const data = await fetchSkillsData();
    skills.value = data.map(skill => ({
      ...skill,
      logoUrl: skill.imageUrl,
      rating: skill.skillLevel || 75, // Default rating if not set
      title: skill.name, // Map name to title for compatibility
      level: skill.skillLevel ? `${skill.skillLevel}%` : 'Intermediate'
    }));
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

<style scoped lang="scss">
</style>
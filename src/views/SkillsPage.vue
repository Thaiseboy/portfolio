<template>
  <div class="page-container">
    <h1 class="page-title">
      <span class="text-red">Get</span> to Know My Skills &#x26A1;
    </h1>
    <ErrorBoundary :on-retry="retryFetchSkills">
      <div class="overflow-x-auto py-lg scrollbar-hide">
        <div class="inline-flex gap-lg px-lg min-w-max">
          <SkeletonLoader v-if="loading" type="list" :count="6" />
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
              class="w-[100px] h-[100px] object-contain mx-auto mb-sm transition-all duration-normal drop-shadow-md md:w-20 md:h-20 sm:w-[60px] sm:h-[60px]"
            />
            <div
              v-else
              class="w-[100px] h-[100px] flex items-center justify-center bg-gradient-to-br from-dark-border to-dark-card text-white mx-auto mb-sm rounded-full text-sm text-center md:w-20 md:h-20 sm:w-[60px] sm:h-[60px]"
            >
              <span>No logo available</span>
            </div>
            <div class="relative z-10">
              <h3
                class="text-xl font-semibold text-white mb-xs md:text-lg sm:text-base"
              >
                {{ skill.name || skill.title }}
              </h3>
              <p class="text-primary text-sm mb-md font-medium">
                {{ skill.level }}
              </p>
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
import { ref, onMounted } from "vue";
import { useSanity } from "@/composables/useSanity";
import ErrorBoundary from "@/components/ui/ErrorBoundary.vue";
import SkeletonLoader from "@/components/ui/SkeletonLoader.vue";

defineOptions({
  name: "SkillsPage",
});

const skills = ref([]);
const { loading, fetchSkills: fetchSkillsData, clearError } = useSanity();

const levelLabels = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

const loadSkills = async () => {
  try {
    const data = await fetchSkillsData();
    skills.value = data.map((skill) => ({
      ...skill,
      logoUrl: skill.imageUrl,
      title: skill.name,
      level: levelLabels[skill.level] || "Intermediate",
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

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.skill-item {
  @apply bg-dark-card rounded-lg p-md shadow-md transition-all duration-normal;
  text-align: center;
  min-width: 200px;
  position: relative;
  overflow: hidden;
}

.skill-item::before {
  content: "";
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: conic-gradient(
    from 0deg,
    transparent,
    rgba(255, 215, 0, 0.1),
    transparent
  );
  opacity: 0;
  transition: opacity 0.5s ease;
  animation: rotate 4s linear infinite;
}

.skill-item:hover {
  transform: translateY(-12px) scale(1.05);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.skill-item:hover::before {
  opacity: 1;
}

.no-skills {
  @apply flex flex-col items-center justify-center p-xxl text-center w-full;
}

.no-skills::before {
  content: "🔧";
  font-size: 4rem;
  margin-bottom: 1.5rem;
  opacity: 0.5;
}

.no-skills p {
  opacity: 0.7;
  font-size: 1.125rem;
}

@media (max-width: 768px) {
  .skill-item {
    min-width: 170px;
  }
}

@media (max-width: 576px) {
  .skill-item {
    min-width: 250px;
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

</style>

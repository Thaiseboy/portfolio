<template>
  <div class="projects-page">
    <h1 class="projects-page__title header-font font-weight-bold text-gold">
      <span class="text-red">Get</span> Inspired by my Projects &#x1F5C2;
    </h1>
    <ErrorBoundary :on-retry="retryFetchProjects">
      <div class="projects-container">
      <template v-if="loading">
        <SkeletonLoader 
          type="card" 
          v-for="n in 6" 
          :key="n"
          class="project-skeleton"
        />
      </template>
      <template v-else-if="projects.length > 0">
        <div
          v-for="project in projects"
          :key="project._id"
          class="project-item"
        >
          <img
            v-if="project.image"
            :src="project.image"
            alt="Project image"
            class="project-image"
          >
          <div class="project-details">
            <h2 class="project-title font-weight-bold">
              {{ project.title }}
            </h2>
            <p class="project-description">
              {{ project.description }}
            </p>
            <div class="project-links">
              <a
                v-if="project.url"
                :href="project.url"
                target="_blank"
                class="btn btn-danger"
              >Explore Project</a>
              <a
                v-if="project.github"
                :href="project.github"
                target="_blank"
                class="btn btn-secondary"
              >GitHub</a>
            </div>
          </div>
        </div>
      </template>
      <div v-else-if="!loading && projects.length === 0" class="no-projects">
        <p>No projects available</p>
      </div>
    </div>
  </ErrorBoundary>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSanity } from '@/composables/useSanity';
import ErrorBoundary from '@/components/ui/ErrorBoundary.vue';
import SkeletonLoader from '@/components/ui/SkeletonLoader.vue';

defineOptions({
  name: 'ProjectPage'
});

gsap.registerPlugin(ScrollTrigger);

const projects = ref([]);
const { loading, fetchProjects: fetchProjectsData, clearError } = useSanity();

const loadProjects = async () => {
  try {
    const data = await fetchProjectsData();
    projects.value = data.map(project => ({
      ...project,
      image: project.imageUrl,
      url: project.liveUrl,
      github: project.githubUrl
    }));
    setupScrollAnimations();
  } catch (error) {
    console.error("Error fetching projects:", error);
  }
};

const setupScrollAnimations = () => {
  if (window.innerWidth > 768) {
    nextTick(() => {
      projects.value.forEach((project, index) => {
        const element = document.querySelectorAll('.project-item')[index];
        if (element) {
          gsap.fromTo(
            element,
            { x: -200, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              duration: 1,
              scrollTrigger: {
                trigger: element,
                start: "top 80%",
                toggleActions: "play none none none",
              },
            }
          );
        }
      });
    });
  }
};

const retryFetchProjects = () => {
  clearError();
  loadProjects();
};

onMounted(loadProjects);
</script>

<style scoped lang="scss">
</style>

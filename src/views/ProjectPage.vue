<template>
  <div class="page-container">
    <h1 class="page-title">
      <span class="text-red">Get</span> Inspired by my Projects &#x1F5C2;
    </h1>
    <ErrorBoundary :on-retry="retryFetchProjects">
      <div class="projects-container">
      <template v-if="loading">
        <SkeletonLoader
          type="card"
          v-for="n in 6"
          :key="n"
          class="flex-[0_0_500px] h-[400px]"
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
            class="w-full h-[200px] object-cover transition-transform duration-normal"
          >
          <div class="p-6 md:p-4">
            <h2 class="text-primary text-xl font-bold mb-3 leading-tight md:text-lg">
              {{ project.title }}
            </h2>
            <div class="mb-6">
              <p
                :class="{ 'expanded': project.showFullDescription }"
                class="description-text text-white text-sm leading-relaxed mb-0 md:text-xs"
              >
                {{ project.description }}
              </p>
            </div>
            <div class="flex gap-3 flex-wrap items-center md:gap-2">
              <button
                v-if="project.description && project.description.length > 150"
                @click="toggleDescription(project)"
                class="btn-read-more text-sm px-4 py-2 rounded-md font-semibold transition-all duration-200 border-none cursor-pointer md:text-xs md:px-2.5 md:py-1.5"
              >
                {{ project.showFullDescription ? 'Show Less' : 'Read More' }}
              </button>
              <a
                v-if="project.url"
                :href="project.url"
                target="_blank"
                class="btn-explore text-sm px-4 py-2 rounded-md no-underline font-semibold transition-all duration-200 border-none md:text-xs md:px-3 md:py-2"
              >Explore Project</a>
              <a
                v-if="project.github"
                :href="project.github"
                target="_blank"
                class="btn-github text-sm px-4 py-2 rounded-md no-underline font-semibold transition-all duration-200 border-none md:text-xs md:px-3 md:py-2"
              >GitHub</a>
            </div>
          </div>
        </div>
      </template>
      <div v-else-if="!loading && projects.length === 0" class="text-center text-white p-16">
        <p class="text-lg">No projects available</p>
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
      url: project.url === null || project.url === 'null' ? '' : project.url,
      github: project.github === null || project.github === 'null' ? '' : project.github,
      showFullDescription: false
    }));

    setupScrollAnimations();
  } catch (error) {
    console.error("Error fetching projects:", error);
  }
};

const setupScrollAnimations = () => {
  if (window.innerWidth > 768) {
    nextTick(() => {
      projects.value.forEach((_, index) => {
        const element = document.querySelectorAll('.project-item')[index];
        if (element) {
          gsap.fromTo(
            element,
            { x: 50, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              duration: 0.8,
              delay: index * 0.1,
              ease: "power2.out"
            }
          );
        }
      });
    });
  }
};

const toggleDescription = (project) => {
  project.showFullDescription = !project.showFullDescription;
};

const retryFetchProjects = () => {
  clearError();
  loadProjects();
};

onMounted(loadProjects);
</script>

<style scoped>
.projects-container {
  display: flex;
  gap: 2rem;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 1rem;
  scroll-behavior: smooth;
}

.projects-container::-webkit-scrollbar {
  height: 8px;
}

.projects-container::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

.projects-container::-webkit-scrollbar-thumb {
  background: linear-gradient(45deg, #FFD700, #FF0000);
  border-radius: 4px;
}

.projects-container::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(45deg, #e6c200, #cc0000);
}

.project-item {
  flex: 0 0 500px;
  max-width: 500px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.project-item:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  border-color: rgba(255, 255, 255, 0.2);
}

.project-item:hover img {
  transform: scale(1.05);
}

.description-text {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: all 0.3s ease;
}

.description-text.expanded {
  display: block;
  -webkit-line-clamp: unset;
  overflow: visible;
}

.btn-read-more {
  background: none;
  border: 1px solid #FFD700;
  color: #FFD700;
}

.btn-read-more:hover {
  background: #FFD700;
  color: #000;
  transform: translateY(-2px);
}

.btn-explore {
  background: linear-gradient(45deg, #dc3545, #e74c3c);
  color: white;
}

.btn-explore:hover {
  background: linear-gradient(45deg, #c82333, #dc3545);
  transform: translateY(-2px);
}

.btn-github {
  background: linear-gradient(45deg, #6c757d, #5a6268);
  color: white;
}

.btn-github:hover {
  background: linear-gradient(45deg, #5a6268, #545b62);
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .projects-container {
    gap: 1rem;
    padding: 1rem;
  }

  .project-item {
    flex: 0 0 360px;
    max-width: 360px;
  }

  .description-text {
    -webkit-line-clamp: 2;
  }
}
</style>

<template>
  <div class="projects-page">
    <h1 class="projects-page__title text-gold">
      <span class="text-red">Get</span> Inspired by my Projects &#x1F5C2;
    </h1>
    <ErrorBoundary :on-retry="retryFetchProjects">
      <div class="projects-container horizontal-scroll">
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
            <h2 class="project-title">
              {{ project.title }}
            </h2>
            <div class="project-description">
              <p 
                :class="{ 'expanded': project.showFullDescription }"
                class="description-text"
              >
                {{ project.description }}
              </p>
            </div>
            <div class="project-actions">
              <button 
                v-if="project.description && project.description.length > 150"
                @click="toggleDescription(project)"
                class="btn btn-read-more"
              >
                {{ project.showFullDescription ? 'Show Less' : 'Read More' }}
              </button>
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

<style scoped lang="scss">
@import '@/assets/scss/utils/variables';
@import '@/assets/scss/utils/mixins';

.projects-page {
  padding: 2rem 1rem;
  max-width: 100vw;
  overflow-x: hidden;

  &__title {
    text-align: center;
    margin-bottom: 3rem;
    font-size: clamp(2rem, 5vw, 4rem);
    font-weight: 700;
  }
}

.projects-container {
  &.horizontal-scroll {
    display: flex;
    gap: 2rem;
    overflow-x: auto;
    overflow-y: hidden;
    padding: 1rem;
    scroll-behavior: smooth;
    
    &::-webkit-scrollbar {
      height: 8px;
    }
    
    &::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 4px;
    }
    
    &::-webkit-scrollbar-thumb {
      background: linear-gradient(45deg, $primary-color, $secondary-color);
      border-radius: 4px;
      
      &:hover {
        background: linear-gradient(45deg, darken($primary-color, 10%), darken($secondary-color, 10%));
      }
    }
    
    scrollbar-width: thin;
    scrollbar-color: $primary-color rgba(255, 255, 255, 0.1);
  }
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
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    border-color: rgba(255, 255, 255, 0.2);
  }
}

.project-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  transition: transform 0.3s ease;
  
  .project-item:hover & {
    transform: scale(1.05);
  }
}

.project-details {
  padding: 1.5rem;
}

.project-title {
  color: $primary-color;
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  line-height: 1.3;
}

.project-description {
  margin-bottom: 1.5rem;
  
  .description-text {
    color: $text-color;
    font-size: 0.9rem;
    line-height: 1.5;
    margin-bottom: 0;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    transition: all 0.3s ease;
    
    &.expanded {
      display: block;
      -webkit-line-clamp: unset;
      line-clamp: unset;
      overflow: visible;
    }
  }
}

.project-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  align-items: center;
  
  .btn {
    font-size: 0.85rem;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    text-decoration: none;
    font-weight: 600;
    transition: all 0.2s ease;
    border: none;
    cursor: pointer;
    
    &.btn-read-more {
      background: none;
      border: 1px solid $primary-color;
      color: $primary-color;
      
      &:hover {
        background: $primary-color;
        color: #000;
        transform: translateY(-2px);
      }
    }
    
    &.btn-danger {
      background: linear-gradient(45deg, #dc3545, #e74c3c);
      color: white;
      
      &:hover {
        background: linear-gradient(45deg, #c82333, #dc3545);
        transform: translateY(-2px);
      }
    }
    
    &.btn-secondary {
      background: linear-gradient(45deg, #6c757d, #5a6268);
      color: white;
      
      &:hover {
        background: linear-gradient(45deg, #5a6268, #545b62);
        transform: translateY(-2px);
      }
    }
  }
}

.project-skeleton {
  flex: 0 0 500px;
  height: 400px;
}

.no-projects {
  text-align: center;
  color: $text-color;
  padding: 4rem 2rem;
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .projects-page {
    padding: 1rem 0.5rem;
    
    &__title {
      margin-bottom: 2rem;
    }
  }
  
  .projects-container.horizontal-scroll {
    gap: 1rem;
    padding: 1rem;
  }
  
  .project-item {
    flex: 0 0 360px;
    max-width: 360px;
  }
  
  .project-details {
    padding: 1rem;
  }
  
  .project-title {
    font-size: 1.1rem;
  }
  
  .project-description {
    .description-text {
      font-size: 0.85rem;
      -webkit-line-clamp: 2;
      line-clamp: 2;
    }
  }
  
  .project-actions {
    gap: 0.5rem;
    
    .btn {
      font-size: 0.8rem;
      padding: 0.4rem 0.8rem;
      
      &.btn-read-more {
        font-size: 0.75rem;
        padding: 0.3rem 0.6rem;
      }
    }
  }
}
</style>

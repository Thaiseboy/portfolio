<template>
  <div class="page-container">
    <h1 class="page-title">
      <span class="text-red">Get</span> Inspired by my Projects &#x1F5C2;
    </h1>
    <ErrorBoundary :on-retry="retryFetchProjects">
      <div class="section-shell">
        <p class="section-intro">
          A selection of work where structure, frontend detail and practical logic come together.
        </p>

        <div v-if="loading" class="projects-grid">
          <SkeletonLoader
            v-for="n in 6"
            :key="n"
            type="card"
            class="project-skeleton"
          />
        </div>

        <div v-else-if="projects.length > 0" class="projects-grid">
          <article
            v-for="project in projects"
            :key="project._id"
            class="project-card surface-panel surface-hover"
          >
            <div class="project-media">
              <img
                v-if="project.image"
                :src="project.image"
                :alt="`${project.title} preview`"
              >
              <div v-else class="project-media-fallback">
                <span>{{ getInitials(project.title) }}</span>
              </div>
            </div>

            <div class="project-body">
              <h2>{{ project.title }}</h2>
              <p
                :class="{ expanded: project.showFullDescription }"
                class="project-description"
              >
                {{ project.description }}
              </p>

              <button
                v-if="project.description && project.description.length > 150"
                @click="toggleDescription(project)"
                class="project-read-more"
              >
                {{ project.showFullDescription ? 'Show Less' : 'Read More' }}
              </button>
            </div>

            <div class="project-actions">
              <a
                v-if="project.url"
                :href="project.url"
                target="_blank"
                rel="noopener noreferrer"
                class="project-link project-link-primary"
              >
                View project
              </a>
              <a
                v-if="project.github"
                :href="project.github"
                target="_blank"
                rel="noopener noreferrer"
                class="project-link"
              >
                GitHub
              </a>
            </div>
          </article>
        </div>

        <div v-else-if="!loading && projects.length === 0" class="empty-state surface-panel">
          <p>No projects available</p>
        </div>
      </div>
    </ErrorBoundary>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useSanity } from '@/composables/useSanity';
import { getInitials, normalizeProject } from '@/utils/sanityMappers';
import ErrorBoundary from '@/components/ui/ErrorBoundary.vue';
import SkeletonLoader from '@/components/ui/SkeletonLoader.vue';

defineOptions({
  name: 'ProjectPage'
});

const projects = ref([]);
const { loading, fetchProjects: fetchProjectsData, clearError } = useSanity();

const loadProjects = async () => {
  try {
    const data = await fetchProjectsData();

    projects.value = data.map(normalizeProject);
  } catch (error) {
    console.error("Error fetching projects:", error);
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
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.25rem;
}

.project-card {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  overflow: hidden;
}

.project-media {
  height: 210px;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.24);
}

.project-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.project-card:hover .project-media img {
  transform: scale(1.05);
}

.project-media-fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.project-media-fallback span {
  color: #FFD700;
  font-size: 3rem;
  font-weight: 800;
}

.project-body {
  flex: 1;
  padding: 1.5rem 1.5rem 1rem;
}

.project-body h2 {
  margin: 0 0 0.75rem;
  color: #FFD700;
  font-size: 1.25rem;
  line-height: 1.3;
}

.project-description {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  margin: 0;
  color: rgba(255, 255, 255, 0.78);
  overflow: hidden;
  font-size: 0.95rem;
  line-height: 1.7;
}

.project-description.expanded {
  display: block;
  -webkit-line-clamp: unset;
  overflow: visible;
}

.project-read-more {
  margin-top: 0.75rem;
  padding: 0;
  background: none;
  border: 0;
  color: #FFD700;
  cursor: pointer;
  font-weight: 700;
}

.project-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  padding: 0 1.5rem 1.5rem;
}

.project-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 40px;
  padding: 0.55rem 0.9rem;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 999px;
  color: #fff;
  font-size: 0.85rem;
  font-weight: 700;
  text-decoration: none;
  transition: transform 0.3s ease, border-color 0.3s ease, background 0.3s ease;
}

.project-link-primary {
  background: #FFD700;
  border-color: #FFD700;
  color: #111;
}

.project-link:hover {
  transform: translateY(-2px);
  border-color: rgba(255, 215, 0, 0.55);
}

.project-skeleton {
  min-height: 430px;
}

@media (max-width: 768px) {
  .projects-grid {
    grid-template-columns: 1fr;
  }

  .project-media {
    height: 190px;
  }

  .project-description {
    -webkit-line-clamp: 2;
  }
}
</style>

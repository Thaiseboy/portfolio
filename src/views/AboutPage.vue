<template>
  <div class="page-container">
    <h1 class="page-title">
      <span class="text-red">Get</span> to know me &#128526;
    </h1>

    <div class="max-w-screen-xl mx-auto">
      <ErrorBoundary :on-retry="retryFetchPhotos">
        <div class="photo-gallery mb-xl">
        <SkeletonLoader
          v-if="loading"
          type="list"
          :count="4"
        />
        <div
          v-else-if="photos.length > 0"
          v-for="photo in photos"
          :key="photo.id"
          class="photo-box"
        >
          <img
            :src="photo.url"
            :alt="photo.title"
            class="photo-image"
          >
        </div>
        <div v-else-if="!loading && photos.length === 0" class="flex flex-col items-center justify-center p-xxl text-center">
          <p>No photos available</p>
        </div>
      </div>
    </ErrorBoundary>

    <div class="text-white leading-relaxed space-y-4 text-center px-lg md:px-md">
      <p>
        Hi, I'm Master Supakon Karanyawad, a <span class="text-red">29</span> years old passionate Frontend Developer with a creative mindset and a strong drive for continuous growth.
        I specialize in building modern, maintainable, and user-friendly web applications that seamlessly combine functionality with clean, efficient design.
      </p>
      <p>
        My journey into web development started with a fascination for the perfect balance between creativity and technology.
        Over the years, I've gained solid experience in both frontend and backend development, working with a diverse range of technologies including:
      </p>
      <div class="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto my-6">
        <span class="tech-badge">HTML5</span>
        <span class="tech-badge">CSS3</span>
        <span class="tech-badge">Bootstrap 5</span>
        <span class="tech-badge">Tailwind</span>
        <span class="tech-badge">JavaScript</span>
        <span class="tech-badge">TypeScript</span>
        <span class="tech-badge">PHP</span>
        <span class="tech-badge">Laravel</span>
        <span class="tech-badge">Vue.js</span>
      </div>
      <p class="mt-4">
        Currently, I work at <span class="text-gold">Paramedia B.V.</span>, where I balance refactoring legacy PHP applications (Zend Framework 1) with building new, innovative features.
        My role encompasses improving code structure and performance, developing modern solutions, and creating exceptional user experiences through clean, efficient code.
      </p>
    </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useSanity } from '@/composables/useSanity';
import ErrorBoundary from '@/components/ui/ErrorBoundary.vue';
import SkeletonLoader from '@/components/ui/SkeletonLoader.vue';

defineOptions({
    name: 'AboutPage'
});

const photos = ref([]);
const { loading, fetchPhotos, clearError } = useSanity();

const loadPhotos = async () => {
    try {
        const data = await fetchPhotos();
        if (data && data.length > 0) {
            photos.value = data.map((photo, index) => ({
                id: photo._id || index,
                url: photo.imageUrl,
                title: `Photo ${index + 1}`
            })).filter(photo => photo.url); // Filter out photos without URLs
        }
    } catch (err) {
        console.error('Error fetching photos:', err);
    }
};

const retryFetchPhotos = () => {
    clearError();
    loadPhotos();
};

onMounted(loadPhotos);
</script>

<style scoped>
.photo-gallery {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 1rem;
  scroll-behavior: smooth;
  scrollbar-width: thin;
  scrollbar-color: #FFD700 rgba(255, 255, 255, 0.1);
}

.photo-gallery::-webkit-scrollbar {
  height: 8px;
}

.photo-gallery::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

.photo-gallery::-webkit-scrollbar-thumb {
  background: linear-gradient(45deg, #FFD700, #FF0000);
  border-radius: 4px;
}

.photo-gallery::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(45deg, #e6c200, #cc0000);
}

.photo-box {
  flex: 0 0 350px;
  max-width: 350px;
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.photo-box:hover {
  transform: translateY(-8px) scale(1.05);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
}

.photo-image {
  width: 100%;
  height: 350px;
  object-fit: cover;
  border-radius: 12px;
  transition: transform 0.3s ease;
}

.photo-box:hover .photo-image {
  transform: scale(1.1);
}

@media (max-width: 768px) {
  .photo-box {
    flex: 0 0 250px;
    max-width: 250px;
  }

  .photo-image {
    height: 250px;
  }
}

.tech-badge {
  display: inline-block;
  padding: 0.5rem 1.25rem;
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.15), rgba(255, 0, 0, 0.15));
  border: 2px solid rgba(255, 215, 0, 0.5);
  border-radius: 50px;
  color: #FFD700;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  cursor: default;
  backdrop-filter: blur(10px);
}

.tech-badge:hover {
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.25), rgba(255, 0, 0, 0.25));
  border-color: #FFD700;
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3);
}

@media (max-width: 768px) {
  .tech-badge {
    padding: 0.4rem 1rem;
    font-size: 0.875rem;
  }
}
</style>
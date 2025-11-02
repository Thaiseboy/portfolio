<template>
  <div class="about-page">
    <h1 class="about-page__title header-font font-weight-bold text-gold">
      <span class="text-red">Get</span> to know me &#128526;
    </h1>
    
    <div class="about-page__content">
      <ErrorBoundary :on-retry="retryFetchPhotos">
        <div class="photo-gallery">
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
        <div v-else-if="!loading && photos.length === 0" class="no-photos">
          <p>No photos available</p>
        </div>
      </div>
    </ErrorBoundary>
        
    <div class="about-page__text text-white">
      <p>
        Hi, I'm Master Supakon Karanyawad, <span class="text-red">29</span> years old — a passionate Frontend Developer with a creative mindset and a strong drive for continuous growth.
        I focus on building modern, maintainable, and user-friendly web applications that combine functionality with clean and efficient design.
      </p>
      <p>
        My journey into web development began from a fascination with the balance between creativity and technology. Over the years, I've gained solid experience in both front-end and back-end development, working with technologies such as:
        <span class="text-red">&#x21A3;</span><span class="text-gold">HTML5</span>
        <span class="text-red">&#x21A3;</span><span class="text-gold">CSS3</span>
        <span class="text-red">&#x21A3;</span><span class="text-gold">Bootstrap 5</span>
        <span class="text-red">&#x21A3;</span><span class="text-gold">Tailwind</span>
        <span class="text-red">&#x21A3;</span><span class="text-gold">JavaScript</span>
        <span class="text-red">&#x21A3;</span><span class="text-gold">TypeScript</span>
        <span class="text-red">&#x21A3;</span><span class="text-gold">PHP</span>
        <span class="text-red">&#x21A3;</span><span class="text-gold">Laravel</span>
        <span class="text-red">&#x21A3;</span><span class="text-gold">Vue.js</span>
      </p>
      <p>
        I'm currently working at Paramedia B.V., where I focus on refactoring and modernizing legacy PHP (Zend Framework 1) applications.
        My work involves improving the structure, maintainability, and performance of existing systems, as well as developing new features and enhancing the user experience using modern tools like Docker to optimize the development workflow.
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

<style scoped lang="scss">
</style>
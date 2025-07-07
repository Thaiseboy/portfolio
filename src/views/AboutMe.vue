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
        Hi, I’m <span class="text-red">28</span> years old, a passionate front-end developer with a creative mindset and a strong drive for self-improvement. 
        I excel at teamwork and thrive in solving complex problems by crafting innovative and tailored solutions.
      </p>
      <p>
        My journey into front-end development began when I sought new challenges, and I quickly fell in love with the creative and technical aspects of web development. 
        Over the past year, I have built expertise in both front-end and back-end technologies, including:
        <span class="text-red">&#x21A3;</span><span class="text-gold">HTML5</span> 
        <span class="text-red">&#x21A3;</span><span class="text-gold">CSS3</span> 
        <span class="text-red">&#x21A3;</span><span class="text-gold">JavaScript</span> 
        <span class="text-red">&#x21A3;</span><span class="text-gold">jQuery</span> 
        <span class="text-red">&#x21A3;</span><span class="text-gold">PHP</span> 
        <span class="text-red">&#x21A3;</span><span class="text-gold">MySQL</span> 
        <span class="text-red">&#x21A3;</span><span class="text-gold">Laravel</span> 
        <span class="text-red">&#x21A3;</span><span class="text-gold">Vue.js</span>.
      </p>
      <p>
        With these skills, I create end-to-end web applications that are both visually appealing and technically robust, managing everything from user interfaces to server-side logic and database design.
      </p>
      <p>
        I am currently working as a freelancer on various client projects, continually broadening my skill set and staying up-to-date with the latest technologies. 
        My approach combines creativity, problem-solving, and a commitment to delivering solutions that align with my clients’ goals. 
        Above all, I am dedicated to continuous learning, always seeking to enhance my abilities and push the boundaries of what I can achieve.
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
    name: 'AboutMe'
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
// All styles are now handled by SCSS partials in /assets/scss/pages/_about.scss
// Custom component-specific styles can be added here if needed
</style>
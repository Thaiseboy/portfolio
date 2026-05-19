<template>
  <div class="page-container">
    <h1 class="page-title">
      <span class="text-red">Get</span> to know me &#128526;
    </h1>

    <div class="max-w-screen-xl mx-auto">
      <ErrorBoundary :on-retry="retryFetchPhotos">
        <div class="photo-gallery mb-xl">
          <SkeletonLoader v-if="loading" type="list" :count="4" />
          <div
            v-else-if="photos.length > 0"
            v-for="photo in photos"
            :key="photo.id"
            class="photo-box"
          >
            <img :src="photo.url" :alt="photo.title" class="photo-image" />
          </div>
          <div
            v-else-if="!loading && photos.length === 0"
            class="flex flex-col items-center justify-center p-xxl text-center"
          >
            <p>No photos available</p>
          </div>
        </div>
      </ErrorBoundary>

      <div class="about-layout">
        <div class="about-intro">
          <p class="about-eyebrow">
            Frontend developer based in the Netherlands
          </p>
          <h2>
            Building clear, maintainable interfaces with a practical mindset.
          </h2>
          <p>
            I'm Master Supakon Karanyawad, a frontend developer who likes
            turning complex ideas into clean, usable web experiences. I care
            about structure, performance, and interfaces that feel natural to
            use.
          </p>
          <p>
            At Paramedia B.V. I work with both modern frontend development and
            legacy PHP applications, including Zend Framework 1. That mix taught
            me to improve systems carefully while still moving features forward.
          </p>
        </div>

        <div class="about-highlights">
          <article class="about-card">
            <span>01</span>
            <h3>Focus</h3>
            <p>
              Modern frontend work, reusable components, responsive layouts, and
              clean UI behavior.
            </p>
          </article>
          <article class="about-card">
            <span>02</span>
            <h3>Experience</h3>
            <p>
              Maintaining existing business systems while building new features
              with a better structure.
            </p>
          </article>
          <article class="about-card">
            <span>03</span>
            <h3>Mindset</h3>
            <p>
              Practical decisions, readable code, steady refactoring, and
              attention to user experience.
            </p>
          </article>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useSanity } from "@/composables/useSanity";
import ErrorBoundary from "@/components/ui/ErrorBoundary.vue";
import SkeletonLoader from "@/components/ui/SkeletonLoader.vue";

defineOptions({
  name: "AboutPage",
});

const photos = ref([]);
const { loading, fetchPhotos, clearError } = useSanity();

const loadPhotos = async () => {
  try {
    const data = await fetchPhotos();
    if (data && data.length > 0) {
      photos.value = data
        .map((photo, index) => ({
          id: photo._id || index,
          url: photo.imageUrl,
          title: `Photo ${index + 1}`,
        }))
        .filter((photo) => photo.url); // Filter out photos without URLs
    }
  } catch (err) {
    console.error("Error fetching photos:", err);
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
  scrollbar-color: #ffd700 rgba(255, 255, 255, 0.1);
}

.photo-gallery::-webkit-scrollbar {
  height: 8px;
}

.photo-gallery::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

.photo-gallery::-webkit-scrollbar-thumb {
  background: linear-gradient(45deg, #ffd700, #ff0000);
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

.about-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(320px, 0.85fr);
  gap: 2rem;
  align-items: stretch;
  padding: 0 1.5rem;
}

.about-intro,
.about-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  backdrop-filter: blur(10px);
}

.about-intro {
  padding: 2rem;
  color: #fff;
}

.about-eyebrow {
  margin-bottom: 0.75rem;
  color: #ffd700;
  font-size: 0.9rem;
  font-weight: 700;
  text-transform: uppercase;
}

.about-intro h2 {
  max-width: 760px;
  margin-bottom: 1.25rem;
  color: #fff;
  font-size: clamp(1.75rem, 3vw, 2.75rem);
  line-height: 1.1;
}

.about-intro p {
  margin-bottom: 1rem;
  color: rgba(255, 255, 255, 0.82);
  font-size: 1rem;
  line-height: 1.8;
}

.about-intro p:last-child {
  margin-bottom: 0;
}

.about-highlights {
  display: grid;
  gap: 1rem;
}

.about-card {
  padding: 1.5rem;
  color: #fff;
  transition:
    transform 0.3s ease,
    border-color 0.3s ease;
}

.about-card:hover {
  transform: translateY(-4px);
  border-color: rgba(255, 215, 0, 0.45);
}

.about-card span {
  color: #ffd700;
  font-weight: 800;
}

.about-card h3 {
  margin: 0.35rem 0 0.5rem;
  color: #fff;
  font-size: 1.15rem;
}

.about-card p {
  margin: 0;
  color: rgba(255, 255, 255, 0.75);
  line-height: 1.6;
}

@media (max-width: 768px) {
  .photo-box {
    flex: 0 0 250px;
    max-width: 250px;
  }

  .photo-image {
    height: 250px;
  }

  .about-layout {
    grid-template-columns: 1fr;
    padding: 0 1rem;
  }

  .about-intro {
    padding: 1.5rem;
  }

  .about-card {
    padding: 1.25rem;
  }
}
</style>

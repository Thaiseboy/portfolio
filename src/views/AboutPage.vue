<template>
  <div class="page-container">
    <h1 class="page-title">
      <span class="text-red">Get</span> to know me &#128526;
    </h1>

    <div class="about-shell">
      <div class="about-layout">
        <ErrorBoundary :on-retry="retryFetchPhotos">
          <div class="about-visual">
            <SkeletonLoader v-if="loading" type="list" :count="4" />
            <template v-else-if="photos.length > 0">
              <figure
                v-for="photo in photos"
                :key="photo.id"
                class="photo-tile"
              >
                <img :src="photo.url" :alt="photo.title" />
              </figure>
            </template>
            <div
              v-else-if="!loading && photos.length === 0"
              class="empty-photos"
            >
              <p>No photos available</p>
            </div>
          </div>
        </ErrorBoundary>

        <section class="about-content">
          <p class="about-eyebrow">
            Frontend developer with broad development experience
          </p>
          <h2>
            Dynamic web applications that are clear, fast and easy to use.
          </h2>
          <div class="about-copy">
            <p>
              I'm Master Supakon Karanyawad, a frontend developer with a passion
              for building dynamic web applications that feel clear, fast and
              easy to use.
            </p>
            <p>
              In frontend development I work a lot with React, TypeScript and
              Tailwind. In my current work I also maintain legacy frontend and
              backend code with PHP, Zend Framework 1 and Bootstrap 5,
              experience with Laravel.
            </p>
            <p>
              That combination helps me understand the full flow of a project,
              from interface to backend logic, with a focus on reusable
              components, clean structure, performance and maintainable code.
            </p>
          </div>
        </section>
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
        .filter((photo) => photo.url);
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
.about-shell {
  max-width: 1120px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.about-layout {
  display: grid;
  grid-template-columns: minmax(280px, 0.9fr) minmax(0, 1.1fr);
  gap: 1rem;
  align-items: stretch;
}

.about-content,
.photo-tile,
.empty-photos {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  backdrop-filter: blur(10px);
}

.about-content {
  position: relative;
  overflow: hidden;
  padding: 2rem;
  color: #fff;
}

.about-content::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.08), transparent 55%);
  pointer-events: none;
}

.about-visual {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.about-visual .photo-tile:first-of-type {
  grid-row: span 2;
}

.about-eyebrow {
  position: relative;
  z-index: 1;
  margin-bottom: 0.75rem;
  color: #ffd700;
  font-size: 0.9rem;
  font-weight: 700;
  text-transform: uppercase;
}

.about-content h2 {
  position: relative;
  z-index: 1;
  max-width: 760px;
  margin-bottom: 1.25rem;
  color: #fff;
  font-size: clamp(1.75rem, 3vw, 2.75rem);
  line-height: 1.1;
}

.about-copy {
  position: relative;
  z-index: 1;
}

.about-copy {
  max-width: 720px;
}

.about-copy p {
  margin-bottom: 1rem;
  color: rgba(255, 255, 255, 0.82);
  font-size: 1rem;
  line-height: 1.8;
}

.about-copy p:last-child {
  margin-bottom: 0;
}

.photo-tile {
  min-height: 190px;
  margin: 0;
  overflow: hidden;
}

.photo-tile img {
  width: 100%;
  height: 100%;
  min-height: 190px;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.photo-tile:hover img {
  transform: scale(1.05);
}

.empty-photos {
  grid-column: 1 / -1;
  padding: 2rem;
  text-align: center;
}

.empty-photos p {
  margin: 0;
  color: rgba(255, 255, 255, 0.72);
}

@media (max-width: 768px) {
  .about-shell {
    padding: 0 1rem;
  }

  .about-layout {
    grid-template-columns: 1fr;
  }

  .about-content {
    padding: 1.5rem;
  }

  .about-visual {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .photo-tile,
  .photo-tile img {
    min-height: 180px;
  }
}

@media (max-width: 520px) {
  .about-visual {
    grid-template-columns: 1fr;
  }

  .about-visual .photo-tile:first-of-type {
    grid-row: auto;
  }

  .photo-tile,
  .photo-tile img {
    min-height: 240px;
  }
}
</style>

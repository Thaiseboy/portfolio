<template>
  <div class="page-container">
    <h1 class="page-title">
      <span class="text-red">Get</span> to know me &#128526;
    </h1>

    <div class="about-shell">
      <div class="about-layout">
        <section class="profile-panel">
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
              backend code with PHP, Zend Framework 1 and Bootstrap 5, and I
              have backend experience with Laravel.
            </p>
            <p>
              That combination helps me understand the full flow of a project,
              from interface to backend logic, with a focus on reusable
              components, clean structure, performance and maintainable code.
            </p>
          </div>

          <div class="profile-meta">
            <div>
              <span>Current role</span>
              <strong>Frontend Developer</strong>
            </div>
            <div>
              <span>Work style</span>
              <strong>Scalable and maintainable</strong>
            </div>
          </div>
        </section>
      </div>

      <ErrorBoundary :on-retry="retryFetchPhotos">
        <div class="photo-strip">
          <SkeletonLoader v-if="loading" type="list" :count="4" />
          <template v-else-if="photos.length > 0">
            <figure v-for="photo in photos" :key="photo.id" class="photo-tile">
              <img :src="photo.url" :alt="photo.title" />
            </figure>
          </template>
          <div v-else-if="!loading && photos.length === 0" class="empty-photos">
            <p>No photos available</p>
          </div>
        </div>
      </ErrorBoundary>
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
  max-width: 920px;
  margin: 0 auto;
}

.profile-panel,
.photo-tile,
.empty-photos {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  backdrop-filter: blur(10px);
}

.profile-panel {
  position: relative;
  overflow: hidden;
  padding: 2rem;
  color: #fff;
}

.profile-panel::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.08), transparent 55%);
  pointer-events: none;
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

.profile-panel h2 {
  position: relative;
  z-index: 1;
  max-width: 760px;
  margin-bottom: 1.25rem;
  color: #fff;
  font-size: clamp(1.75rem, 3vw, 2.75rem);
  line-height: 1.1;
}

.about-copy,
.profile-meta {
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

.profile-meta {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
  margin-top: 2rem;
}

.profile-meta div {
  padding: 1rem;
  background: rgba(0, 0, 0, 0.22);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
}

.profile-meta span {
  display: block;
  margin-bottom: 0.35rem;
  color: rgba(255, 255, 255, 0.55);
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
}

.profile-meta strong {
  color: #ffd700;
  font-size: 0.95rem;
}

.photo-strip {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.photo-tile {
  min-height: 230px;
  margin: 0;
  overflow: hidden;
}

.photo-tile img {
  width: 100%;
  height: 100%;
  min-height: 230px;
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

  .profile-panel {
    padding: 1.5rem;
  }

  .profile-meta {
    grid-template-columns: 1fr;
  }

  .photo-strip {
    grid-template-columns: 1fr;
  }

  .photo-tile,
  .photo-tile img {
    min-height: 260px;
  }
}
</style>

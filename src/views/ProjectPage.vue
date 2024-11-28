<template>
  <h1 class="mb-5 text-gold text-center header-font font-weight-bold">
    <span class="text-red">Get</span> Inspired by my Projects &#x1F5C2;
  </h1>
  <div class="projects-container">
    <div v-for="project in projects" :key="project._id" class="project-item">
      <img v-if="project.image" :src="project.image" alt="Project afbeelding" class="project-image" />
      <div class="project-details">
        <h2 class="project-title font-weight-bold">{{ project.title }}</h2>
        <p class="project-description">{{ project.description }}</p>
        <div class="project-links">
          <a v-if="project.url" :href="project.url" target="_blank" class="btn btn-danger">Explore Project</a>
          <a v-if="project.github" :href="project.github" target="_blank" class="btn btn-secondary">GitHub</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import sanityClient from "@/sanityClient"; 

gsap.registerPlugin(ScrollTrigger);

export default {
  name: 'ProjectPage',
  data() {
    return {
      projects: [],
    };
  },
  methods: {
    async fetchProjects() {
      this.projects = await sanityClient.fetch(`*[_type == "project"]{
        _id,
        title,
        description,
        "image": image.asset->url,
        url,
        github
      }`);
      this.setupScrollAnimations();
    },
    setupScrollAnimations() {
      // Gebruik een eenvoudige animatie voor desktop, maar voor mobiel zorg dat projecten direct zichtbaar zijn
      if (window.innerWidth > 768) {
        this.$nextTick(() => {
          this.projects.forEach((project, index) => {
            const element = document.querySelectorAll('.project-item')[index];
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
          });
        });
      }
    },
  },
  mounted() {
    this.fetchProjects();
  }
};
</script>

<style scoped>
.projects-container {
  display: grid;
  grid-template-columns: repeat(1, 1fr); /* Standaard één kolom */
  gap: 20px; /* Afstand tussen de blokken */
  padding: 20px;
}

/* Project-item stijl */
.project-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #333;
  border-radius: 10px;
  overflow: hidden;
  color: white;
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.project-item:hover {
  transform: scale(1.03);
}

/* Project afbeelding stijl */
.project-image {
  width: 100%;
  height: auto;
  object-fit: cover;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

/* Project details stijl */
.project-details {
  padding: 20px;
  text-align: center;
}

.project-title {
  font-size: 2rem;
  margin-bottom: 10px;
  color: #FFD700;
}

.project-description {
  margin-bottom: 20px;
  color: #ddd;
}

.project-links {
  display: flex;
  justify-content: center;
  gap: 15px;
}

.project-links a {
  padding: 10px 15px;
  color: #FFD700;
  text-decoration: none;
  border: 1px solid #FFD700;
  border-radius: 5px;
  transition: all 0.3s;
}

.project-links a:hover {
  color: #222;
  background-color: #FFD700;
  border-color: #FFD700;
}

/* Media Queries voor tablets en grote schermen */
@media (min-width: 768px) {
  .projects-container {
    grid-template-columns: repeat(2, 1fr); /* Twee kolommen */
  }
}

@media (min-width: 1200px) {
  .projects-container {
    grid-template-columns: repeat(3, 1fr); /* Drie kolommen op extra grote schermen */
  }
}

/* Media Queries voor mobiele telefoons */
@media (max-width: 480px) {
  .projects-container {
    grid-template-columns: repeat(1, 1fr); /* Eén kolom voor telefoons */
  }

  .project-title {
    font-size: 1.5rem;
  }

  .project-description {
    font-size: 0.9rem;
  }

  .project-links a {
    font-size: 0.8rem;
    padding: 8px;
  }
}
</style>

<template>
  <div class="projects-container">
    <h1 class="mb-5 text-gold text-center header-font font-weight-bold">Projects &#x1F5C2;</h1>
    <div v-for="project in projects" :key="project._id" class="project-item">
      <img v-if="project.image" :src="project.image" alt="Project afbeelding" class="project-image"/>
      <div class="project-details">
        <h2 class="project-title font-weight-bold">{{ project.title }}</h2>
        <p class="project-description">{{ project.description }}</p>
        <div class="project-links">
          <a v-if="project.url" :href="project.url" target="_blank" class="text-gold">Bekijk project</a>
          <a v-if="project.github" :href="project.github" target="_blank" class="text-gold">GitHub</a>
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
  padding: 20px;
}

.project-item {
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  background-color: #333;
  border-radius: 10px;
  overflow: hidden;
  color: white;
  opacity: 1; 
  transform: translateX(0); 
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.project-image {
  width: 200px;
  height: 200px;
  object-fit: cover;
  margin-right: 20px;
  border-radius: 10px;
}

.project-details {
  flex: 1;
}

.project-title {
  font-size: 2rem;
  margin-bottom: 10px;
  color: #FFD700;
}

.project-description {
  margin-bottom: 10px;
  color: #ddd;
}

.project-links a {
  margin-right: 15px;
  color: #FFD700;
  text-decoration: none;
  transition: color 0.3s;
}

.project-links a:hover {
  color: red;
  border-bottom: 2px solid white;
}

/* Media queries voor mobiel */
@media (max-width: 640px) {
  .header-font {
    font-size:3rem;
  }
  .project-item {
    flex-direction: column;
    text-align: center;
    transform: none; 
  }

  .project-title {
    order: -1;
    margin-bottom: 10px;
  }

  .project-image {
    margin: 0 auto 20px auto;
    width: 100%;
    height: auto;
  }

  .project-details {
    margin-top: 10px;
  }

  .project-links a {
    display: block; 
    margin: 10px 0;
  }
}
</style>

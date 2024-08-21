<template>
  <h1 class="h1 mb-5 text-gold text-center header-font font-weight-bold">Skills</h1>
  <div class="skills-container">
    <div class="skills-wrapper">
      <div
        v-for="skill in skills"
        :key="skill._id"
        :id="`skill-${skill._id}`"
        class="skill-item"
      >
        <!-- Controleer of logo bestaat voordat je het weergeeft -->
<img v-if="skill.logoUrl" 
     :src="skill.logoUrl" 
     alt="logo" 
     class="skill-logo"/>
        <div v-else class="no-logo">
          <!-- Alternatieve weergave als er geen logo is -->
          <span>Geen logo beschikbaar</span>
        </div>
        <div class="skill-details">
          <h3>{{ skill.name }}</h3>
          <p>{{ skill.level }}</p>
          <div class="progress">
            <div class="progress-bar bg-warning" role="progressbar" :style="{width: skill.rating + '%'}" :aria-valuenow="skill.rating" aria-valuemin="0" aria-valuemax="100">{{ skill.rating }}%</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import sanityClient from "@/sanityClient";

export default {
  name: 'SkillsPage',
  data() {
    return {
      skills: []
    };
  },
  methods: {
async fetchSkills() {
  this.skills = await sanityClient.fetch(`*[_type == "skill"]{
    _id,
    name,
    level,
    "logoUrl": logo.asset->url,  // Haal de URL van het logo op
    rating
  }`);
  console.log(this.skills);
}

  },
  mounted() {
    this.fetchSkills();
  }
};
</script>

<style scoped>
.skills-container {
  overflow-x: auto;
  white-space: nowrap;
  padding: 20px;
  background: linear-gradient(to bottom, rgb(29,29,29), rgb(80,80,80));
  scrollbar-width: none; /* Voor Firefox */
  -ms-overflow-style: none;  /* Voor Internet Explorer en Edge */
}

.skills-container::-webkit-scrollbar {
  display: none; /* Voor Chrome, Safari en Opera */
}

.skills-wrapper {
  display: inline-flex;
}

.skill-item {
  width: 200px;
  margin-right: 15px;
  padding: 15px;
  background-color: #333;
  border-radius: 20%;
  text-align: center;
  transition: transform 0.3s ease, opacity 0.3s ease;
  color: white;
}

.skill-item:hover {
  transform: scale(1.1);
  opacity: 1;
}

.skill-logo {
  width: auto;
  height: 100px;
  object-fit: contain;
  margin-bottom: 5px;
}

.no-logo {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #555;
  color: #FFF;
  margin-bottom: 10px;
  border-radius: 50%;
}

.skill-details h3 {
  font-size: 1.2rem;
  margin: 10px 0 5px;
}

.skill-details p {
  margin: 0;
  color: #FFD700;
}

.progress-bar {
  font-weight: bold;
  line-height: 20px;
  margin-top: 5px;
}

/* Media queries voor mobiel */
@media (max-width: 767px) {
  .skills-container {
    padding: 10px;
  }

  .skill-item {
    width: 150px;
    margin-right: 10px;
    padding: 10px;
  }

  .skill-logo {
    height: 70px;
  }

  .skill-details h3 {
    font-size: 1rem;
  }

  .skill-details p {
    font-size: 0.9rem;
  }

  .progress-bar {
    font-size: 0.9rem;
  }
}
</style>
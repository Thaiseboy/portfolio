<template>
  <div class="container">
    <div class="d-flex flex-column align-items-center justify-content-center py-5 mt-n3">
      <div class="text-center">
        <h1 class="mb-2 text-white header-font font-weight-bold font-big">
          <span class="text-red font-weight-bold">Nice </span>to meet you! &#x1F601;
        </h1>
        <h2 class="text-gold mb-2 text-font">Hi, My name is Master Supakon Karanyawad</h2>
        <h2 class="text-gold text-font">
          but you can call me
          <span class="text-red font-weight-bold">Get &#x1F680;</span>
        </h2>
        <!-- Afbeelding -->
        <img
          src="@/assets/foto/get.jpeg"
          alt="Master Supakon"
          class="img-small mt-3"
        />
      <div class="text-white">
        <p>
          Based in the <span class="text-gold">Netherlands</span>, I'm a 
          <span class="text-red">front-end developer</span> &#x1F4BB;
        </p>
      </div>
        <!-- Social Media Icons -->
        <div class="social-icons mt-3 d-flex justify-content-center">
          <a
            href="https://www.linkedin.com/in/get-ms-karanyawad"
            target="_blank"
            class="text-gold me-3 icon-hover"
          >
            <i class="bi bi-linkedin" style="font-size: 50px"></i>
          </a>
          <a
            href="https://github.com/Thaiseboy/Hi-"
            target="_blank"
            class="text-gold me-3 icon-hover"
          >
            <i class="bi bi-github" style="font-size: 50px"></i>
          </a>
        </div>
      </div>
    </div>

<div class="tt text-center mt-4 text-white">
  <p>
    I am <span class="text-red">28</span> years old. I am an eager to learn and self-developed
    professional with a strong creative mind and an excellent team player.
    My work experience has made me skilled in problem solving and coming up
    with innovative solutions.
  </p>
  <p>
    After a search for new challenges, I discovered the world of front-end
    development, which immediately aroused my interest. I now have over a
    year of experience with both front-end and back-end technologies,
    including 
    <span class="text-red">&#x21A3;</span><span class="text-gold">HTML5</span> 
    <span class="text-red">&#x21A3;</span><span class="text-gold">CSS3</span> 
    <span class="text-red">&#x21A3;</span><span class="text-gold">JavaScript</span> 
    <span class="text-red">&#x21A3;</span><span class="text-gold">jQuery</span> 
    <span class="text-red">&#x21A3;</span><span class="text-gold">PHP</span> 
    <span class="text-red">&#x21A3;</span><span class="text-gold">MySQL</span> 
    <span class="text-red">&#x21A3;</span><span class="text-gold">Java</span> 
    <span class="text-red">&#x21A3;</span><span class="text-gold">Vue.js</span>.
  </p>
  <p>
    These skills allow me to develop entire web applications, from the user
    interface to the server and database management.
  </p>
  <p>
    I am currently working independently on various projects for clients, constantly expanding my skills and mastering new technologies. 
    My ability to think creatively and solve problems, combined with my resilience and teamwork, allows me to deliver high-quality solutions tailored to my clients' specific needs. 
    I am also committed to continuous self-development, always aiming to acquire new skills.
  </p>
</div>
  </div>
  <hr>
</template>

<script>
export default {
  name: "HomePage",
};
</script>

<style scoped>
/* Responsiveness */
@media (max-width: 640px) {
  .font-big {
    font-size: 300%;
  }
  
  .tt {
    width: 95%; 
    margin: 0 auto;
  }
}

@media (max-width: 430px) {
  .font-big {
    font-size: 250%;
  }

  .img-small {
    width: 70%;
  }
}

@media (max-width: 320px) {
  .font-big {
    font-size: 200%;
  }

  .img-small {
    width: 80%;
  }

  p {
    font-size: medium;
  }
}

.container {
  background: linear-gradient(to bottom, rgb(29, 29, 29), rgb(80, 80, 80));
}

.font-big {
  font-size: 80px;
}

p {
  margin-bottom: 15px;
  color: white;
  font-size: large;
}

.img-small {
  width: 60%;
  height: auto;
  object-fit: cover;
  border-radius: 10%;
}

.icon-hover {
  position: relative;
  display: inline-block;
  transition: transform 0.3s ease, color 0.3s ease;
}

.icon-hover::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: -5px;
  width: 0;
  height: 2px;
  background-color: red;
  transition: width 0.3s ease;
}

.icon-hover:hover::after {
  width: 100%;
}

.icon-hover:hover i {
  transform: scale(1.2);
  color: white !important;
}

.tt {
  text-align: center;
  width: 90%;
  margin: 0 auto;
}
</style>


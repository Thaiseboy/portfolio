<template>
  <div class="container">
    <div class="d-flex flex-column align-items-center justify-content-center py-5 mt-n3">
      <div class="text-center">
        <h1 class="mb-2 text-white header-font font-weight-bold font-big">
          <span class="text-red font-weight-bold">Nice </span>to meet you! &#x1F601;
        </h1>
        <h2 class="text-gold mb-2 text-font">
          Hi, My name is Master Supakon Karanyawad
        </h2>
        <h2 class="text-gold text-font">
          but you can call me
          <span class="text-red font-weight-bold">Get &#x1F680;</span>
        </h2>
        <!-- Afbeelding -->
        <img
          src="@/assets/foto/get.jpeg"
          alt="Master Supakon"
          class="img-small mt-3"
        >
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
            <i class="bi bi-linkedin social-icon" />
          </a>
          <a
            href="https://github.com/Thaiseboy/Hi-"
            target="_blank"
            class="text-gold me-3 icon-hover"
          >
            <i class="bi bi-github social-icon" />
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineOptions({
  name: "HomePage"
});
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

.social-icon {
  font-size: 50px;
}
</style>


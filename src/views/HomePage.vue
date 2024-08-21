<template>
  <div class="container">
    <div class="d-flex flex-column align-items-center justify-content-center py-5 mt-n3">
      <div class="text-center">
        <h1 class="mb-2 text-red header-font font-weight-bold">Nice to meet you!</h1>
        <h2 class="text-gold mb-2 header-font">Hi, My name is Master Supakon Karanyawad</h2>
        <h2 class="text-gold">
          but you can call me
          <span class="tn text-red font-weight-bold">Get</span>
          <i class="bi bi-rocket-takeoff"></i>
        </h2>
        <!-- Afbeelding -->
        <img
          src="@/assets/foto/get.jpeg"
          alt="Master Supakon"
          class="img-small mt-3"
        />
        <p class="header-font">
          Based in the Netherlands, I'm a front-end developer
        </p>

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
          <a
            href="https://www.instagram.com/thaiseboy/"
            target="_blank"
            class="text-gold icon-hover"
          >
            <i class="bi bi-instagram" style="font-size: 50px"></i>
          </a>
        </div>
      </div>
    </div>

    <div class="tt header-font text-center mt-4">
      <p>
        I am 28 years old. I am an eager to learn and self-developed
        professional with a strong creative mind and an excellent team player.
        My work experience has made me skilled in problem solving and coming up
        with innovative solutions.
      </p>
      <p>
        After a search for new challenges, I discovered the world of front-end
        development, which immediately aroused my interest. I now have over a
        year of experience with both front-end and back-end technologies,
        including HTML5, CSS3, JavaScript, jQuery, PHP, MySQL, Java and Vue.js.
      </p>
      <p>
        These skills allow me to develop entire web applications, from the user
        interface to the server and database management.
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
.container {
  background: linear-gradient(to bottom, rgb(29, 29, 29), rgb(80, 80, 80));
}
.text-left {
  margin-left: 15%;
}

.tn {
  border-bottom: 3px solid white;
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
  margin-top: -20px;
  width: 70%;
  margin-left: auto;
  margin-right: auto;
}
</style>

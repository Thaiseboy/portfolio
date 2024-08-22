<template>
  <div class="contact-container">
    <h1 class="mb-5 text-gold text-center header-font font-weight-bold"><span class="text-red font-weight-bold">Get</span> in Touch &#x1F933;</h1>
    
    <div class="contact-content">
      <!-- Link naar Social Media -->
      <div class="social-media-box">
        <h2 class="text-white text-center">Follow me &#x1F447;</h2>
        <div class="social-icons">
          <a href="https://www.linkedin.com/in/get-ms-karanyawad" target="_blank" class="social-link">
            <i class="bi bi-linkedin" style="font-size: 30px;"></i> LinkedIn
          </a>
          <a href="https://github.com/Thaiseboy/Hi-" target="_blank" class="social-link">
            <i class="bi bi-github" style="font-size: 30px;"></i> GitHub
          </a>
          <a href="https://www.instagram.com/thaiseboy/" target="_blank" class="social-link">
            <i class="bi bi-instagram" style="font-size: 30px;"></i> Instagram
          </a>
        </div>
        <div class="personal-message mt-4">
          <img src="@/assets/foto/get2.jpeg" alt="Get" class="personal-photo" />
          <p class="text-gold mt-2 text-center">See you soon!</p>
        </div>
      </div>

      <!-- Contact Formulier -->
      <div class="contact-form-box">
        <h2 class="text-white text-center">If you have more questions, feel free to ask &#x1F4E9;</h2>
        <form @submit.prevent="sendEmail" class="contact-form">
          <div class="form-group">
            <label for="name">Name:</label>
            <input type="text" id="name" v-model="form.name" required class="form-control" />
          </div>
          <div class="form-group">
            <label for="email">Email:</label>
            <input type="email" id="email" v-model="form.email" required class="form-control" />
          </div>
          <div class="form-group">
            <label for="message">Message:</label>
            <textarea id="message" v-model="form.message" required class="form-control"></textarea>
          </div>
          <button type="submit" class="btn btn-warning">Submit</button>
        </form>

        <!-- CV Download Knop -->
        <div class="cv-download mt-4">
          <button v-if="cvLink" @click="downloadCV" class="btn btn-warning">Download CV</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import sanityClient from "@/sanityClient";

export default {
  data() {
    return {
      form: {
        name: '',
        email: '',
        message: '',
      },
      cvLink: null,
    };
  },
  methods: {
    async fetchCV() {
      const result = await sanityClient.fetch(`*[_type == "cv"]{
        "cvFile": cvFile.asset->url
      }`);
      if (result.length > 0) {
        this.cvLink = result[0].cvFile;
      }
    },
    async sendEmail() {
      const emailData = {
        to: 'get_sarun@hotmail.com',
        subject: `Contact form from ${this.form.name}`,
        body: `Name: ${this.form.name}\nEmail: ${this.form.email}\nMessage: ${this.form.message}`,
      };

      // Simpel e-mail versturen via een API of mailto-link
      window.location.href = `mailto:${emailData.to}?subject=${encodeURIComponent(emailData.subject)}&body=${encodeURIComponent(emailData.body)}`;
    },
    downloadCV() {
      window.open(this.cvLink, '_blank');
    }
  },
  mounted() {
    this.fetchCV();
  }
};
</script>
<style scoped>
.contact-container {
  padding: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.h1 {
  margin-bottom: 40px;
}

.contact-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 40px;
  padding: 20px;
  border: 1px solid #FFD700;
  border-radius: 10px;
  background-color: #333;
  width: 100%;
  max-width: 1200px;
}

.social-media-box, .contact-form-box {
  flex: 1;
  padding: 20px;
  border-radius: 10px;
  background-color: #444;
}

.social-media-box h2, .contact-form-box h2 {
  margin-bottom: 20px;
}

.social-icons {
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: center;
}

.social-link {
  color: #FFD700;
  text-decoration: none;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
}

.social-link i {
  margin-right: 10px;
}

.social-link:hover {
  color: red;
}

.personal-message {
  text-align: center;
  margin-top: 20px;
}

.personal-photo {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
}

.form-group label {
  color: #FFD700;
}

.form-control {
  width: 500px;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  background-color: #222;
  color: #FFD700;
}

.btn-warning {
  background-color: #FFD700;
  color: black;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  display: block;
  margin-top: 20px;
  width: 100%;
  text-align: center;
}

.btn-warning:hover {
  background-color: #ff0707;
  color: white;
}

.cv-download {
  text-align: center;
}

.cv-download button {
  font-size: 1.2rem;
  text-decoration: none;
  color: rgb(0, 0, 0);
  width: 50%;
}

/* Media Queries voor Mobiel */
@media (max-width: 640px) {
    .header-font {
    font-size:3rem;
  }
  .contact-content {
    flex-direction: column;
    align-items: center;
    gap: 20px;
    width: 100%;
  }

  .form-control {
    width: 300px;
  }

  .social-media-box, .contact-form-box {
    width: 100%;
    text-align: center;
  }

  .social-icons {
    align-items: center;
  }

  .social-link {
    justify-content: center;
  }

  .contact-form {
    width: 100%;
  }
}
</style>

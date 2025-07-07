<template>
  <div class="contact-container">
    <h1 class="mb-5 text-gold text-center header-font font-weight-bold">
      <span class="text-red font-weight-bold">Get</span> in Touch &#x1F933;
    </h1>
    
    <div class="contact-content">
      <!-- Link naar Social Media -->
      <div class="social-media-box">
        <h2 class="text-white text-center">
          Follow me &#x1F447;
        </h2>
        <div class="social-icons">
          <a
            href="https://www.linkedin.com/in/get-ms-karanyawad"
            target="_blank"
            class="social-link"
          >
            <i
              class="bi bi-linkedin"
              style="font-size: 30px;"
            /> LinkedIn
          </a>
          <a
            href="https://github.com/Thaiseboy/Hi-"
            target="_blank"
            class="social-link"
          >
            <i
              class="bi bi-github"
              style="font-size: 30px;"
            /> GitHub
          </a>
        </div>
        <div class="personal-message mt-4">
          <img
            src="@/assets/foto/get2.jpeg"
            alt="Photo of Get Karanyawad"
            class="personal-photo"
          >
          <p class="text-gold mt-2 text-center">
            See you soon!
          </p>
        </div>
      </div>

      <!-- Contact Formulier -->
      <div class="contact-form-box">
        <h2 class="text-white text-center">
          If you have more questions, feel free to ask &#x1F4E9;
        </h2>
        <form
          class="contact-form"
          @submit.prevent="sendEmail"
        >
          <div class="form-group">
            <label for="name">Name:</label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              required
              class="form-control"
            >
          </div>
          <div class="form-group">
            <label for="email">Email:</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="form-control"
            >
          </div>
          <div class="form-group">
            <label for="message">Message:</label>
            <textarea
              id="message"
              v-model="form.message"
              required
              class="form-control"
            />
          </div>
          <button
            type="submit"
            class="btn btn-warning"
            aria-label="Submit contact form"
          >
            Submit
          </button>
        </form>

        <!-- CV Download Knop -->
        <div class="cv-download mt-4">
          <button
            v-if="cvLink"
            class="btn btn-warning"
            @click="downloadCV"
          >
            Download CV
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import sanityClient from "@/sanityClient";

defineOptions({
  name: 'ContactPage'
});

const form = reactive({
  name: '',
  email: '',
  message: '',
});

const cvLink = ref(null);

const fetchCV = async () => {
  try {
    const result = await sanityClient.fetch(`*[_type == "cv"]{
      "cvFile": cvFile.asset->url
    }`);
    if (result.length > 0) {
      cvLink.value = result[0].cvFile;
    }
  } catch (error) {
    console.error("Error fetching CV:", error);
    alert("Sorry, there was an issue fetching the CV. Please try again later.");
  }
};

const sendEmail = async () => {
  const emailData = {
    to: 'get_sarun@hotmail.com',
    subject: `Contact form from ${form.name}`,
    body: `Name: ${form.name}\nEmail: ${form.email}\nMessage: ${form.message}`,
  };

  // Simpel e-mail versturen via een API of mailto-link
  window.location.href = `mailto:${emailData.to}?subject=${encodeURIComponent(emailData.subject)}&body=${encodeURIComponent(emailData.body)}`;
};

const downloadCV = () => {
  window.open(cvLink.value, '_blank');
};

onMounted(() => {
  fetchCV();
});
</script>
<style scoped>
.contact-container {
  padding: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #2b2b2b;
  color: #ffffff;
}

.contact-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 40px;
  padding: 20px;
  border: 1px solid #FFD700;
  border-radius: 10px;
  background-color: #333; /* Donkere tint binnen de content */
  width: 100%;
  max-width: 1200px;
}

.social-media-box,
.contact-form-box {
  flex: 1;
  padding: 20px;
  border-radius: 10px;
  background-color: #3a3a3a; 
}

.social-media-box h2,
.contact-form-box h2 {
  margin-bottom: 20px;
  text-align: center;
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
  gap: 10px;
}

.social-link:hover {
  color: #ff4500;
}

.personal-photo {
  display: block;
  margin: 20px auto;
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
  max-width: 100%; 
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #444;
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
  margin: 0 auto; 
  display: block;
  width: 50%;
  text-align: center;
}

.btn-warning:hover {
  background-color: #ff4500;
  color: white;
}

.cv-download {
  text-align: center;
}

.cv-download button {
  font-size: 1.2rem;
  color: #000;
  width: 50%;
  margin: 0 auto; 
  display: block;
}

/* Media Queries voor Mobiel */
@media (max-width: 768px) {
  .contact-content {
    flex-direction: column; 
    align-items: center;
    gap: 20px;
    width: 100%;
  }

  .social-media-box,
  .contact-form-box {
    width: 100%; 
    text-align: center;
  }

  .form-control {
    width: 100%;
  }

  .btn-warning,
  .cv-download button {
    width: 90%; 
  }

  .personal-photo {
    width: 120px;
    height: 120px;
  }
}

@media (max-width: 480px) {
  .header-font {
    font-size: 2.5rem; 
  }

  .personal-photo {
    width: 100px;
    height: 100px;
  }

  .form-control {
    width: 100%; 
  }

  .btn-warning,
  .cv-download button {
    width: 100%; 
  }
}
</style>

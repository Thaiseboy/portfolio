<template>
  <div class="contact-page">
    <h1 class="contact-page__title header-font font-weight-bold text-gold">
      <span class="text-red font-weight-bold">Get</span> in Touch &#x1F933;
    </h1>
    
    <div class="contact-container">
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

        <!-- CV Download Section -->
        <ErrorBoundary :on-retry="retryFetchCV">
          <div class="cv-download mt-4">
            <SkeletonLoader 
              v-if="cvLoading" 
              type="box" 
              width="200px" 
              height="50px"
            />
            <button
              v-else-if="cvLink"
              class="btn btn-warning"
              @click="downloadCV"
            >
              Download CV
            </button>
            <p v-else-if="!cvLoading && !cvLink">
              CV not available
            </p>
          </div>
        </ErrorBoundary>
      </div>
    </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useSanity } from '@/composables/useSanity';
import ErrorBoundary from '@/components/ui/ErrorBoundary.vue';
import SkeletonLoader from '@/components/ui/SkeletonLoader.vue';

defineOptions({
  name: 'ContactPage'
});

const form = reactive({
  name: '',
  email: '',
  message: '',
});

const cvLink = ref(null);
const cvLoading = ref(false);
const { fetchContact, clearError } = useSanity();

const fetchCV = async () => {
  cvLoading.value = true;
  try {
    const result = await fetchContact();
    if (result && result.length > 0) {
      cvLink.value = result[0].pdfUrl;
    }
  } catch (error) {
    console.error("Error fetching CV:", error);
  } finally {
    cvLoading.value = false;
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

const retryFetchCV = () => {
  clearError();
  fetchCV();
};

onMounted(() => {
  fetchCV();
});
</script>
<style scoped lang="scss">
// All styles are now handled by SCSS partials in /assets/scss/pages/_contact.scss
// Custom component-specific styles can be added here if needed
</style>

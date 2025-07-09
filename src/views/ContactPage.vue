<template>
  <div class="contact-page">
    <h1 class="contact-page__title header-font font-weight-bold text-gold">
      <span class="text-red font-weight-bold">Get</span> in Touch &#x1F933;
    </h1>
    
    <div class="contact-container">
      <div class="contact-content">
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
            src="@/assets/foto/optimized/get2.jpeg"
            alt="Photo of Get Karanyawad"
            class="personal-photo"
          >
          <p class="text-gold mt-2 text-center">
            See you soon!
          </p>
        </div>
      </div>

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
              :class="{ 'is-invalid': formErrors.name }"
              @blur="validateField('name')"
              @input="validateField('name')"
              autocomplete="name"
              maxlength="50"
            >
            <div v-if="formErrors.name" class="invalid-feedback">
              {{ formErrors.name }}
            </div>
          </div>
          <div class="form-group">
            <label for="email">Email:</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="form-control"
              :class="{ 'is-invalid': formErrors.email }"
              @blur="validateField('email')"
              @input="validateField('email')"
              autocomplete="email"
              maxlength="254"
            >
            <div v-if="formErrors.email" class="invalid-feedback">
              {{ formErrors.email }}
            </div>
          </div>
          <div class="form-group">
            <label for="message">Message:</label>
            <textarea
              id="message"
              v-model="form.message"
              required
              class="form-control"
              :class="{ 'is-invalid': formErrors.message }"
              @blur="validateField('message')"
              @input="validateField('message')"
              rows="4"
              maxlength="1000"
            />
            <div v-if="formErrors.message" class="invalid-feedback">
              {{ formErrors.message }}
            </div>
            <small class="form-text text-muted">
              {{ form.message.length }}/1000 characters
            </small>
          </div>
          <button
            type="submit"
            class="btn btn-warning"
            :disabled="!isFormValid || isSubmitting"
            aria-label="Submit contact form"
          >
            <span v-if="isSubmitting">Sending...</span>
            <span v-else>Submit</span>
          </button>
        </form>

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
import { onMounted } from 'vue';
import { useContactForm } from '@/composables/useContactForm';
import { useCV } from '@/composables/useCV';
import ErrorBoundary from '@/components/ui/ErrorBoundary.vue';
import SkeletonLoader from '@/components/ui/SkeletonLoader.vue';

defineOptions({
  name: 'ContactPage'
});

// Contact form composable
const {
  form,
  isSubmitting,
  errors: formErrors,
  isValid: isFormValid,
  validateField,
  submitForm,
} = useContactForm();

// CV download composable
const {
  cvLink,
  cvLoading,
  fetchCV,
  downloadCV,
  retryFetchCV,
} = useCV();

// Form submission handler
const sendEmail = async () => {
  await submitForm('get_sarun@hotmail.com');
};

onMounted(() => {
  fetchCV();
});
</script>
<style scoped lang="scss">
.form-control.is-invalid {
  border-color: #dc3545;
  box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
}

.invalid-feedback {
  display: block;
  width: 100%;
  margin-top: 0.25rem;
  font-size: 0.875em;
  color: #dc3545;
}

.form-text {
  margin-top: 0.25rem;
  font-size: 0.875em;
  color: #6c757d;
}

.btn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}
</style>

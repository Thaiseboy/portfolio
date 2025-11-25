<template>
  <div class="page-container">
    <h1 class="page-title">
      <span class="text-red font-bold">Get</span> in Touch &#x1F933;
    </h1>

    <div class="max-w-screen-xl mx-auto">
      <div class="contact-content">
      <div class="social-media-box">
        <h2 class="text-white text-center mb-xl">
          Follow me &#x1F447;
        </h2>
        <div class="flex flex-col gap-lg mb-xl">
          <a
            href="https://www.linkedin.com/in/get-ms-karanyawad"
            target="_blank"
            class="social-link"
          >
            <i class="bi bi-linkedin text-[1.8rem]" /> LinkedIn
          </a>
          <a
            href="https://github.com/Thaiseboy/Hi-"
            target="_blank"
            class="social-link"
          >
            <i class="bi bi-github text-[1.8rem]" /> GitHub
          </a>
        </div>
        <div class="mt-xl">
          <img
            src="@/assets/foto/optimized/get2.jpeg"
            alt="Photo of Get Karanyawad"
            class="personal-photo"
          >
          <p class="text-gold mt-md text-center text-lg font-medium">
            See you soon!
          </p>
        </div>
      </div>

      <div class="contact-form-box">
        <h2 class="text-white text-center mb-xl">
          If you have more questions, feel free to ask &#x1F4E9;
        </h2>
        <form
          class="contact-form"
          @submit.prevent="sendEmail"
        >
          <div class="mb-lg">
            <label for="name" class="text-primary font-semibold mb-sm block">Name:</label>
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
          <div class="mb-lg">
            <label for="email" class="text-primary font-semibold mb-sm block">Email:</label>
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
          <div class="mb-lg">
            <label for="message" class="text-primary font-semibold mb-sm block">Message:</label>
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
            <small class="block mt-1 text-xs text-gray-500">
              {{ form.message.length }}/1000 characters
            </small>
          </div>
          <button
            type="submit"
            class="btn btn-submit"
            :disabled="!isFormValid || isSubmitting"
            aria-label="Submit contact form"
          >
            <span v-if="isSubmitting">Sending...</span>
            <span v-else>Submit</span>
          </button>

          <div v-if="submitMessage" class="alert alert-success mt-3">
            {{ submitMessage }}
          </div>
          <div v-if="submitError" class="alert alert-danger mt-3">
            {{ submitError }}
          </div>
        </form>

        <ErrorBoundary :on-retry="retryFetchCV">
          <div class="mt-4 text-center">
            <SkeletonLoader
              v-if="cvLoading"
              type="box"
              width="200px"
              height="50px"
            />
            <button
              v-else-if="cvLink"
              class="btn btn-cv"
              @click="downloadCV"
            >
              Download CV
            </button>
            <p v-else-if="!cvLoading && !cvLink" class="text-white opacity-70 italic">
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

const {
  form,
  isSubmitting,
  submitMessage,
  submitError,
  errors: formErrors,
  isValid: isFormValid,
  validateField,
  submitForm,
} = useContactForm();

const {
  cvLink,
  cvLoading,
  fetchCV,
  downloadCV,
  retryFetchCV,
} = useCV();

const sendEmail = async () => {
  await submitForm('get_sarun@hotmail.com');
};

onMounted(() => {
  fetchCV();
});
</script>

<style scoped>
.contact-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  padding: 2rem;
  border: 2px solid var(--color-primary);
  border-radius: 16px;
  background: linear-gradient(135deg, var(--color-card), var(--color-background));
  position: relative;
  overflow: hidden;
}

.contact-content::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: conic-gradient(from 0deg, transparent, rgba(255, 215, 0, 0.05), transparent);
  animation: rotate 20s linear infinite;
}

.contact-content > * {
  position: relative;
  z-index: 1;
}

@media (max-width: 768px) {
  .contact-content {
    grid-template-columns: 1fr;
    gap: 2rem;
    padding: 1.5rem;
  }
}

.social-media-box {
  @apply bg-dark-card/80 rounded-lg p-xl shadow-md transition-all duration-normal;
  text-align: center;
}

.social-media-box:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.social-link {
  @apply flex items-center justify-center gap-md text-primary text-xl font-medium px-lg py-md border-2 border-transparent rounded-lg transition-all duration-normal;
  background: linear-gradient(var(--color-card), var(--color-card)) padding-box,
              linear-gradient(45deg, var(--color-primary), var(--color-secondary)) border-box;
}

.social-link:hover {
  color: var(--color-text);
  background: linear-gradient(45deg, var(--color-primary), var(--color-secondary));
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

@media (max-width: 768px) {
  .social-link {
    @apply text-lg;
  }

  .social-link i {
    font-size: 1.5rem;
  }
}

.personal-photo {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  margin: 0 auto 1rem;
  border: 4px solid var(--color-primary);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.personal-photo:hover {
  transform: scale(1.05);
  box-shadow: 0 15px 30px rgba(255, 215, 0, 0.3);
}

@media (max-width: 768px) {
  .personal-photo {
    width: 120px;
    height: 120px;
  }
}

.contact-form-box {
  @apply bg-dark-card/80 rounded-lg p-xl shadow-md transition-all duration-normal;
}

.contact-form-box:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.form-control {
  @apply w-full px-md py-sm rounded-md text-base transition-all duration-normal;
  background: var(--color-background);
  border: 2px solid var(--color-border);
  color: var(--color-primary);
}

.form-control:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.1);
  background: var(--color-card);
  outline: none;
}

.form-control::placeholder {
  color: rgba(255, 215, 0, 0.5);
}

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

.btn-submit {
  @apply w-full px-md py-md text-lg font-semibold rounded-md transition-all duration-normal border-none cursor-pointer;
  background: linear-gradient(45deg, var(--color-primary), var(--color-warning));
  color: #000;
}

.btn-submit:hover:not(:disabled) {
  background: linear-gradient(45deg, var(--color-warning), var(--color-primary));
  transform: translateY(-2px);
}

.btn-submit:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.btn-cv {
  @apply px-xl py-md rounded-md font-semibold transition-all duration-normal border-none cursor-pointer;
  background: linear-gradient(45deg, var(--color-secondary), #ff6b35);
  color: var(--color-text);
}

.btn-cv:hover {
  background: linear-gradient(45deg, #ff6b35, var(--color-secondary));
  transform: translateY(-2px);
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>

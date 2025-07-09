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
import { ref, reactive, onMounted, computed } from 'vue';
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

const formErrors = reactive({
  name: '',
  email: '',
  message: '',
});

const isSubmitting = ref(false);
const cvLink = ref(null);
const cvLoading = ref(false);
const { fetchContact, clearError } = useSanity();

// Input validation rules
const validateName = (name) => {
  if (!name || name.trim().length === 0) {
    return 'Name is required';
  }
  if (name.trim().length < 2) {
    return 'Name must be at least 2 characters long';
  }
  if (name.trim().length > 50) {
    return 'Name must be less than 50 characters';
  }
  if (!/^[a-zA-Z\s\-']+$/.test(name.trim())) {
    return 'Name can only contain letters, spaces, hyphens, and apostrophes';
  }
  return '';
};

const validateEmail = (email) => {
  if (!email || email.trim().length === 0) {
    return 'Email is required';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return 'Please enter a valid email address';
  }
  if (email.trim().length > 254) {
    return 'Email address is too long';
  }
  return '';
};

const validateMessage = (message) => {
  if (!message || message.trim().length === 0) {
    return 'Message is required';
  }
  if (message.trim().length < 10) {
    return 'Message must be at least 10 characters long';
  }
  if (message.trim().length > 1000) {
    return 'Message must be less than 1000 characters';
  }
  return '';
};

// Input sanitization
const sanitizeInput = (input) => {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocols
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
};

// Real-time validation
const validateField = (field) => {
  switch (field) {
    case 'name':
      formErrors.name = validateName(form.name);
      break;
    case 'email':
      formErrors.email = validateEmail(form.email);
      break;
    case 'message':
      formErrors.message = validateMessage(form.message);
      break;
  }
};

const isFormValid = computed(() => {
  return !formErrors.name && !formErrors.email && !formErrors.message &&
         form.name.trim() && form.email.trim() && form.message.trim();
});

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
  // Validate all fields
  validateField('name');
  validateField('email');
  validateField('message');

  if (!isFormValid.value) {
    return;
  }

  isSubmitting.value = true;

  try {
    // Sanitize inputs
    const sanitizedName = sanitizeInput(form.name);
    const sanitizedEmail = sanitizeInput(form.email);
    const sanitizedMessage = sanitizeInput(form.message);

    const emailData = {
      to: 'get_sarun@hotmail.com',
      subject: `Portfolio Contact: ${sanitizedName}`,
      body: `Name: ${sanitizedName}\nEmail: ${sanitizedEmail}\nMessage: ${sanitizedMessage}`,
    };

    // Simple email sending via mailto-link
    window.location.href = `mailto:${emailData.to}?subject=${encodeURIComponent(emailData.subject)}&body=${encodeURIComponent(emailData.body)}`;
    
    // Reset form after successful submission
    form.name = '';
    form.email = '';
    form.message = '';
    formErrors.name = '';
    formErrors.email = '';
    formErrors.message = '';
  } catch (error) {
    console.error('Error sending email:', error);
  } finally {
    isSubmitting.value = false;
  }
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

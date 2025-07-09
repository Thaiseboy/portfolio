import { ref, reactive } from 'vue';
import { useFormValidation } from './useFormValidation';
import { EmailService } from '../services/emailService';

export function useContactForm() {
  const { sanitizeInput, createFormValidation } = useFormValidation();
  
  const form = reactive({
    name: '',
    email: '',
    message: '',
  });

  const isSubmitting = ref(false);
  const submitMessage = ref('');
  const submitError = ref('');

  const validation = createFormValidation(form);

  const submitForm = async (emailAddress = 'get_sarun@hotmail.com') => {
    validation.validateAllFields();

    if (!validation.isValid.value) {
      return false;
    }

    isSubmitting.value = true;
    submitMessage.value = '';
    submitError.value = '';

    try {
      const sanitizedName = sanitizeInput(form.name);
      const sanitizedEmail = sanitizeInput(form.email);
      const sanitizedMessage = sanitizeInput(form.message);

      const emailData = {
        name: sanitizedName,
        email: sanitizedEmail,
        message: sanitizedMessage,
        to: emailAddress,
        subject: `Portfolio Contact: ${sanitizedName}`,
      };

      let result;
      
      if (process.env.VUE_APP_EMAIL_API_URL) {
        result = await EmailService.sendEmail(emailData);
      } else {
        result = await EmailService.sendEmailWithMailto(emailData);
      }

      if (result.success) {
        submitMessage.value = result.message;
        resetForm();
        return true;
      } else {
        submitError.value = result.message;
        return false;
      }
    } catch (error) {
      console.error('Error sending email:', error);
      submitError.value = 'An unexpected error occurred. Please try again.';
      return false;
    } finally {
      isSubmitting.value = false;
    }
  };

  const resetForm = () => {
    form.name = '';
    form.email = '';
    form.message = '';
    validation.clearErrors();
    submitMessage.value = '';
    submitError.value = '';
  };

  return {
    form,
    isSubmitting,
    submitMessage,
    submitError,
    errors: validation.errors,
    isValid: validation.isValid,
    validateField: validation.validateField,
    submitForm,
    resetForm,
  };
}
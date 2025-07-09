import { ref, reactive } from 'vue';
import { useFormValidation } from './useFormValidation';

/**
 * Contact form composable
 * Handles form state, validation, and submission
 */
export function useContactForm() {
  const { sanitizeInput, createFormValidation } = useFormValidation();
  
  // Form state
  const form = reactive({
    name: '',
    email: '',
    message: '',
  });

  const isSubmitting = ref(false);

  // Create validation instance
  const validation = createFormValidation(form);

  // Form submission
  const submitForm = async (emailAddress = 'get_sarun@hotmail.com') => {
    validation.validateAllFields();

    if (!validation.isValid.value) {
      return false;
    }

    isSubmitting.value = true;

    try {
      // Sanitize inputs
      const sanitizedName = sanitizeInput(form.name);
      const sanitizedEmail = sanitizeInput(form.email);
      const sanitizedMessage = sanitizeInput(form.message);

      const emailData = {
        to: emailAddress,
        subject: `Portfolio Contact: ${sanitizedName}`,
        body: `Name: ${sanitizedName}\nEmail: ${sanitizedEmail}\nMessage: ${sanitizedMessage}`,
      };

      // Send email via mailto
      window.location.href = `mailto:${emailData.to}?subject=${encodeURIComponent(emailData.subject)}&body=${encodeURIComponent(emailData.body)}`;
      
      // Reset form after successful submission
      resetForm();
      
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    } finally {
      isSubmitting.value = false;
    }
  };

  // Reset form
  const resetForm = () => {
    form.name = '';
    form.email = '';
    form.message = '';
    validation.clearErrors();
  };

  return {
    form,
    isSubmitting,
    errors: validation.errors,
    isValid: validation.isValid,
    validateField: validation.validateField,
    submitForm,
    resetForm,
  };
}
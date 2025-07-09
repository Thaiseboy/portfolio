import { ref, reactive } from 'vue';
import { useFormValidation } from './useFormValidation';

export function useContactForm() {
  const { sanitizeInput, createFormValidation } = useFormValidation();
  
  const form = reactive({
    name: '',
    email: '',
    message: '',
  });

  const isSubmitting = ref(false);

  const validation = createFormValidation(form);

  const submitForm = async (emailAddress = 'get_sarun@hotmail.com') => {
    validation.validateAllFields();

    if (!validation.isValid.value) {
      return false;
    }

    isSubmitting.value = true;

    try {
      const sanitizedName = sanitizeInput(form.name);
      const sanitizedEmail = sanitizeInput(form.email);
      const sanitizedMessage = sanitizeInput(form.message);

      const emailData = {
        to: emailAddress,
        subject: `Portfolio Contact: ${sanitizedName}`,
        body: `Name: ${sanitizedName}\nEmail: ${sanitizedEmail}\nMessage: ${sanitizedMessage}`,
      };

      window.location.href = `mailto:${emailData.to}?subject=${encodeURIComponent(emailData.subject)}&body=${encodeURIComponent(emailData.body)}`;
      
      resetForm();
      
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
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
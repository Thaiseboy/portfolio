import { reactive, computed } from 'vue';

/**
 * Form validation composable
 * Provides validation rules and utilities for form inputs
 */
export function useFormValidation() {
  // Validation rules
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

  // Create form validation state
  const createFormValidation = (formData) => {
    const errors = reactive({
      name: '',
      email: '',
      message: '',
    });

    const validateField = (field) => {
      switch (field) {
        case 'name':
          errors.name = validateName(formData.name);
          break;
        case 'email':
          errors.email = validateEmail(formData.email);
          break;
        case 'message':
          errors.message = validateMessage(formData.message);
          break;
      }
    };

    const isValid = computed(() => {
      return !errors.name && !errors.email && !errors.message &&
             !!formData.name.trim() && !!formData.email.trim() && !!formData.message.trim();
    });

    const validateAllFields = () => {
      validateField('name');
      validateField('email');
      validateField('message');
    };

    const clearErrors = () => {
      errors.name = '';
      errors.email = '';
      errors.message = '';
    };

    return {
      errors,
      isValid,
      validateField,
      validateAllFields,
      clearErrors,
    };
  };

  return {
    validateName,
    validateEmail,
    validateMessage,
    sanitizeInput,
    createFormValidation,
  };
}
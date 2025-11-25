import { reactive, computed } from 'vue';

export function useFormValidation() {
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
    // Allow international characters (Unicode letters) + spaces, hyphens, apostrophes
    // but block numbers and most special characters
    if (!/^[\p{L}\s\-']+$/u.test(name.trim())) {
      return 'Name can only contain letters, spaces, hyphens, and apostrophes';
    }
    // Extra security: block common XSS patterns even if they pass the regex
    if (/<|>|&lt|&gt|script|javascript|onerror|onclick/i.test(name)) {
      return 'Invalid characters detected';
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

  const sanitizeInput = (input) => {
    if (!input) return '';

    return input
      // Remove HTML tags and entities
      .replace(/[<>]/g, '')
      .replace(/&lt;/gi, '')
      .replace(/&gt;/gi, '')
      .replace(/&#60;/gi, '')
      .replace(/&#62;/gi, '')
      // Remove dangerous protocols
      .replace(/javascript:/gi, '')
      .replace(/data:text\/html/gi, '')
      .replace(/vbscript:/gi, '')
      // Remove event handlers
      .replace(/on\w+\s*=/gi, '')
      // Remove script tags even if encoded
      .replace(/<script[^>]*>.*?<\/script>/gi, '')
      .replace(/&lt;script/gi, '')
      // Remove potentially dangerous characters
      .replace(/[{}]/g, '')
      // eslint-disable-next-line no-control-regex
      .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Remove control characters (ASCII 0-31, 127-159)
      .trim();
  };

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
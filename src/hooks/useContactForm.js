import { useState } from "react";
import { EmailService } from "@/services/emailService";
import { sanitizeInput, useFormValidation } from "@/hooks/useFormValidation";

const initialForm = {
  name: "",
  email: "",
  message: "",
};

export function useContactForm() {
  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitError, setSubmitError] = useState("");
  const validation = useFormValidation(form);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const resetForm = () => {
    setForm(initialForm);
    validation.clearErrors();
    setSubmitMessage("");
    setSubmitError("");
  };

  const submitForm = async (emailAddress = "get_sarun@hotmail.com") => {
    const isValid = validation.validateAllFields();
    if (!isValid) return false;

    setIsSubmitting(true);
    setSubmitMessage("");
    setSubmitError("");

    try {
      const sanitizedName = sanitizeInput(form.name);
      const emailData = {
        name: sanitizedName,
        email: sanitizeInput(form.email),
        message: sanitizeInput(form.message),
        to: emailAddress,
        subject: `Portfolio Contact: ${sanitizedName}`,
      };

      const hasEmailApi = Boolean(import.meta.env.VITE_EMAIL_API_URL);
      const result = hasEmailApi
        ? await EmailService.sendEmail(emailData)
        : await EmailService.sendEmailWithMailto(emailData);

      if (result.success) {
        setSubmitMessage(result.message);
        resetForm();
        return true;
      }

      setSubmitError(result.message);
      return false;
    } catch (error) {
      console.error("Error sending email:", error);
      setSubmitError("An unexpected error occurred. Please try again.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    updateField,
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

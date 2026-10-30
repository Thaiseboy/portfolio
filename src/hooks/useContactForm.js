import { useState } from "react";
import { EmailService } from "@/services/emailService";
import { sanitizeInput, useFormValidation } from "@/hooks/useFormValidation";

const initialForm = {
  name: "",
  email: "",
  message: "",
  // Honeypot field, hidden from visitors; bots fill it in.
  website: "",
};

export function useContactForm() {
  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitError, setSubmitError] = useState("");
  // One id per message: a repeat after a timeout is stored once; new after sending.
  const [requestId, setRequestId] = useState(() => window.crypto.randomUUID());
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

  const submitForm = async () => {
    const isValid = validation.validateAllFields();
    if (!isValid) return false;

    setIsSubmitting(true);
    setSubmitMessage("");
    setSubmitError("");

    try {
      const result = await EmailService.sendEmail({
        name: sanitizeInput(form.name),
        email: sanitizeInput(form.email),
        message: sanitizeInput(form.message),
        website: form.website,
        requestId,
      });

      if (result.success) {
        // Clear the fields but keep the confirmation visible (resetForm would clear it too).
        setForm(initialForm);
        validation.clearErrors();
        setRequestId(window.crypto.randomUUID());
        setSubmitMessage(result.message);
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

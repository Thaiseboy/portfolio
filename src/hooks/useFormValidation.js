import { useMemo, useState } from "react";
import { validateEmail, validateMessage, validateName } from "@/utils/contactValidation";

export { sanitizeInput, validateEmail, validateMessage, validateName } from "@/utils/contactValidation";

export function useFormValidation(form) {
  const [errors, setErrors] = useState({ name: "", email: "", message: "" });

  const validateField = (field) => {
    setErrors((current) => {
      const next = { ...current };
      if (field === "name") next.name = validateName(form.name);
      if (field === "email") next.email = validateEmail(form.email);
      if (field === "message") next.message = validateMessage(form.message);
      return next;
    });
  };

  const validateAllFields = () => {
    const next = {
      name: validateName(form.name),
      email: validateEmail(form.email),
      message: validateMessage(form.message),
    };
    setErrors(next);
    return !next.name && !next.email && !next.message;
  };

  const clearErrors = () => setErrors({ name: "", email: "", message: "" });

  const isValid = useMemo(
    () =>
      !errors.name &&
      !errors.email &&
      !errors.message &&
      !!form.name.trim() &&
      !!form.email.trim() &&
      !!form.message.trim(),
    [errors, form]
  );

  return { errors, isValid, validateField, validateAllFields, clearErrors };
}

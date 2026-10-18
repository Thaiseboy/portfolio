import { useMemo, useState } from "react";
import { validateEmail, validateMessage, validateName } from "@/utils/contactValidation";

export { sanitizeInput, validateEmail, validateMessage, validateName } from "@/utils/contactValidation";

export function useFormValidation(form) {
  const [errors, setErrors] = useState({ name: "", email: "", message: "" });

  // Pass the new value from onChange: `form` still holds the previous one until the next render.
  const validateField = (field, value = form[field]) => {
    setErrors((current) => {
      const next = { ...current };
      if (field === "name") next.name = validateName(value);
      if (field === "email") next.email = validateEmail(value);
      if (field === "message") next.message = validateMessage(value);
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

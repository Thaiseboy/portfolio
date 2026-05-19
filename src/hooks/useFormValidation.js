import { useMemo, useState } from "react";

export function validateName(name) {
  if (!name || name.trim().length === 0) return "Name is required";
  if (name.trim().length < 2) return "Name must be at least 2 characters long";
  if (name.trim().length > 50) return "Name must be less than 50 characters";
  if (!/^[\p{L}\s\-']+$/u.test(name.trim())) {
    return "Name can only contain letters, spaces, hyphens, and apostrophes";
  }
  if (/<|>|&lt|&gt|script|javascript|onerror|onclick/i.test(name)) {
    return "Invalid characters detected";
  }
  return "";
}

export function validateEmail(email) {
  if (!email || email.trim().length === 0) return "Email is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return "Please enter a valid email address";
  }
  if (email.trim().length > 254) return "Email address is too long";
  return "";
}

export function validateMessage(message) {
  if (!message || message.trim().length === 0) return "Message is required";
  if (message.trim().length < 10) return "Message must be at least 10 characters long";
  if (message.trim().length > 1000) return "Message must be less than 1000 characters";
  return "";
}

export function sanitizeInput(input) {
  if (!input) return "";

  return input
    .replace(/[<>]/g, "")
    .replace(/&lt;/gi, "")
    .replace(/&gt;/gi, "")
    .replace(/&#60;/gi, "")
    .replace(/&#62;/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/data:text\/html/gi, "")
    .replace(/vbscript:/gi, "")
    .replace(/on\w+\s*=/gi, "")
    .replace(/<script[^>]*>.*?<\/script>/gi, "")
    .replace(/&lt;script/gi, "")
    .replace(/[{}]/g, "")
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, "")
    .trim();
}

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

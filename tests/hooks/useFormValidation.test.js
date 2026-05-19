import { describe, expect, it } from "vitest";
import {
  sanitizeInput,
  validateEmail,
  validateMessage,
  validateName,
} from "@/hooks/useFormValidation";

describe("form validation helpers", () => {
  it("validates names", () => {
    expect(validateName("")).toBe("Name is required");
    expect(validateName("a")).toBe("Name must be at least 2 characters long");
    expect(validateName("a".repeat(51))).toBe("Name must be less than 50 characters");
    expect(validateName("123")).toBe("Name can only contain letters, spaces, hyphens, and apostrophes");
    expect(validateName("John Doe")).toBe("");
  });

  it("validates email", () => {
    expect(validateEmail("")).toBe("Email is required");
    expect(validateEmail("invalid")).toBe("Please enter a valid email address");
    expect(validateEmail("test@example.com")).toBe("");
  });

  it("validates message", () => {
    expect(validateMessage("")).toBe("Message is required");
    expect(validateMessage("short")).toBe("Message must be at least 10 characters long");
    expect(validateMessage("This is a valid message")).toBe("");
  });

  it("sanitizes input", () => {
    expect(sanitizeInput("<script>alert(\"xss\")</script>")).toBe("scriptalert(\"xss\")/script");
    expect(sanitizeInput("javascript:alert(\"xss\")")).toBe("alert(\"xss\")");
    expect(sanitizeInput("  normal text  ")).toBe("normal text");
  });
});

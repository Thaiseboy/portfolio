import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useContactForm } from "@/hooks/useContactForm";
import { EmailService } from "@/services/emailService";

vi.mock("@/services/emailService", () => ({
  EmailService: { sendEmail: vi.fn() },
}));

const fillIn = (result) => {
  act(() => {
    result.current.updateField("name", "Jane Doe");
    result.current.updateField("email", "jane@example.com");
    result.current.updateField(
      "message",
      "Hello Get, I would like to work together.",
    );
  });
};

describe("useContactForm", () => {
  it("clears the fields but keeps the success message after sending", async () => {
    EmailService.sendEmail.mockResolvedValue({
      success: true,
      message: "Thanks! Your message has been sent.",
    });
    const { result } = renderHook(() => useContactForm());
    fillIn(result);

    await act(() => result.current.submitForm());

    expect(result.current.submitMessage).toBe(
      "Thanks! Your message has been sent.",
    );
    expect(result.current.form.message).toBe("");
  });

  it("keeps the fields and shows the error when sending fails", async () => {
    EmailService.sendEmail.mockResolvedValue({
      success: false,
      message: "Failed to send your message.",
    });
    const { result } = renderHook(() => useContactForm());
    fillIn(result);

    await act(() => result.current.submitForm());

    expect(result.current.submitError).toBe("Failed to send your message.");
    expect(result.current.form.message).toBe(
      "Hello Get, I would like to work together.",
    );
  });
});

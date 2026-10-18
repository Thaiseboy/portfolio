// The contact Netlify Function (netlify/functions/contact.mjs) sends the mail via Resend.
const CONTACT_ENDPOINT = "/api/contact";

export class EmailService {
  static async sendEmail(emailData) {
    try {
      const response = await fetch(CONTACT_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: emailData.name,
          email: emailData.email,
          message: emailData.message,
          website: emailData.website,
          requestId: emailData.requestId,
        }),
      });

      // Without the function (plain `vite` dev server) this returns index.html, not JSON.
      const result = await response.json().catch(() => null);

      if (!response.ok || !result?.success) {
        throw new Error(
          result?.message || `HTTP error! status: ${response.status}`,
        );
      }

      return {
        success: true,
        message: result.message,
      };
    } catch (error) {
      console.error("Email sending failed:", error);
      return {
        success: false,
        message:
          "Failed to send your message. Please try again, or reach me on LinkedIn.",
        error: error.message,
      };
    }
  }
}

// @vitest-environment node
import { describe, expect, it } from "vitest";
import { buildContactEmail } from "../../netlify/emails/contactEmail.mjs";

const sample = {
  name: "Jane Doe",
  email: "jane@example.com",
  message: "Hello Get,\n\nCan we talk about a project?",
  sentAt: new Date("2026-10-17T16:20:00Z"),
};

describe("contact email template", () => {
  it("builds a subject, HTML and plain text version", () => {
    const mail = buildContactEmail(sample);

    expect(mail.subject).toBe("Nieuw bericht van Jane Doe via getdeveloper.nl");
    expect(mail.html).toContain("Jane Doe<span");
    expect(mail.html).toContain('href="mailto:jane@example.com?subject=Re%3A%20je%20bericht%20via%20getdeveloper.nl"');
    expect(mail.text).toContain("Naam:   Jane Doe");
    expect(mail.text).toContain("Can we talk about a project?");
  });

  it("shows the time in Dutch, Amsterdam time", () => {
    const mail = buildContactEmail(sample);

    expect(mail.html).toContain("17 oktober 2026 om 18:20");
  });

  it("escapes everything the visitor typed", () => {
    const mail = buildContactEmail({
      ...sample,
      name: "Jane \"Quote\" Doe",
      message: "<img src=x onerror=alert(1)> & more",
    });

    expect(mail.html).not.toContain("<img src=x");
    expect(mail.html).toContain("&lt;img src=x onerror=alert(1)&gt; &amp; more");
    expect(mail.html).toContain("Jane &quot;Quote&quot; Doe");
  });
});

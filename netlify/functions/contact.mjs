import {
  sanitizeInput,
  validateEmail,
  validateMessage,
  validateName,
} from "../../src/utils/contactValidation.js";

// Sends contact form messages through Resend. The API key stays on the server:
// set RESEND_API_KEY (and optionally CONTACT_TO_EMAIL / CONTACT_FROM_EMAIL) in Netlify.

const RESEND_URL = "https://api.resend.com/emails";
const DEFAULT_TO = "get_sarun@hotmail.com";
// Works without a verified domain, but Resend then only delivers to the account owner.
const DEFAULT_FROM = "Portfolio <onboarding@resend.dev>";

// Resend wants "email@x" or "Name <email@x>"; "<email@x>" is sent as the bare address.
export function formatSender(value) {
  const sender = (value || "").trim();
  if (!sender) return DEFAULT_FROM;
  if (/^[^<>]+<[^<>\s]+@[^<>\s]+>$/.test(sender)) return sender;
  return sender.replace(/^<|>$/g, "").trim();
}

const json = (status, body) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

const escapeHtml = (value) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

export async function handleContact(
  request,
  env = process.env,
  fetchImpl = fetch,
) {
  if (request.method !== "POST") {
    return json(405, { success: false, message: "Method not allowed." });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json(400, { success: false, message: "Invalid request." });
  }

  // Honeypot: real visitors never see or fill this field.
  if (body?.website) {
    return json(200, {
      success: true,
      message: "Thanks! Your message has been sent.",
    });
  }

  const name = sanitizeInput(String(body?.name ?? ""));
  const email = sanitizeInput(String(body?.email ?? ""));
  const message = sanitizeInput(String(body?.message ?? ""));
  const errors = {
    name: validateName(name),
    email: validateEmail(email),
    message: validateMessage(message),
  };

  if (errors.name || errors.email || errors.message) {
    return json(400, {
      success: false,
      message: "Please check the form fields.",
      errors,
    });
  }

  if (!env.RESEND_API_KEY) {
    console.error("RESEND_API_KEY is not set");
    return json(500, {
      success: false,
      message: "Email is not configured yet.",
    });
  }

  const response = await fetchImpl(RESEND_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: formatSender(env.CONTACT_FROM_EMAIL),
      to: [env.CONTACT_TO_EMAIL || DEFAULT_TO],
      reply_to: email,
      subject: `Portfolio contact: ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      html: `<p><strong>Name:</strong> ${escapeHtml(name)}<br><strong>Email:</strong> ${escapeHtml(email)}</p><p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>`,
    }),
  });

  if (!response.ok) {
    console.error("Resend error", response.status, await response.text());
    return json(502, {
      success: false,
      message: "Sending failed. Please try again later.",
    });
  }

  return json(200, {
    success: true,
    message: "Thanks! Your message has been sent.",
  });
}

export default (request) => handleContact(request);

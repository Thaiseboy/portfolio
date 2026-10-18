import {
  sanitizeInput,
  validateEmail,
  validateMessage,
  validateName,
} from "../../src/utils/contactValidation.js";
import { isUuid, messageId } from "../../studio/shared/replyRules.js";
import { buildContactEmail } from "../emails/contactEmail.mjs";
import {
  json,
  ownerAddress,
  readJson,
  sendMail,
  studioMessageHref,
  writeClient,
} from "../lib/inbox.mjs";

export { formatSender } from "../lib/inbox.mjs";

// A contact form message: stored in the Studio inbox (with SANITY_WRITE_TOKEN) and mailed to Get
// through Resend (RESEND_API_KEY). Either one is enough for the visitor to see "sent".

const SENT = { success: true, message: "Thanks! Your message has been sent." };

export async function handleContact(
  request,
  env = process.env,
  fetchImpl = fetch,
  client = writeClient(env),
) {
  if (request.method !== "POST") {
    return json(405, { success: false, message: "Method not allowed." });
  }

  const body = await readJson(request);

  if (!body) {
    return json(400, { success: false, message: "Invalid request." });
  }

  // Honeypot: real visitors never see or fill this field.
  if (body.website) {
    return json(200, SENT);
  }

  const name = sanitizeInput(String(body.name ?? ""));
  const email = sanitizeInput(String(body.email ?? ""));
  const message = sanitizeInput(String(body.message ?? ""));
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

  // The form's request id: a repeat after a timeout is stored and mailed once.
  const id = messageId(
    isUuid(body.requestId) ? body.requestId : crypto.randomUUID(),
  );
  const receivedAt = new Date();
  let stored = false;

  if (client) {
    try {
      await client.createIfNotExists({
        _id: id,
        _type: "contactMessage",
        name,
        email,
        message,
        receivedAt: receivedAt.toISOString(),
        unread: true,
      });
      stored = true;
    } catch (error) {
      console.error(
        "Message could not be stored",
        error instanceof Error ? error.message : error,
      );
    }
  }

  const mail = buildContactEmail({
    name,
    email,
    message,
    sentAt: receivedAt,
    studioHref: stored ? studioMessageHref(id, env) : null,
  });
  const result = await sendMail(
    {
      ...mail,
      to: [ownerAddress(env)],
      replyTo: email,
      idempotencyKey: `${id}-notify`,
    },
    env,
    fetchImpl,
  );

  if (result.status === "sent" || stored) {
    return json(200, SENT);
  }

  return result.status === "notConfigured"
    ? json(500, { success: false, message: "Email is not configured yet." })
    : json(502, {
        success: false,
        message: "Sending failed. Please try again later.",
      });
}

export default (request) => handleContact(request);

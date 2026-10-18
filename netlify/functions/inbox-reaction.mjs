import {
  isUuid,
  MAX_REACTION_LENGTH,
  MESSAGE_TYPE,
  normalizeReaction,
} from "../../studio/shared/replyRules.js";
import { buildReactionEmail } from "../emails/contactEmail.mjs";
import {
  json,
  ownerAddress,
  readJson,
  sendMail,
  studioMessageHref,
  verifyReactionLink,
  writeClient,
} from "../lib/inbox.mjs";

// The visitor's reaction through the personal link in a reply mail (/api/inbox-reaction).
// GET ?m=&code= only says whether the link works; POST stores plain text in the same message as a
// received, unread entry and mails Get. Nothing about the message is ever sent back, so a forwarded
// link leaks nothing.

const MAX_PER_DAY = 10;
const DAY_MS = 24 * 60 * 60 * 1000;

const loadMessage = (client, id) =>
  client.fetch(
    `*[_type == $type && _id == $id][0]{ _id, _rev, name, email,
      "replies": replies[]{ _key, direction, createdAt } }`,
    { type: MESSAGE_TYPE, id },
  );

export async function handleReaction(
  request,
  env = process.env,
  fetchImpl = fetch,
  client = writeClient(env),
) {
  if (!client) {
    console.error("Reaction refused: SANITY_WRITE_TOKEN is not set.");
    return json(503, { error: "unavailable" });
  }

  if (request.method === "GET") {
    const url = new URL(request.url);
    const id = verifyReactionLink(
      url.searchParams.get("m"),
      url.searchParams.get("code"),
      env,
    );
    const message = id ? await loadMessage(client, id).catch(() => null) : null;
    return message ? json(200, { valid: true }) : json(404, { valid: false });
  }

  if (request.method !== "POST")
    return json(405, { error: "method-not-allowed" });

  const body = await readJson(request);
  if (!body) return json(400, { error: "invalid-request" });

  // Honeypot: real visitors never see or fill this field.
  if (body.website) return json(200, { sent: true });

  const id = verifyReactionLink(body.m, body.code, env);
  if (!id) return json(404, { error: "invalid-link" });

  const text = normalizeReaction(body.message);
  if (!text) {
    return json(400, {
      error:
        typeof body.message === "string" && body.message.trim()
          ? "too-long"
          : "required",
      max: MAX_REACTION_LENGTH,
    });
  }

  // The page's request id: a repeat after a timeout is stored once.
  if (!isUuid(body.requestId)) return json(400, { error: "invalid-request" });
  const key = body.requestId;

  try {
    for (let attempt = 1; attempt <= 3; attempt += 1) {
      const message = await loadMessage(client, id);
      if (!message) return json(404, { error: "invalid-link" });

      const replies = message.replies ?? [];
      if (replies.some((item) => item._key === key))
        return json(200, { sent: true });

      const today = replies.filter(
        (item) =>
          item.direction === "received" &&
          Date.now() - Date.parse(item.createdAt ?? 0) < DAY_MS,
      );
      if (today.length >= MAX_PER_DAY)
        return json(429, { error: "rate-limited" });

      try {
        await client
          .patch(id)
          .ifRevisionId(message._rev)
          .setIfMissing({ replies: [] })
          .append("replies", [
            {
              _key: key,
              _type: "messageReply",
              direction: "received",
              createdAt: new Date().toISOString(),
              message: text,
            },
          ])
          .set({ unread: true })
          .commit();
      } catch (error) {
        // Changed meanwhile (e.g. in the Studio): read and decide again.
        if (attempt === 3) throw error;
        continue;
      }

      // Stored already: a failing notification only means Get sees it in the Studio, not by mail.
      const mail = buildReactionEmail({
        name: message.name ?? "",
        email: message.email ?? "",
        message: text,
        studioHref: studioMessageHref(id, env),
      });
      await sendMail(
        {
          ...mail,
          to: [ownerAddress(env)],
          ...(message.email ? { replyTo: message.email } : {}),
          idempotencyKey: `${id}-reaction-${key}`,
        },
        env,
        fetchImpl,
      );
      return json(200, { sent: true });
    }
  } catch (error) {
    console.error(
      "Reaction could not be stored",
      error instanceof Error ? error.message : error,
    );
  }

  return json(503, { error: "unavailable" });
}

export default (request) => handleReaction(request);

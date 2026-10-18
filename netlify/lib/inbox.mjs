import { createHmac, timingSafeEqual } from "node:crypto";
import { createClient } from "@sanity/client";
import {
  isUuid,
  MESSAGE_ID_PREFIX,
  MESSAGE_TYPE,
} from "../../studio/shared/replyRules.js";

// Shared by the contact, reply and reaction functions: settings, the Sanity write client, sending
// mail through Resend, checking a Studio user, and the personal reaction link. Server-only: the
// tokens and secrets come from Netlify environment variables.

export const SANITY_API_VERSION = "2025-08-15";
const RESEND_URL = "https://api.resend.com/emails";
const DEFAULT_FROM = "Portfolio <onboarding@resend.dev>";
// `openssl rand -hex 32`
const SECRET_PATTERN = /^[0-9a-f]{64}$/i;
const TOKEN_PATTERN = /^[A-Za-z0-9._~+/=-]{20,1024}$/;
const CALL_TIMEOUT_MS = 8_000;

export const json = (status, body, headers = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      ...headers,
    },
  });

export function sanityProject(env = process.env) {
  return {
    projectId:
      env.SANITY_PROJECT_ID || env.VITE_SANITY_PROJECT_ID || "w696z6zz",
    dataset:
      env.SANITY_DATASET || env.VITE_SANITY_DATASET || "portfolio-thaiseboy",
  };
}

/** Production links point to the real domain; deploy previews to their own URL. */
export function siteUrl(env = process.env) {
  const url =
    env.CONTEXT === "production" ? env.URL : env.DEPLOY_PRIME_URL || env.URL;
  return (url || "https://getdeveloper.nl").replace(/\/+$/, "");
}

export function studioMessageHref(id, env = process.env) {
  return `${siteUrl(env)}/studio/intent/edit/id=${encodeURIComponent(id)};type=${MESSAGE_TYPE}`;
}

/** Null without SANITY_WRITE_TOKEN: then messages are only mailed, not stored. */
export function writeClient(env = process.env) {
  return env.SANITY_WRITE_TOKEN
    ? createClient({
        ...sanityProject(env),
        apiVersion: SANITY_API_VERSION,
        token: env.SANITY_WRITE_TOKEN,
        useCdn: false,
        perspective: "raw",
      })
    : null;
}

// Resend wants "email@x" or "Name <email@x>"; "<email@x>" is sent as the bare address.
export function formatSender(value) {
  const sender = (value || "").trim();
  if (!sender) return DEFAULT_FROM;
  if (/^[^<>]+<[^<>\s]+@[^<>\s]+>$/.test(sender)) return sender;
  return sender.replace(/^<|>$/g, "").trim();
}

/**
 * Sends through Resend; never throws. With an idempotency key Resend sends the same mail once (for
 * 24 hours), so a repeat after a timeout cannot reach the recipient twice.
 */
export async function sendMail(mail, env = process.env, fetchImpl = fetch) {
  if (!env.RESEND_API_KEY) {
    console.error("RESEND_API_KEY is not set");
    return { status: "notConfigured" };
  }

  try {
    const response = await fetchImpl(RESEND_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
        ...(mail.idempotencyKey
          ? { "Idempotency-Key": mail.idempotencyKey }
          : {}),
      },
      body: JSON.stringify({
        from: formatSender(env.CONTACT_FROM_EMAIL),
        to: mail.to,
        ...(mail.replyTo ? { reply_to: mail.replyTo } : {}),
        subject: mail.subject,
        text: mail.text,
        html: mail.html,
        ...(mail.attachments?.length
          ? {
              attachments: mail.attachments.map((file) => ({
                filename: file.filename,
                content: file.content,
                content_type: file.contentType,
                ...(file.contentId ? { content_id: file.contentId } : {}),
              })),
            }
          : {}),
      }),
      signal: AbortSignal.timeout(15_000),
    });

    if (!response.ok) {
      const error = `${response.status} ${(await response.text()).slice(0, 180)}`;
      console.error("Resend error", error);
      return { status: "failed", error };
    }

    return { status: "sent" };
  } catch (error) {
    console.error(
      "Resend request failed",
      error instanceof Error ? error.message : error,
    );
    return { status: "failed", error: "Resend did not answer" };
  }
}

/** The address mail to Get goes to. */
export function ownerAddress(env = process.env) {
  return env.CONTACT_TO_EMAIL || "get_sarun@hotmail.com";
}

// --- Studio user -------------------------------------------------------------------------------

export function bearerToken(header) {
  const match = /^Bearer ([^\s]+)$/.exec(header?.trim() ?? "");
  return match && TOKEN_PATTERN.test(match[1]) ? match[1] : null;
}

/**
 * The Studio user's own token, checked with Sanity: who it is, and whether they may change this
 * message (a dry-run patch, nothing changes). "ok" with the user's name, or why not.
 */
export async function checkStudioUser(
  token,
  messageId,
  env = process.env,
  fetchImpl = fetch,
) {
  const { projectId, dataset } = sanityProject(env);
  const base = `https://${projectId}.api.sanity.io/v${SANITY_API_VERSION}`;
  const headers = { Authorization: `Bearer ${token}` };

  try {
    const me = await fetchImpl(`${base}/users/me`, {
      headers,
      signal: AbortSignal.timeout(CALL_TIMEOUT_MS),
    });
    if (me.status === 401 || me.status === 403)
      return { status: "unauthenticated" };
    if (!me.ok) return { status: "unavailable" };

    const user = await me.json().catch(() => null);
    if (typeof user?.id !== "string" || !user.id)
      return { status: "unauthenticated" };

    const dryRun = await fetchImpl(
      `${base}/data/mutate/${dataset}?dryRun=true&returnIds=false`,
      {
        method: "POST",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({
          mutations: [
            {
              patch: {
                id: messageId,
                set: { lastCheckedAt: new Date().toISOString() },
              },
            },
          ],
        }),
        signal: AbortSignal.timeout(CALL_TIMEOUT_MS),
      },
    );
    if (dryRun.status === 401 || dryRun.status === 403)
      return { status: "forbidden" };
    if (dryRun.status === 404) return { status: "notFound" };
    if (!dryRun.ok) return { status: "unavailable" };

    const name =
      typeof user.name === "string" && user.name.trim()
        ? user.name.trim().slice(0, 100)
        : null;
    return { status: "ok", name };
  } catch {
    return { status: "unavailable" };
  }
}

// --- Reaction link -----------------------------------------------------------------------------

function secret(env) {
  const value = env.MESSAGE_SECRET?.trim() ?? "";
  return SECRET_PATTERN.test(value) ? Buffer.from(value, "hex") : null;
}

/** The secret code for a message (base64url HMAC of its id); null without MESSAGE_SECRET. */
export function reactionCode(messageId, env = process.env) {
  const key = secret(env);
  return key
    ? createHmac("sha256", key)
        .update(`reaction\n${messageId}`)
        .digest("base64url")
    : null;
}

/** The visitor's personal link; null without a secret, so the mail then has no button. */
export function reactionHref(messageId, env = process.env) {
  const uuid = messageId.slice(MESSAGE_ID_PREFIX.length);
  const code = reactionCode(messageId, env);
  return code && isUuid(uuid)
    ? `${siteUrl(env)}/reply?m=${uuid}&code=${code}`
    : null;
}

/** The message id for a genuine link, else null. */
export function verifyReactionLink(uuid, code, env = process.env) {
  if (
    !isUuid(uuid) ||
    typeof code !== "string" ||
    !/^[A-Za-z0-9_-]{43}$/.test(code)
  )
    return null;
  const id = `${MESSAGE_ID_PREFIX}${uuid}`;
  const expected = reactionCode(id, env);
  return expected && timingSafeEqual(Buffer.from(code), Buffer.from(expected))
    ? id
    : null;
}

/** JSON body of at most `maxBytes`, or null. */
export async function readJson(request, maxBytes = 64 * 1024) {
  if (Number(request.headers.get("content-length") ?? 0) > maxBytes)
    return null;

  try {
    const text = await request.text();
    if (text.length > maxBytes) return null;
    const body = JSON.parse(text);
    return typeof body === "object" && body !== null && !Array.isArray(body)
      ? body
      : null;
  } catch {
    return null;
  }
}

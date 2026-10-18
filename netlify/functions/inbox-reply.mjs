import {
  isFileAssetId,
  isImageAssetId,
  isMessageId,
  isReplyKey,
  MAX_REPLY_FILES,
  MAX_REPLY_FILES_BYTES,
  MAX_REPLY_PHOTO_BYTES,
  MAX_REPLY_PHOTOS,
  MESSAGE_TYPE,
  normalizeReplyBody,
  normalizeReplySubject,
  REPLY_FILE_TYPES,
  REPLY_PHOTO_TYPES,
  replyBodyToText,
} from "../../studio/shared/replyRules.js";
import { buildReplyEmail } from "../emails/contactEmail.mjs";
import {
  bearerToken,
  checkStudioUser,
  json,
  ownerAddress,
  reactionHref,
  readJson,
  sendMail,
  writeClient,
} from "../lib/inbox.mjs";

// A reply from the Studio inbox to the visitor (POST /api/inbox-reply), always in the mail template.
// Only a signed-in Studio user who may edit the message can use it. `preview: true` only renders the
// mail; otherwise `key` (one per concept, made by the Studio) makes sure it is sent once: Resend
// refuses a second mail with the same idempotency key, and a sent reply is never sent again.

const SANITY_CDN = "https://cdn.sanity.io/";
/** Mail copy of a photo: at most twice the 500 px column, as JPEG. */
const PHOTO_TRANSFORM = "w=1000&fit=max&fm=jpg&q=80";
/** "pending" longer than this was interrupted and may be sent again (same key). */
const STALE_PENDING_MS = 10 * 60 * 1000;

const refuse = (error, status, headers) => json(status, { error }, headers);

/** {id, subject, body, files, photos} plus `preview: true` or a reply `key`; null when invalid. */
function readRequest(body) {
  const subject = normalizeReplySubject(body.subject);
  const blocks = normalizeReplyBody(body.body);
  const files = Array.isArray(body.files) ? body.files : [];
  const photos = Array.isArray(body.photos) ? body.photos : [];

  if (
    !isMessageId(body.id) ||
    !subject ||
    !blocks ||
    files.length > MAX_REPLY_FILES ||
    photos.length > MAX_REPLY_PHOTOS ||
    !files.every(isFileAssetId) ||
    !photos.every(isImageAssetId) ||
    new Set([...files, ...photos]).size !== files.length + photos.length
  ) {
    return null;
  }

  const request = { id: body.id, subject, body: blocks, files, photos };

  if (body.preview === true && body.key === undefined)
    return { ...request, preview: true };
  return body.preview === undefined && isReplyKey(body.key)
    ? { ...request, preview: false, key: body.key }
    : null;
}

/** The uploads as checked descriptions (from Sanity's asset records), or null when one is not allowed. */
async function loadAssets(client, files, photos) {
  if (files.length + photos.length === 0) return [];

  const records = await client.fetch(
    `*[_id in $ids && _type in ["sanity.fileAsset", "sanity.imageAsset"]]{ _id, _type, url, mimeType, size, originalFilename }`,
    { ids: [...files, ...photos] },
  );
  const byId = new Map(records.map((record) => [record._id, record]));
  const usable = (id, type, mimeTypes, maxBytes) => {
    const record = byId.get(id);
    return record?._type === type &&
      record.url?.startsWith(SANITY_CDN) &&
      mimeTypes.includes(record.mimeType) &&
      typeof record.size === "number" &&
      record.size <= maxBytes
      ? record
      : null;
  };
  const fileRecords = files.map((id) =>
    usable(id, "sanity.fileAsset", REPLY_FILE_TYPES, MAX_REPLY_FILES_BYTES),
  );
  const photoRecords = photos.map((id) =>
    usable(id, "sanity.imageAsset", REPLY_PHOTO_TYPES, MAX_REPLY_PHOTO_BYTES),
  );

  if (
    [...fileRecords, ...photoRecords].some((record) => !record) ||
    fileRecords.reduce((total, file) => total + file.size, 0) >
      MAX_REPLY_FILES_BYTES
  ) {
    return null;
  }

  return [
    ...photoRecords.map((photo, index) => ({
      url: `${photo.url}?${PHOTO_TRANSFORM}`,
      filename: `photo-${index + 1}.jpg`,
      contentType: "image/jpeg",
      contentId: `reply-photo-${index + 1}`,
      size: photo.size,
    })),
    ...fileRecords.map((file, index) => ({
      url: file.url,
      filename:
        (file.originalFilename ?? "")
          .split(/[\\/]/)
          .pop()
          .replace(/[\u0000-\u001f\u007f"]/g, "")
          .trim()
          .slice(0, 100) ||
        `attachment-${index + 1}.${file.mimeType === "application/pdf" ? "pdf" : file.mimeType === "image/png" ? "png" : "jpg"}`,
      contentType: file.mimeType,
      size: file.size,
    })),
  ];
}

/** Downloads the uploads from the Sanity CDN; throws when one fails, so nothing half is sent. */
async function download(assets, fetchImpl) {
  return Promise.all(
    assets.map(async (asset) => {
      const response = await fetchImpl(asset.url, {
        signal: AbortSignal.timeout(15_000),
      });
      if (!response.ok)
        throw new Error(`Attachment download HTTP ${response.status}`);
      return {
        filename: asset.filename,
        content: Buffer.from(await response.arrayBuffer()).toString("base64"),
        contentType: asset.contentType,
        ...(asset.contentId ? { contentId: asset.contentId } : {}),
      };
    }),
  );
}

function references(type, ids) {
  return ids.map((id, index) => ({
    _key: `${type}${index}`,
    _type: type,
    asset: { _type: "reference", _ref: id },
  }));
}

const sameDraft = (draft, request) =>
  normalizeReplySubject(draft?.subject) === request.subject &&
  JSON.stringify(normalizeReplyBody(draft?.body)) ===
    JSON.stringify(request.body);

export async function handleReply(
  request,
  env = process.env,
  fetchImpl = fetch,
  client = writeClient(env),
) {
  if (request.method !== "POST") return refuse("method-not-allowed", 405);

  const token = bearerToken(request.headers.get("authorization"));
  if (!token)
    return refuse("unauthenticated", 401, { "WWW-Authenticate": "Bearer" });

  const body = await readJson(request);
  const reply = body && readRequest(body);
  if (!reply) return refuse("invalid-request", 400);

  const user = await checkStudioUser(token, reply.id, env, fetchImpl);
  if (user.status !== "ok") {
    const status =
      { unauthenticated: 401, forbidden: 403, notFound: 404 }[user.status] ??
      503;
    return refuse(user.status, status);
  }

  if (!client) {
    console.error("Inbox reply refused: SANITY_WRITE_TOKEN is not set.");
    return refuse("not-configured", 503);
  }

  const loadMessage = () =>
    client.fetch(
      `*[_type == $type && _id == $id][0]{ _id, _rev, name, email, message, replyDraft,
        "replies": replies[]{ _key, status, lastAttemptAt } }`,
      { type: MESSAGE_TYPE, id: reply.id },
    );

  try {
    const message = await loadMessage();
    if (!message) return refuse("not-found", 404);

    const assets = await loadAssets(client, reply.files, reply.photos);
    if (!assets) return refuse("invalid-attachments", 422);

    const plain = replyBodyToText(reply.body);
    const mail = buildReplyEmail({
      subject: reply.subject,
      body: reply.body,
      plain,
      photos: assets.filter((asset) => asset.contentId),
      reactionHref: reactionHref(reply.id, env),
      original: message.message,
    });

    if (reply.preview) {
      // Photos straight from the Sanity CDN, so the Studio can show them without attachments.
      const html = assets.reduce(
        (result, asset) =>
          asset.contentId
            ? result.replaceAll(`cid:${asset.contentId}`, asset.url)
            : result,
        mail.html,
      );
      return json(200, {
        to: message.email,
        subject: mail.subject,
        html,
        attachments: assets
          .filter((asset) => !asset.contentId)
          .map(({ filename, size }) => ({ filename, size })),
      });
    }

    const path = `replies[_key=="${reply.key}"]`;
    let current = message;
    let recorded = false;

    // The Studio saves the concept while typing, so the revision may just have changed: read again.
    for (let attempt = 1; attempt <= 3 && !recorded; attempt += 1) {
      const existing = current.replies?.find((item) => item._key === reply.key);
      const now = new Date().toISOString();

      if (existing?.status === "sent") return json(200, { status: "sent" });

      if (
        existing?.status === "pending" &&
        Date.now() - Date.parse(existing.lastAttemptAt ?? 0) < STALE_PENDING_MS
      ) {
        return refuse("in-progress", 409);
      }

      try {
        if (existing) {
          // An earlier attempt failed or was interrupted: same key, so Resend sends it at most once.
          await client
            .patch(reply.id)
            .ifRevisionId(current._rev)
            .set({
              [`${path}.status`]: "pending",
              [`${path}.lastAttemptAt`]: now,
            })
            .commit();
        } else {
          await client
            .patch(reply.id)
            .ifRevisionId(current._rev)
            .setIfMissing({ replies: [] })
            .append("replies", [
              {
                _key: reply.key,
                _type: "messageReply",
                direction: "sent",
                status: "pending",
                createdAt: now,
                lastAttemptAt: now,
                sentBy: user.name,
                to: message.email,
                subject: reply.subject,
                body: reply.body,
                message: plain,
                files: references("file", reply.files),
                photos: references("image", reply.photos),
              },
            ])
            .commit();
        }
        recorded = true;
      } catch (error) {
        if (attempt === 3) throw error;
        current = (await loadMessage()) ?? current;
      }
    }

    let result;

    try {
      const attachments = await download(assets, fetchImpl);
      result = await sendMail(
        {
          ...mail,
          to: [message.email],
          // Visitors answer Get directly; contact@ cannot receive mail.
          replyTo: ownerAddress(env),
          attachments,
          idempotencyKey: `${reply.id}-reply-${reply.key}`,
        },
        env,
        fetchImpl,
      );
    } catch (error) {
      console.error(
        "Reply attachment could not be downloaded",
        error instanceof Error ? error.message : error,
      );
      result = {
        status: "failed",
        error: "an attachment or photo could not be fetched",
      };
    }

    await client
      .patch(reply.id)
      .set({
        [`${path}.status`]: result.status,
        [`${path}.lastAttemptAt`]: new Date().toISOString(),
        ...(result.status === "sent"
          ? { [`${path}.sentAt`]: new Date().toISOString(), unread: false }
          : {}),
        ...(result.error ? { [`${path}.error`]: result.error } : {}),
      })
      .commit();

    // Empty the concept, unless it was changed meanwhile.
    if (result.status === "sent") {
      const latest = await loadMessage();
      if (latest && sameDraft(latest.replyDraft, reply)) {
        await client
          .patch(reply.id)
          .ifRevisionId(latest._rev)
          .unset(["replyDraft"])
          .commit()
          .catch(() => undefined);
      }
    }

    return json(200, { status: result.status });
  } catch (error) {
    console.error(
      "Inbox reply could not be processed",
      error instanceof Error ? error.message : error,
    );
    return refuse("unavailable", 503);
  }
}

export default (request) => handleReply(request);

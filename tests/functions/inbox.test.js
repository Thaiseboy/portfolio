// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
import { handleContact } from "../../netlify/functions/contact.mjs";
import { handleReaction } from "../../netlify/functions/inbox-reaction.mjs";
import { handleReply } from "../../netlify/functions/inbox-reply.mjs";
import { reactionHref, verifyReactionLink } from "../../netlify/lib/inbox.mjs";
import { fakeSanity } from "../support/fakeSanity.js";

const UUID = "0b7f4f5c-1c2d-4e5f-8a9b-0c1d2e3f4a5b";
const ID = `message.${UUID}`;
const KEY = "6f1e2d3c-4b5a-4c6d-8e7f-9a0b1c2d3e4f";
const FILE = `file-${"a".repeat(40)}-pdf`;
const PHOTO = `image-${"b".repeat(40)}-800x600-jpg`;
const env = {
  RESEND_API_KEY: "re_test",
  SANITY_WRITE_TOKEN: "sk_test",
  MESSAGE_SECRET: "c".repeat(64),
  CONTEXT: "production",
  URL: "https://getdeveloper.nl",
  CONTACT_FROM_EMAIL: "Getdeveloper <contact@getdeveloper.nl>",
};
const TOKEN = "studio-user-token-1234567890";

const message = () => ({
  [ID]: {
    _id: ID,
    _type: "contactMessage",
    name: "Jane Doe",
    email: "jane@example.com",
    message: "Can we work together?",
    receivedAt: "2026-10-18T10:00:00Z",
    unread: true,
    replies: [],
  },
});

const assets = {
  [FILE]: { _id: FILE, _type: "sanity.fileAsset", url: "https://cdn.sanity.io/files/x/y/cv.pdf", mimeType: "application/pdf", size: 2000, originalFilename: "cv.pdf" },
  [PHOTO]: { _id: PHOTO, _type: "sanity.imageAsset", url: "https://cdn.sanity.io/images/x/y/photo.jpg", mimeType: "image/jpeg", size: 3000, originalFilename: "photo.jpg" },
};

const body = [{ _type: "block", _key: "a", style: "normal", markDefs: [], children: [{ _type: "span", _key: "a1", text: "Hi Jane, sure!", marks: ["strong"] }] }];

/** Sanity user and dry run answer "allowed"; CDN downloads and Resend succeed. */
function fakeFetch({ user = { id: "u1", name: "Get" }, dryRunStatus = 200, resendStatus = 200 } = {}) {
  return vi.fn(async (url) => {
    const href = String(url);
    if (href.endsWith("/users/me")) return new Response(JSON.stringify(user), { status: user ? 200 : 401 });
    if (href.includes("/data/mutate/")) return new Response("{}", { status: dryRunStatus });
    if (href.startsWith("https://cdn.sanity.io/")) return new Response(new Uint8Array([1, 2, 3]));
    if (href === "https://api.resend.com/emails") return new Response(JSON.stringify({ id: "m1" }), { status: resendStatus });
    throw new Error(`unexpected fetch ${href}`);
  });
}

const replyRequest = (payload, token = TOKEN) =>
  new Request("https://getdeveloper.nl/api/inbox-reply", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify(payload),
  });

const resendCalls = (fetchImpl) =>
  fetchImpl.mock.calls.filter(([url]) => String(url) === "https://api.resend.com/emails");

describe("contact form storage", () => {
  it("stores the message as unread and links the notification to the Studio", async () => {
    const client = fakeSanity();
    const fetchImpl = fakeFetch();
    const response = await handleContact(
      new Request("https://getdeveloper.nl/api/contact", {
        method: "POST",
        body: JSON.stringify({ name: "Jane Doe", email: "jane@example.com", message: "Hello Get, can we talk?", requestId: UUID }),
      }),
      env,
      fetchImpl,
      client,
    );

    expect(response.status).toBe(200);
    expect(client.store[ID]).toMatchObject({ name: "Jane Doe", unread: true });
    const [, options] = resendCalls(fetchImpl)[0];
    expect(options.headers["Idempotency-Key"]).toBe(`${ID}-notify`);
    expect(JSON.parse(options.body).html).toContain(`/studio/intent/edit/id=${encodeURIComponent(ID)};type=contactMessage`);
  });
});

describe("reaction link", () => {
  it("only accepts the code made for this message", () => {
    const href = new URL(reactionHref(ID, env));
    expect(href.origin + href.pathname).toBe("https://getdeveloper.nl/reply");
    expect(verifyReactionLink(href.searchParams.get("m"), href.searchParams.get("code"), env)).toBe(ID);
    expect(verifyReactionLink("1b7f4f5c-1c2d-4e5f-8a9b-0c1d2e3f4a5b", href.searchParams.get("code"), env)).toBeNull();
    expect(reactionHref(ID, { ...env, MESSAGE_SECRET: "" })).toBeNull();
  });
});

describe("inbox reply", () => {
  const send = { id: ID, subject: "Re: your message", body, files: [FILE], photos: [PHOTO], key: KEY };

  it("needs a Studio login that may edit the message", async () => {
    const client = fakeSanity({ docs: message(), assets });
    expect((await handleReply(replyRequest(send, null), env, fakeFetch(), client)).status).toBe(401);
    expect((await handleReply(replyRequest(send), env, fakeFetch({ user: null }), client)).status).toBe(401);
    expect((await handleReply(replyRequest(send), env, fakeFetch({ dryRunStatus: 403 }), client)).status).toBe(403);
  });

  it("renders a preview with the photo from the CDN and the attachment list", async () => {
    const client = fakeSanity({ docs: message(), assets });
    const { key, ...rest } = send;
    const response = await handleReply(replyRequest({ ...rest, preview: true }), env, fakeFetch(), client);
    const preview = await response.json();

    expect(key).toBeTruthy();
    expect(response.status).toBe(200);
    expect(preview.to).toBe("jane@example.com");
    expect(preview.html).toContain("https://cdn.sanity.io/images/x/y/photo.jpg?w=1000");
    expect(preview.html).toContain("<strong>Hi Jane, sure!</strong>");
    expect(preview.attachments).toEqual([{ filename: "cv.pdf", size: 2000 }]);
    expect(client.store[ID].replies).toHaveLength(0);
  });

  it("sends once with attachments, records it, marks the message read and empties the concept", async () => {
    const docs = message();
    docs[ID].replyDraft = { subject: send.subject, body };
    const client = fakeSanity({ docs, assets });
    const fetchImpl = fakeFetch();

    const first = await handleReply(replyRequest(send), env, fetchImpl, client);
    const again = await handleReply(replyRequest(send), env, fetchImpl, client);

    expect(await first.json()).toEqual({ status: "sent" });
    expect(await again.json()).toEqual({ status: "sent" });
    expect(resendCalls(fetchImpl)).toHaveLength(1);

    const [, options] = resendCalls(fetchImpl)[0];
    const payload = JSON.parse(options.body);
    expect(options.headers["Idempotency-Key"]).toBe(`${ID}-reply-${KEY}`);
    expect(payload.to).toEqual(["jane@example.com"]);
    expect(payload.reply_to).toBe("get_sarun@hotmail.com");
    expect(payload.attachments.map((file) => file.filename)).toEqual(["photo-1.jpg", "cv.pdf"]);
    expect(payload.html).toContain("/reply?m=");

    const stored = client.store[ID];
    expect(stored.replies[0]).toMatchObject({ _key: KEY, direction: "sent", status: "sent", sentBy: "Get" });
    expect(stored.unread).toBe(false);
    expect(stored.replyDraft).toBeUndefined();
  });

  it("records a failure and may be sent again with the same key", async () => {
    const client = fakeSanity({ docs: message(), assets });
    const failed = await handleReply(replyRequest(send), env, fakeFetch({ resendStatus: 500 }), client);
    expect(await failed.json()).toEqual({ status: "failed" });
    expect(client.store[ID].replies[0].status).toBe("failed");

    const fetchImpl = fakeFetch();
    const retry = await handleReply(replyRequest(send), env, fetchImpl, client);
    expect(await retry.json()).toEqual({ status: "sent" });
    expect(client.store[ID].replies).toHaveLength(1);
    expect(resendCalls(fetchImpl)[0][1].headers["Idempotency-Key"]).toBe(`${ID}-reply-${KEY}`);
  });

  it("survives the concept being saved meanwhile", async () => {
    const client = fakeSanity({ docs: message(), assets });
    client.conflicts = 1;
    const response = await handleReply(replyRequest(send), env, fakeFetch(), client);
    expect(await response.json()).toEqual({ status: "sent" });
    expect(client.store[ID].replies).toHaveLength(1);
  });

  it("refuses unknown or foreign uploads and invalid requests", async () => {
    const client = fakeSanity({ docs: message(), assets: { [FILE]: { ...assets[FILE], url: "https://evil.example/x.pdf" } } });
    expect((await handleReply(replyRequest(send), env, fakeFetch(), client)).status).toBe(422);
    expect((await handleReply(replyRequest({ ...send, subject: "" }), env, fakeFetch(), client)).status).toBe(400);
    expect((await handleReply(replyRequest({ ...send, id: "project.1" }), env, fakeFetch(), client)).status).toBe(400);
  });
});

describe("visitor reaction", () => {
  const link = () => {
    const href = new URL(reactionHref(ID, env));
    return { m: href.searchParams.get("m"), code: href.searchParams.get("code") };
  };
  const post = (payload) =>
    new Request("https://getdeveloper.nl/api/inbox-reaction", { method: "POST", body: JSON.stringify(payload) });

  it("tells the page whether the link works, without any details", async () => {
    const client = fakeSanity({ docs: message() });
    const { m, code } = link();
    const ok = await handleReaction(new Request(`https://getdeveloper.nl/api/inbox-reaction?m=${m}&code=${code}`), env, fakeFetch(), client);
    const bad = await handleReaction(new Request(`https://getdeveloper.nl/api/inbox-reaction?m=${m}&code=${"x".repeat(43)}`), env, fakeFetch(), client);

    expect(await ok.json()).toEqual({ valid: true });
    expect(bad.status).toBe(404);
  });

  it("stores the reaction once in the same message, marks it unread and mails Get", async () => {
    const docs = message();
    docs[ID].unread = false;
    const client = fakeSanity({ docs });
    const fetchImpl = fakeFetch();
    const payload = { ...link(), message: "Thanks! One more question.", requestId: KEY };

    expect((await handleReaction(post(payload), env, fetchImpl, client)).status).toBe(200);
    expect((await handleReaction(post(payload), env, fetchImpl, client)).status).toBe(200);

    const stored = client.store[ID];
    expect(stored.replies).toHaveLength(1);
    expect(stored.replies[0]).toMatchObject({ direction: "received", message: "Thanks! One more question." });
    expect(stored.unread).toBe(true);
    const [, options] = resendCalls(fetchImpl)[0];
    expect(JSON.parse(options.body)).toMatchObject({ to: ["get_sarun@hotmail.com"], reply_to: "jane@example.com" });
  });

  it("refuses a fake link, an empty message and more than 10 a day; drops honeypot posts", async () => {
    const docs = message();
    docs[ID].replies = Array.from({ length: 10 }, (_, index) => ({
      _key: `r${index}`,
      direction: "received",
      createdAt: new Date().toISOString(),
      message: "hi",
    }));
    const client = fakeSanity({ docs });

    expect((await handleReaction(post({ ...link(), code: "y".repeat(43), message: "hi", requestId: KEY }), env, fakeFetch(), client)).status).toBe(404);
    expect((await handleReaction(post({ ...link(), message: "  ", requestId: KEY }), env, fakeFetch(), client)).status).toBe(400);
    expect((await handleReaction(post({ ...link(), message: "hi", requestId: KEY }), env, fakeFetch(), client)).status).toBe(429);

    const honeypot = await handleReaction(post({ ...link(), message: "spam", requestId: KEY, website: "x" }), env, fakeFetch(), client);
    expect(honeypot.status).toBe(200);
    expect(client.store[ID].replies).toHaveLength(10);
  });
});

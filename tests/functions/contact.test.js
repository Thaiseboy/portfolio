// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
import {
  formatSender,
  handleContact,
} from "../../netlify/functions/contact.mjs";

const post = (body) =>
  new Request("https://getdeveloper.nl/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });

const validBody = {
  name: "Jane Doe",
  email: "jane@example.com",
  message: "Hello Get, I would like to work together.",
};

const env = { RESEND_API_KEY: "re_test_key" };
const resendOk = () =>
  vi
    .fn()
    .mockResolvedValue(
      new Response(JSON.stringify({ id: "1" }), { status: 200 }),
    );

describe("contact function", () => {
  it("sends a valid message through Resend with the visitor as reply-to", async () => {
    const fetchImpl = resendOk();

    const response = await handleContact(post(validBody), env, fetchImpl);

    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ success: true });
    const [url, options] = fetchImpl.mock.calls[0];
    expect(url).toBe("https://api.resend.com/emails");
    expect(options.headers.Authorization).toBe("Bearer re_test_key");
    const payload = JSON.parse(options.body);
    expect(payload.to).toEqual(["get_sarun@hotmail.com"]);
    expect(payload.reply_to).toBe("jane@example.com");
    expect(payload.subject).toBe("Portfolio contact: Jane Doe");
  });

  it("uses the configured sender and recipient", async () => {
    const fetchImpl = resendOk();

    await handleContact(
      post(validBody),
      {
        ...env,
        CONTACT_TO_EMAIL: "me@getdeveloper.nl",
        CONTACT_FROM_EMAIL: "Portfolio <contact@getdeveloper.nl>",
      },
      fetchImpl,
    );

    const payload = JSON.parse(fetchImpl.mock.calls[0][1].body);
    expect(payload.to).toEqual(["me@getdeveloper.nl"]);
    expect(payload.from).toBe("Portfolio <contact@getdeveloper.nl>");
  });

  it("sends from the bare address unless a display name is configured", () => {
    expect(formatSender("<contact@getdeveloper.nl>")).toBe(
      "contact@getdeveloper.nl",
    );
    expect(formatSender("contact@getdeveloper.nl")).toBe(
      "contact@getdeveloper.nl",
    );
    expect(formatSender("Get <contact@getdeveloper.nl>")).toBe(
      "Get <contact@getdeveloper.nl>",
    );
    expect(formatSender("")).toBe("Portfolio <onboarding@resend.dev>");
  });

  it("ignores a recipient sent by the browser", async () => {
    const fetchImpl = resendOk();

    await handleContact(
      post({ ...validBody, to: "someone@else.com" }),
      env,
      fetchImpl,
    );

    expect(JSON.parse(fetchImpl.mock.calls[0][1].body).to).toEqual([
      "get_sarun@hotmail.com",
    ]);
  });

  it("rejects invalid fields without calling Resend", async () => {
    const fetchImpl = resendOk();

    const response = await handleContact(
      post({ name: "J", email: "nope", message: "short" }),
      env,
      fetchImpl,
    );

    expect(response.status).toBe(400);
    const result = await response.json();
    expect(result.errors.name).toBeTruthy();
    expect(result.errors.email).toBeTruthy();
    expect(result.errors.message).toBeTruthy();
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("quietly accepts but drops honeypot submissions", async () => {
    const fetchImpl = resendOk();

    const response = await handleContact(
      post({ ...validBody, website: "spam.example" }),
      env,
      fetchImpl,
    );

    expect(response.status).toBe(200);
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("escapes HTML in the email body", async () => {
    const fetchImpl = resendOk();

    await handleContact(
      post({
        ...validBody,
        message: "Hi there & \"quotes\" and 'apostrophes' here",
      }),
      env,
      fetchImpl,
    );

    const { html } = JSON.parse(fetchImpl.mock.calls[0][1].body);
    expect(html).toContain("&amp;");
    expect(html).toContain("&quot;quotes&quot;");
  });

  it("fails clearly when the API key is missing or Resend errors", async () => {
    const missingKey = await handleContact(post(validBody), {}, resendOk());
    expect(missingKey.status).toBe(500);

    const failing = vi
      .fn()
      .mockResolvedValue(new Response("bad", { status: 422 }));
    const resendError = await handleContact(post(validBody), env, failing);
    expect(resendError.status).toBe(502);
  });

  it("only accepts POST with a JSON body", async () => {
    const get = await handleContact(
      new Request("https://getdeveloper.nl/api/contact"),
      env,
      resendOk(),
    );
    expect(get.status).toBe(405);

    const broken = await handleContact(post("{not json"), env, resendOk());
    expect(broken.status).toBe(400);
  });
});

import { useEffect, useRef, useState } from "react";
import wordmarkForLight from "@/assets/brand/wordmark-light.svg";
import wordmarkForDark from "@/assets/brand/wordmark-dark.svg";

// The page behind "Reply to this message" in a reply mail (/reply?m=…&code=…). It shows nothing about
// the earlier conversation, so a forwarded link leaks nothing; the visitor can only send plain text,
// which arrives in the same message in the Studio inbox.

const ENDPOINT = "/api/inbox-reaction";
const MAX_LENGTH = 3000;

const ERRORS = {
  required: "Please write a message.",
  "too-long": `Your message can be at most ${MAX_LENGTH} characters.`,
  "rate-limited":
    "You've sent a lot of messages today. Please try again tomorrow, or email me directly.",
  "invalid-link": "This link doesn't work (anymore).",
};

export default function ReplyPage() {
  const params = new window.URLSearchParams(window.location.search);
  const m = params.get("m") ?? "";
  const code = params.get("code") ?? "";
  const [state, setState] = useState("checking");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  // One id per message: a repeat after a timeout is stored once; new after sending.
  const [requestId, setRequestId] = useState(() => window.crypto.randomUUID());
  const alert = useRef(null);

  useEffect(() => {
    // Reached only through a personal link: keep it out of search engines.
    const robots = document.createElement("meta");
    robots.name = "robots";
    robots.content = "noindex, nofollow";
    document.head.append(robots);
    document.title = "Reply to Get | getdeveloper.nl";

    fetch(`${ENDPOINT}?${new window.URLSearchParams({ m, code })}`)
      .then((response) => setState(response.ok ? "form" : "invalid"))
      .catch(() => setState("form"));

    return () => robots.remove();
  }, [m, code]);

  useEffect(() => {
    if (error || state === "sent") alert.current?.focus();
  }, [error, state]);

  async function submit(event) {
    event.preventDefault();
    setError("");

    if (!message.trim()) {
      setError(ERRORS.required);
      return;
    }

    setBusy(true);

    try {
      const response = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ m, code, message, requestId, website }),
      });
      const result = await response.json().catch(() => null);

      if (response.ok) {
        setState("sent");
        setMessage("");
        setRequestId(window.crypto.randomUUID());
      } else if (result?.error === "invalid-link") {
        setState("invalid");
      } else {
        setError(
          ERRORS[result?.error] ??
            "Sending failed. Please try again in a moment.",
        );
      }
    } catch {
      setError("Sending failed. Please check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid-paper min-h-screen">
      <header className="border-b-2 border-ink bg-paper/90">
        <div className="container flex h-[var(--header-height)] items-center">
          <a href="/" aria-label="getdeveloper, home">
            <img
              src={wordmarkForLight}
              alt="get<developer/>"
              className="h-6 w-auto dark:hidden sm:h-7"
            />
            <img
              src={wordmarkForDark}
              alt="get<developer/>"
              className="hidden h-6 w-auto dark:block sm:h-7"
            />
          </a>
        </div>
      </header>

      <main className="container py-16 md:py-24">
        <div className="mx-auto max-w-2xl">
          <p className="tag m-0">Reply</p>
          <h1 className="section-heading mb-4 mt-6">
            Reply to Get<span className="animate-blink text-accent">_</span>
          </h1>

          {state === "checking" && (
            <p className="font-mono text-sm text-grey">Checking your link…</p>
          )}

          {state === "invalid" && (
            <div ref={alert} tabIndex={-1} className="card-brutal p-6">
              <p className="m-0 text-lg font-bold">
                This link doesn&apos;t work (anymore).
              </p>
              <p className="mb-0 mt-3 text-grey">
                You can still reach me through the contact form on{" "}
                <a
                  href="/#contact"
                  className="font-bold text-accent underline underline-offset-4"
                >
                  getdeveloper.nl
                </a>
                .
              </p>
            </div>
          )}

          {state === "sent" && (
            <div
              ref={alert}
              tabIndex={-1}
              role="status"
              className="card-brutal p-6"
            >
              <p className="m-0 text-lg font-bold">
                Thanks! Your reply has been sent.
              </p>
              <p className="mb-0 mt-3 text-grey">
                I&apos;ll get back to you by email.
              </p>
              <button
                type="button"
                className="btn btn-ghost mt-6"
                onClick={() => setState("form")}
              >
                Send another message
              </button>
            </div>
          )}

          {state === "form" && (
            <form
              className="card-brutal flex flex-col gap-6 p-6 md:p-10"
              onSubmit={submit}
              noValidate
            >
              <p className="m-0 text-grey">
                Add a question or more details to your earlier message. Plain
                text only; I&apos;ll answer by email.
              </p>

              {error && (
                <div
                  ref={alert}
                  tabIndex={-1}
                  role="alert"
                  className="alert alert-danger m-0"
                >
                  {error}
                </div>
              )}

              {/* Honeypot: hidden from visitors and screen readers; bots fill it in. */}
              <div
                aria-hidden="true"
                className="absolute -left-[9999px] h-px w-px overflow-hidden"
              >
                <label htmlFor="website">Website</label>
                <input
                  id="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={website}
                  onChange={(event) => setWebsite(event.target.value)}
                />
              </div>

              <div>
                <label htmlFor="reaction" className="form-label">
                  Your message
                </label>
                <textarea
                  id="reaction"
                  rows={8}
                  required
                  maxLength={MAX_LENGTH}
                  className="form-control"
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                />
                <small className="mt-2 block text-right font-mono text-xs text-grey">
                  {message.length}/{MAX_LENGTH}
                </small>
              </div>

              <button
                type="submit"
                className="btn btn-accent self-start px-8 py-4"
                disabled={busy}
              >
                {busy ? "Sending..." : "Send reply →"}
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}

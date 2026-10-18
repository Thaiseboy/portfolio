import { useEffect } from "react";
import { useContactForm } from "@/hooks/useContactForm";
import { useCV } from "@/hooks/useCV";
import ErrorBoundary from "@/components/ui/ErrorBoundary.jsx";
import SkeletonLoader from "@/components/ui/SkeletonLoader.jsx";
import SectionHeader from "@/components/ui/SectionHeader.jsx";
import Reveal from "@/components/motion/Reveal.jsx";
import contactPhoto from "@/assets/foto/optimized/get2.jpeg";

const socials = [
  {
    href: "https://www.linkedin.com/in/get-ms-karanyawad",
    icon: "linkedin",
    label: "LinkedIn",
  },
  { href: "https://github.com/Thaiseboy/Hi-", icon: "github", label: "GitHub" },
];

export default function ContactPage() {
  const {
    form,
    updateField,
    isSubmitting,
    submitMessage,
    submitError,
    errors,
    isValid,
    validateField,
    submitForm,
  } = useContactForm();

  const { cvLink, cvLoading, fetchCV, downloadCV, retryFetchCV } = useCV();

  useEffect(() => {
    fetchCV();
  }, [fetchCV]);

  const sendEmail = async (event) => {
    event.preventDefault();
    await submitForm();
  };

  const bindField = (field) => ({
    value: form[field],
    onBlur: () => validateField(field),
    onChange: (event) => {
      updateField(field, event.target.value);
      validateField(field, event.target.value);
    },
  });

  return (
    <div className="section grid-paper border-t-2 border-ink">
      <div className="container">
        <SectionHeader
          index="04"
          eyebrow="Contact"
          title="Get in touch"
          intro="If you have more questions, feel free to ask."
        />

        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal className="flex flex-col gap-6">
            <div className="card-brutal flex items-center gap-5 p-5">
              <img
                src={contactPhoto}
                alt="Photo of Get Karanyawad"
                className="h-24 w-24 shrink-0 border-2 border-ink object-cover"
              />
              <div>
                <p className="m-0 text-xl font-bold">Get Karanyawad</p>
                <p className="m-0 mt-2 flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-grey">
                  <span className="h-2.5 w-2.5 animate-blink bg-accent" />{" "}
                  Frontend developer · NL
                </p>
              </div>
            </div>

            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost justify-between px-6 py-5 text-sm"
              >
                <span className="flex items-center gap-3">
                  <i className={`bi bi-${social.icon} text-xl`} />{" "}
                  {social.label}
                </span>
                <span aria-hidden="true">↗</span>
              </a>
            ))}

            <ErrorBoundary onRetry={retryFetchCV}>
              {cvLoading && (
                <SkeletonLoader type="box" width="100%" height="64px" />
              )}
              {!cvLoading && cvLink && (
                <button
                  type="button"
                  className="btn btn-accent justify-between px-6 py-5 text-sm"
                  onClick={downloadCV}
                >
                  <span className="flex items-center gap-3">
                    <i className="bi bi-file-earmark-arrow-down text-xl" />{" "}
                    Download CV
                  </span>
                  <span aria-hidden="true">↓</span>
                </button>
              )}
              {!cvLoading && !cvLink && (
                <p className="m-0 font-mono text-xs text-grey">
                  CV not available
                </p>
              )}
            </ErrorBoundary>
          </Reveal>

          <Reveal delay={0.1} className="card-brutal p-6 md:p-10">
            <form className="flex flex-col gap-6" onSubmit={sendEmail}>
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
                  value={form.website}
                  onChange={(event) =>
                    updateField("website", event.target.value)
                  }
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="name" className="form-label">
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    className={`form-control ${errors.name ? "is-invalid" : ""}`}
                    autoComplete="name"
                    maxLength="50"
                    {...bindField("name")}
                  />
                  {errors.name && (
                    <div className="invalid-feedback">{errors.name}</div>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    className={`form-control ${errors.email ? "is-invalid" : ""}`}
                    autoComplete="email"
                    maxLength="254"
                    {...bindField("email")}
                  />
                  {errors.email && (
                    <div className="invalid-feedback">{errors.email}</div>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="message" className="form-label">
                  Message
                </label>
                <textarea
                  id="message"
                  required
                  className={`form-control ${errors.message ? "is-invalid" : ""}`}
                  rows="6"
                  maxLength="1000"
                  {...bindField("message")}
                />
                {errors.message && (
                  <div className="invalid-feedback">{errors.message}</div>
                )}
                <small className="mt-2 block text-right font-mono text-xs text-grey">
                  {form.message.length}/1000
                </small>
              </div>

              <button
                type="submit"
                className="btn btn-accent self-start px-8 py-4"
                disabled={!isValid || isSubmitting}
                aria-label="Submit contact form"
              >
                {isSubmitting ? "Sending..." : "Send message →"}
              </button>

              {submitMessage && (
                <div className="alert alert-success">{submitMessage}</div>
              )}
              {submitError && (
                <div className="alert alert-danger">{submitError}</div>
              )}
            </form>
          </Reveal>
        </div>
      </div>
    </div>
  );
}

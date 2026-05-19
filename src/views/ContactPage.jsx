import { useEffect } from "react";
import { useContactForm } from "@/hooks/useContactForm";
import { useCV } from "@/hooks/useCV";
import ErrorBoundary from "@/components/ui/ErrorBoundary.jsx";
import SkeletonLoader from "@/components/ui/SkeletonLoader.jsx";
import contactPhoto from "@/assets/foto/optimized/get2.jpeg";

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
  }, []);

  const sendEmail = async (event) => {
    event.preventDefault();
    await submitForm("get_sarun@hotmail.com");
  };

  const bindField = (field) => ({
    value: form[field],
    onBlur: () => validateField(field),
    onChange: (event) => {
      updateField(field, event.target.value);
      validateField(field);
    },
  });

  return (
    <div className="page-container">
      <h1 className="page-title">
        <span className="text-red font-bold">Get</span> in Touch &#x1F933;
      </h1>

      <div className="section-shell">
        <div className="contact-content">
          <div className="social-media-box card-dark-translucent">
            <h2 className="text-white text-center mb-xl text-2xl">Follow me &#x1F447;</h2>
            <div className="flex flex-col gap-lg mb-xl">
              <a
                href="https://www.linkedin.com/in/get-ms-karanyawad"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
              >
                <i className="bi bi-linkedin text-[1.8rem]" /> LinkedIn
              </a>
              <a
                href="https://github.com/Thaiseboy/Hi-"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
              >
                <i className="bi bi-github text-[1.8rem]" /> GitHub
              </a>
            </div>
            <div className="mt-xl">
              <img src={contactPhoto} alt="Photo of Get Karanyawad" className="personal-photo" />
              <p className="text-gold mt-md text-center text-lg font-medium">See you soon!</p>
            </div>
          </div>

          <div className="contact-form-box card-dark-translucent">
            <h2 className="text-white text-center mb-xl text-2xl">
              If you have more questions, feel free to ask &#x1F4E9;
            </h2>
            <form className="contact-form" onSubmit={sendEmail}>
              <div className="mb-lg">
                <label htmlFor="name" className="text-primary font-semibold mb-sm block">
                  Name:
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
                {errors.name && <div className="invalid-feedback">{errors.name}</div>}
              </div>

              <div className="mb-lg">
                <label htmlFor="email" className="text-primary font-semibold mb-sm block">
                  Email:
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
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
              </div>

              <div className="mb-lg">
                <label htmlFor="message" className="text-primary font-semibold mb-sm block">
                  Message:
                </label>
                <textarea
                  id="message"
                  required
                  className={`form-control ${errors.message ? "is-invalid" : ""}`}
                  rows="4"
                  maxLength="1000"
                  {...bindField("message")}
                />
                {errors.message && <div className="invalid-feedback">{errors.message}</div>}
                <small className="block mt-1 text-xs text-gray-500">
                  {form.message.length}/1000 characters
                </small>
              </div>

              <button
                type="submit"
                className="btn btn-submit"
                disabled={!isValid || isSubmitting}
                aria-label="Submit contact form"
              >
                {isSubmitting ? "Sending..." : "Send"}
              </button>

              {submitMessage && <div className="alert alert-success mt-3">{submitMessage}</div>}
              {submitError && <div className="alert alert-danger mt-3">{submitError}</div>}
            </form>

            <ErrorBoundary onRetry={retryFetchCV}>
              <div className="mt-4 text-center">
                {cvLoading && <SkeletonLoader type="box" width="200px" height="50px" />}
                {!cvLoading && cvLink && (
                  <button type="button" className="btn btn-cv" onClick={downloadCV}>
                    Download CV
                  </button>
                )}
                {!cvLoading && !cvLink && <p className="text-white opacity-70 italic">CV not available</p>}
              </div>
            </ErrorBoundary>
          </div>
        </div>
      </div>
    </div>
  );
}

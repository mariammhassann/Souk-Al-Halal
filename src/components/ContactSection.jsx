import { useRef, useState } from "react";
import "../styles/ContactSection.css";

function Field({ field }) {
  const [filled, setFilled] = useState(false);

  const handleChange = (event) => setFilled(event.target.value.length > 0);

  const shared = {
    id: field.id,
    name: field.id,
    required: true,
    placeholder: " ",
    onChange: handleChange,
    "aria-required": "true"
  };

  return (
    <div className={`ct-field${filled ? " ct-field--filled" : ""}`}>
      {field.type === "textarea" ? (
        <textarea {...shared} rows={5} />
      ) : (
        <input {...shared} type={field.type} />
      )}
      <label htmlFor={field.id}>{field.label}</label>
      <span className="ct-field-border" aria-hidden="true" />
    </div>
  );
}

export default function ContactSection({ content, isSubmitted, onSubmit }) {
  const formRef = useRef(null);

  return (
    <section className="ct-section section" id="contact" aria-labelledby="ct-title">
      <div className="ct-bg" aria-hidden="true">
        <div className="ct-blob ct-blob--1" />
        <div className="ct-blob ct-blob--2" />
        <div className="ct-grain" />
      </div>

      <div className="container ct-inner">
        <div className="ct-info">
          <div className="ct-eyebrow">
            <span className="ct-eyebrow-gem" aria-hidden="true" />
            <span>Get in touch</span>
          </div>

          <h2 className="ct-title" id="ct-title">{content.title}</h2>
          <p className="ct-copy">{content.copy}</p>
        </div>

        <div className="ct-form-wrap">
          <form
            ref={formRef}
            className={`ct-form${isSubmitted ? " ct-form--submitted" : ""}`}
            onSubmit={onSubmit}
            noValidate
          >
            <div className="ct-form-inner">
              {content.fields.map((field) => (
                <Field key={field.id} field={field} />
              ))}

              <button className="ct-submit" type="submit">
                <span className="ct-submit-label">{content.submitLabel}</span>
                <span className="ct-submit-icon" aria-hidden="true">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </span>
              </button>
            </div>

            <div
              className={`ct-success${isSubmitted ? " ct-success--visible" : ""}`}
              role="status"
              aria-live="polite"
            >
              <div className="ct-success-inner">
                <div className="ct-success-check" aria-hidden="true">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
                <p className="ct-success-msg">{content.successMessage}</p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

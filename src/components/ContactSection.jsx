import { contactActions } from "../data/contactActions";

function ContactActionIcon({ type }) {
  const icons = {
    email: (
      <path d="M3.5 5.2h13c.6 0 1 .4 1 1v7.6c0 .6-.4 1-1 1h-13c-.6 0-1-.4-1-1V6.2c0-.6.4-1 1-1zm6.5 4.5 5.8-3.5H4.2zm0 1.2L4 7.3v5.9h12V7.3z" />
    ),
    call: (
      <path d="M6.6 3.5c.3-.3.8-.4 1.2-.2l2.1 1c.5.2.7.8.5 1.3l-.7 1.6c.7 1.4 1.8 2.5 3.2 3.2l1.6-.7c.5-.2 1.1 0 1.3.5l1 2.1c.2.4.1.9-.2 1.2l-1.4 1.4c-.5.5-1.2.7-1.9.5C8.7 15.4 4.6 11.3 3.3 6.8c-.2-.7 0-1.4.5-1.9z" />
    ),
    whatsapp: (
      <path d="M10 2.8a7.2 7.2 0 0 0-6.1 11l-.8 3 3.1-.8A7.2 7.2 0 1 0 10 2.8zm0 12.8c-1.1 0-2.1-.3-3-.8l-.2-.1-1.8.5.5-1.8-.1-.2a5.7 5.7 0 1 1 4.6 2.4zm3.1-4.2c-.2-.1-1-.5-1.2-.6-.2-.1-.3-.1-.5.1l-.3.4c-.1.1-.2.2-.4.1-.8-.4-1.5-1-2.1-1.8-.1-.2 0-.3.1-.4l.3-.3c.1-.1.1-.3.2-.4l-.1-.4-.5-1.2c-.1-.2-.3-.3-.5-.3h-.4c-.1 0-.3.1-.4.2-.4.4-.6.9-.6 1.5 0 .4.1.8.4 1.2 1 1.7 2.4 3 4.2 3.9.4.2.8.3 1.2.3.6 0 1.1-.2 1.5-.6.2-.2.3-.6.3-.9 0-.1 0-.2-.2-.3z" />
    ),
    linkedin: (
      <path d="M4.4 6.1a1.2 1.2 0 1 1 0-2.4 1.2 1.2 0 0 1 0 2.4zM3.4 7.2h2v7h-2zm3.4 0h1.9v1c.3-.6 1.1-1.2 2.3-1.2 2.4 0 2.8 1.6 2.8 3.6v3.6h-2v-3.2c0-.8 0-1.8-1.1-1.8s-1.3.9-1.3 1.7v3.3h-2z" />
    ),
    facebook: (
      <path d="M11.2 6.1h1.6V3.4c-.3 0-.9-.1-1.7-.1-1.7 0-2.8 1-2.8 2.9v1.7H6v3h2.3v5h3v-5h2.3l.4-3h-2.7V6.6c0-.4.1-.5.9-.5z" />
    )
  };

  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      {icons[type]}
    </svg>
  );
}

function ContactSection({ content, isSubmitted, language, onSubmit }) {
  const actions = contactActions[language] || contactActions.en;

  return (
    <section className="section section-alt" id="contact">
      <div className="container contact-grid">
        <div className="contact-copy-wrap">
          <h2 className="section-title">{content.title}</h2>
          <p className="contact-copy">{content.copy}</p>
        </div>

        <form className="contact-form" onSubmit={onSubmit}>
          {content.fields.map((field) => (
            <label key={field.id} htmlFor={field.id}>
              {field.label}
              {field.type === "textarea" ? (
                <textarea id={field.id} name={field.id} rows="5" required />
              ) : (
                <input id={field.id} name={field.id} type={field.type} required />
              )}
            </label>
          ))}

          <button className="btn btn-primary" type="submit">
            {content.submitLabel}
          </button>

          <p className="form-success" aria-live="polite">
            {isSubmitted ? content.successMessage : ""}
          </p>
        </form>
      </div>
    </section>
  );
}

export default ContactSection;

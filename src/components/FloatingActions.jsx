import { contactActions } from "../data/contactActions";

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.31.56 3.57.56a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.61 21 3 13.39 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.26.19 2.45.56 3.57a1 1 0 0 1-.24 1.02l-2.2 2.2Z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M19.11 4.93A9.9 9.9 0 0 0 12.06 2C6.58 2 2.12 6.46 2.12 11.94c0 1.75.46 3.47 1.34 4.99L2 22l5.21-1.36a9.87 9.87 0 0 0 4.73 1.21h.01c5.48 0 9.94-4.46 9.94-9.94 0-2.66-1.03-5.16-2.78-6.98Zm-7.16 15.23h-.01a8.2 8.2 0 0 1-4.17-1.14l-.3-.18-3.09.81.83-3.01-.2-.31a8.19 8.19 0 0 1-1.27-4.39c0-4.53 3.69-8.22 8.23-8.22 2.2 0 4.27.85 5.82 2.41a8.17 8.17 0 0 1 2.4 5.82c0 4.53-3.69 8.21-8.22 8.21Zm4.5-6.15c-.25-.12-1.47-.72-1.69-.8-.23-.08-.39-.12-.56.12-.16.25-.64.8-.78.96-.15.17-.29.19-.54.06-.25-.12-1.04-.38-1.99-1.2-.74-.66-1.25-1.47-1.4-1.72-.14-.25-.02-.39.11-.51.11-.11.25-.29.37-.43.12-.15.16-.25.25-.41.08-.16.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.4-.41-.56-.42h-.47c-.17 0-.43.06-.66.31-.22.25-.86.84-.86 2.05 0 1.21.88 2.38 1 2.55.12.16 1.73 2.64 4.18 3.7.58.25 1.04.4 1.39.52.58.18 1.1.15 1.52.09.46-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.15-1.18-.06-.1-.23-.16-.48-.29Z" />
    </svg>
  );
}

function ArrowUpIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 5.5 5.5 12l1.41 1.41L11 9.33V19h2V9.33l4.09 4.08L18.5 12 12 5.5Z" />
    </svg>
  );
}

function FloatingActions({ language }) {
  const actions = contactActions[language] || contactActions.en;
  const callLink = actions.find((action) => action.key === "call");
  const whatsappLink = actions.find((action) => action.key === "whatsapp");

  function handleScrollTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="floating-actions" aria-label={language === "ar" ? "إجراءات سريعة" : "Quick actions"}>
      {callLink ? (
        <a
          className="floating-action floating-action-call"
          href={callLink.href}
          aria-label={callLink.label}
          title={callLink.label}
        >
          <PhoneIcon />
        </a>
      ) : null}

      {whatsappLink ? (
        <a
          className="floating-action floating-action-whatsapp"
          href={whatsappLink.href}
          aria-label={whatsappLink.label}
          title={whatsappLink.label}
          target="_blank"
          rel="noreferrer"
        >
          <WhatsAppIcon />
        </a>
      ) : null}

      <button
        className="floating-action floating-action-top"
        type="button"
        aria-label={language === "ar" ? "العودة للأعلى" : "Back to top"}
        title={language === "ar" ? "العودة للأعلى" : "Back to top"}
        onClick={handleScrollTop}
      >
        <ArrowUpIcon />
      </button>
    </div>
  );
}

export default FloatingActions;

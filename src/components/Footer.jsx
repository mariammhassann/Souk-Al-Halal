import { contactActions } from "../data/contactActions";
import "../styles/Footer.css";

const LOCATION_URL = "https://maps.app.goo.gl/AFNMr5NMym3CqVX79?g_st=awb";

function FooterIcon({ type }) {
  const icons = {
    email: <path d="M3.5 5.2h13c.6 0 1 .4 1 1v7.6c0 .6-.4 1-1 1h-13c-.6 0-1-.4-1-1V6.2c0-.6.4-1 1-1zm6.5 4.5 5.8-3.5H4.2zm0 1.2L4 7.3v5.9h12V7.3z" />,
    phone: <path d="M6.6 3.5c.3-.3.8-.4 1.2-.2l2.1 1c.5.2.7.8.5 1.3l-.7 1.6c.7 1.4 1.8 2.5 3.2 3.2l1.6-.7c.5-.2 1.1 0 1.3.5l1 2.1c.2.4.1.9-.2 1.2l-1.4 1.4c-.5.5-1.2.7-1.9.5C8.7 15.4 4.6 11.3 3.3 6.8c-.2-.7 0-1.4.5-1.9z" />,
    location: <path d="M10 17.2s5-4.7 5-8.8a5 5 0 1 0-10 0c0 4.1 5 8.8 5 8.8zm0-6.2a2.1 2.1 0 1 1 0-4.2 2.1 2.1 0 0 1 0 4.2z" />,
    linkedin: <path d="M4.4 6.1a1.2 1.2 0 1 1 0-2.4 1.2 1.2 0 0 1 0 2.4zM3.4 7.2h2v7h-2zm3.4 0h1.9v1c.3-.6 1.1-1.2 2.3-1.2 2.4 0 2.8 1.6 2.8 3.6v3.6h-2v-3.2c0-.8 0-1.8-1.1-1.8s-1.3.9-1.3 1.7v3.3h-2z" />,
    facebook: <path d="M11.2 6.1h1.6V3.4c-.3 0-.9-.1-1.7-.1-1.7 0-2.8 1-2.8 2.9v1.7H6v3h2.3v5h3v-5h2.3l.4-3h-2.7V6.6c0-.4.1-.5.9-.5z" />
  };

  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" fill="currentColor">
      {icons[type]}
    </svg>
  );
}

export default function Footer({ content, language }) {
  const currentYear = new Date().getFullYear();
  const footerActions = (contactActions[language] || contactActions.en).filter(
    (action) => action.key === "facebook" || action.key === "linkedin"
  );
  const contactItems = content.items.map((item) => {
    const colonIdx = item.indexOf(":");
    const label = colonIdx > -1 ? item.slice(0, colonIdx).trim() : null;
    const value = colonIdx > -1 ? item.slice(colonIdx + 1).trim() : item;
    const normalizedLabel = label ? label.toLowerCase() : "";
    const type = normalizedLabel.includes("mail")
      ? "email"
      : normalizedLabel.includes("phone") || normalizedLabel.includes("هاتف")
        ? "phone"
        : normalizedLabel.includes("location") || normalizedLabel.includes("موقع")
          ? "location"
          : null;

    const href = type === "email"
      ? "mailto:amomattia@yahoo.com"
      : type === "phone"
        ? "tel:+201001444236"
        : type === "location"
          ? LOCATION_URL
          : null;

    return { item, label, value, type, href };
  });

  return (
    <footer className="ft-root" role="contentinfo">
      <div className="ft-bg" aria-hidden="true">
        <div className="ft-blob ft-blob--1" />
        <div className="ft-blob ft-blob--2" />
        <div className="ft-grain" />
      </div>

      <div className="container ft-inner">
        <div className="ft-rule" aria-hidden="true">
          <span className="ft-rule-line" />
          <span className="ft-rule-diamond" />
          <span className="ft-rule-line" />
        </div>

        <div className="ft-grid">
          <div className="ft-contact">
            <h3 className="ft-col-title">Contact</h3>
            <ul className="ft-contact-list" role="list">
              {contactItems.map(({ item, label, value, type, href }) => (
                <li key={item} className="ft-contact-item">
                  {type ? (
                    <span className="ft-contact-icon" aria-hidden="true">
                      <FooterIcon type={type} />
                    </span>
                  ) : null}
                  {href ? (
                    <a
                      className="ft-contact-copy ft-contact-link"
                      href={href}
                      target={type === "location" ? "_blank" : undefined}
                      rel={type === "location" ? "noopener noreferrer" : undefined}
                    >
                      {label && <span className="ft-contact-label">{label}</span>}
                      <span className="ft-contact-value">{value}</span>
                    </a>
                  ) : (
                    <div className="ft-contact-copy">
                      {label && <span className="ft-contact-label">{label}</span>}
                      <span className="ft-contact-value">{value}</span>
                    </div>
                  )}
                </li>
              ))}
            </ul>

            {footerActions.length ? (
              <div className="ft-socials" aria-label="Social links">
                {footerActions.map((action) => (
                  <a
                    key={action.key}
                    href={action.href}
                    className="ft-social-link"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={action.label}
                  >
                    <span className="ft-social-icon" aria-hidden="true">
                      <FooterIcon type={action.key} />
                    </span>
                    <span>{action.label}</span>
                  </a>
                ))}
              </div>
            ) : null}
          </div>

          <div className="ft-top-wrap">
            <a className="ft-top-btn" href="#home" aria-label="Back to top">
              <span className="ft-top-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="18 15 12 9 6 15" />
                </svg>
              </span>
              <span>Top</span>
            </a>
          </div>
        </div>

        <div className="ft-bottom">
          <span className="ft-copy">
            © {currentYear} Souq Al-Halal. All rights reserved.
          </span>
          <span className="ft-made" aria-hidden="true">
            <span className="ft-made-dot" />
            Egypt
          </span>
        </div>
      </div>
    </footer>
  );
}

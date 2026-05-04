import { useEffect, useRef, useState } from "react";
import { imageAssets } from "../data/imageAssets";
import "../styles/FounderPage.css";

/* ── Scroll-reveal hook ───────────────────────────── */
function useReveal(threshold = 0.1) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function Reveal({ children, delay = 0, variant = "up", className = "" }) {
  const [ref, visible] = useReveal();
  return (
    <div
      ref={ref}
      className={`fp-reveal fp-reveal--${variant}${visible ? " fp-reveal--in" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ── Objective item ───────────────────────────────── */
function ObjectiveItem({ text, index }) {
  const [ref, visible] = useReveal(0.15);
  return (
    <li
      ref={ref}
      className={`fp-obj-item${visible ? " fp-obj-item--in" : ""}`}
      style={{ transitionDelay: `${index * 90}ms` }}
    >
      <span className="fp-obj-num" aria-hidden="true">
        {String(index + 1).padStart(2, "0")}
      </span>
      <div className="fp-obj-body">
        <span className="fp-obj-track" aria-hidden="true">
          <span className="fp-obj-fill" />
        </span>
        <p className="fp-obj-text">{text}</p>
      </div>
    </li>
  );
}

/* ── Value item ───────────────────────────────────── */
function ValueItem({ text, index }) {
  const [ref, visible] = useReveal(0.15);
  return (
    <li
      ref={ref}
      className={`fp-val-item${visible ? " fp-val-item--in" : ""}`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <span className="fp-val-mark" aria-hidden="true">"</span>
      <span className="fp-val-text">{text}</span>
    </li>
  );
}

/* ── Main page ────────────────────────────────────── */
export default function FounderPage({ content, onBackHome }) {
  /* Subtle parallax on portrait */
  const portraitRef = useRef(null);
  const onMouseMove = (e) => {
    const el = portraitRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 10;
    el.style.transform = `translate(${x}px, ${y}px) scale(1.04)`;
  };
  const onMouseLeave = () => {
    if (portraitRef.current) portraitRef.current.style.transform = "";
  };

  return (
    <main className="fp-page">

      {/* ── Ambient background ───────────────────────── */}
      <div className="fp-bg" aria-hidden="true">
        <div className="fp-blob fp-blob--1" />
        <div className="fp-blob fp-blob--2" />
        <div className="fp-blob fp-blob--3" />
        <div className="fp-grain" />
      </div>

      {/* ══ HERO ══════════════════════════════════════ */}
      <section className="fp-hero" aria-label="Founder introduction">
        <div className="container fp-hero-inner">

          {/* Back button */}
          <Reveal variant="down" delay={0}>
            <button className="fp-back" type="button" onClick={onBackHome}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              <span>{content.backLabel}</span>
            </button>
          </Reveal>

          <div className="fp-hero-grid">

            {/* Copy */}
            <div className="fp-copy">
              <Reveal variant="up" delay={80}>
                <div className="fp-eyebrow">
                  <span className="fp-eyebrow-gem" aria-hidden="true" />
                  <span className="fp-eyebrow-text">{content.eyebrow}</span>
                </div>
              </Reveal>

              <Reveal variant="up" delay={160}>
                <h1 className="fp-title">{content.title}</h1>
              </Reveal>

              <Reveal variant="up" delay={240}>
                <p className="fp-intro">{content.intro}</p>
              </Reveal>

              <Reveal variant="fade" delay={360}>
                <blockquote className="fp-quote">
                  <span className="fp-quote-ornament" aria-hidden="true">"</span>
                  <p className="fp-quote-body">{content.quote}</p>
                  <footer className="fp-quote-footer">
                    <span className="fp-quote-dash" aria-hidden="true" />
                    <cite className="fp-quote-cite">{content.founder.name}</cite>
                  </footer>
                </blockquote>
              </Reveal>
            </div>

            {/* Profile card */}
            <Reveal variant="right" delay={200} className="fp-card-wrap">
              <div
                className="fp-card"
                onMouseMove={onMouseMove}
                onMouseLeave={onMouseLeave}
              >
                {/* Decorative ring */}
                <span className="fp-card-ring fp-card-ring--1" aria-hidden="true" />
                <span className="fp-card-ring fp-card-ring--2" aria-hidden="true" />

                {/* Portrait */}
                <div className="fp-portrait-wrap" aria-label={content.portrait.alt}>
                  <img
                    ref={portraitRef}
                    className="fp-portrait-img"
                    src={imageAssets.founder.portrait}
                    alt={content.portrait.alt}
                    loading="eager"
                    fetchPriority="high"
                    decoding="async"
                    draggable={false}
                  />
                  <div className="fp-portrait-overlay" aria-hidden="true" />
                  <div className="fp-portrait-grain" aria-hidden="true" />

                  {/* Floating badge */}
                  <div className="fp-portrait-badge" role="img" aria-label="Founder Profile">
                    <span className="fp-badge-star" aria-hidden="true">✦</span>
                    <span>{content.portrait.badge}</span>
                  </div>
                </div>

                {/* Identity block */}
                <div className="fp-card-identity">
                  <h2 className="fp-card-name">{content.founder.name}</h2>
                  <p className="fp-card-role">{content.founder.role}</p>
                  <p className="fp-card-company">{content.founder.company}</p>
                </div>

                {/* Note */}
                <div className="fp-card-note">
                  <p>{content.founder.note}</p>
                </div>

                {/* Decorative bottom strip */}
                <div className="fp-card-strip" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            </Reveal>

          </div>
        </div>
      </section>

      {/* ══ DETAILS ═══════════════════════════════════ */}
      <section className="fp-details section section-alt" aria-label="Objectives and values">
        <div className="container fp-details-inner">

          {/* Objectives — timeline */}
          <article className="fp-panel" aria-labelledby="fp-obj-title">
            <Reveal variant="up" delay={0}>
              <header className="fp-panel-header">
                <span className="fp-panel-tag">01</span>
                <h2 className="fp-panel-title" id="fp-obj-title">
                  {content.objectivesTitle}
                </h2>
                <p className="fp-panel-sub">
                  The key milestones and responsibilities that define our operation.
                </p>
              </header>
            </Reveal>

            <ul className="fp-obj-list" role="list" aria-label={content.objectivesTitle}>
              {content.objectives.map((item, i) => (
                <ObjectiveItem key={i} text={item} index={i} />
              ))}
            </ul>
          </article>

          {/* Divider */}
          <div className="fp-panel-divider" aria-hidden="true">
            <span className="fp-divider-line" />
            <span className="fp-divider-gem" />
            <span className="fp-divider-line" />
          </div>

          {/* Values — editorial quotes */}
          <article className="fp-panel" aria-labelledby="fp-val-title">
            <Reveal variant="up" delay={0}>
              <header className="fp-panel-header">
                <span className="fp-panel-tag">02</span>
                <h2 className="fp-panel-title" id="fp-val-title">
                  {content.valuesTitle}
                </h2>
                <p className="fp-panel-sub">
                  The principles we hold to in every shipment and every relationship.
                </p>
              </header>
            </Reveal>

            <ul className="fp-val-list" role="list" aria-label={content.valuesTitle}>
              {content.values.map((item, i) => (
                <ValueItem key={i} text={item} index={i} />
              ))}
            </ul>
          </article>

        </div>
      </section>

    </main>
  );
}

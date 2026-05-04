import { useEffect, useRef, useState } from "react";
import "../styles/QualitySection.css";

/* ── Scroll reveal hook ───────────────────────────── */
function useReveal(threshold = 0.12) {
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
      className={`qs-reveal qs-reveal--${variant}${visible ? " qs-reveal--in" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ── Quality step card ────────────────────────────── */
function StepCard({ item, index }) {
  const [ref, visible] = useReveal(0.15);

  /* Subtle tilt on mouse move */
  const cardRef = useRef(null);
  const onMouseMove = (e) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    el.style.transform = `perspective(700px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`;
  };
  const onMouseLeave = () => {
    if (cardRef.current) cardRef.current.style.transform = "";
  };

  return (
    <li
      ref={ref}
      className={`qs-step${visible ? " qs-step--in" : ""}`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div
        ref={cardRef}
        className="qs-step-inner"
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
      >
        {/* Corner accent */}
        <span className="qs-corner qs-corner--tl" aria-hidden="true" />
        <span className="qs-corner qs-corner--br" aria-hidden="true" />

        {/* Header row */}
        <div className="qs-step-head">
          <span className="qs-step-num" aria-hidden="true">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="qs-step-divider" aria-hidden="true">
            <span
              className="qs-divider-fill"
              style={{ transitionDelay: `${index * 100 + 300}ms` }}
            />
          </span>
        </div>

        {/* Text */}
        <div className="qs-step-body">
          <h3 className="qs-step-title">{item.title}</h3>
          <p className="qs-step-desc">{item.description}</p>
        </div>

        {/* Hover glow */}
        <div className="qs-step-glow" aria-hidden="true" />
      </div>
    </li>
  );
}

/* ── Main section ─────────────────────────────────── */
export default function QualitySection({ content }) {
  return (
    <section className="qs-section" id="quality" aria-labelledby="qs-title">

      {/* Background */}
      <div className="qs-bg" aria-hidden="true">
        <div className="qs-bg-blob qs-bg-blob--1" />
        <div className="qs-bg-blob qs-bg-blob--2" />
        <div className="qs-bg-grain" />
      </div>

      <div className="container qs-inner">

        {/* Header */}
        <div className="qs-header">
          <Reveal variant="up" delay={0}>
            <div className="qs-eyebrow">
              <span className="qs-eyebrow-line" aria-hidden="true" />
              <span className="qs-eyebrow-text">Our Process</span>
              <span className="qs-eyebrow-line" aria-hidden="true" />
            </div>
          </Reveal>

          <Reveal variant="up" delay={80}>
            <h2 className="qs-title" id="qs-title">{content.title}</h2>
          </Reveal>

          <Reveal variant="up" delay={160}>
            <p className="qs-intro">{content.intro}</p>
          </Reveal>
        </div>

        {/* Steps */}
        <ul
          className="qs-grid"
          role="list"
          aria-label={content.title}
        >
          {content.items.map((item, index) => (
            <StepCard key={item.title} item={item} index={index} />
          ))}
        </ul>

        {/* Bottom rule / signature */}
        <Reveal variant="fade" delay={600}>
          <div className="qs-signature" aria-hidden="true">
            <span className="qs-sig-line" />
            <span className="qs-sig-diamond" />
            <span className="qs-sig-text">Souq Al-Halal · Egyptian Export Standards</span>
            <span className="qs-sig-diamond" />
            <span className="qs-sig-line" />
          </div>
        </Reveal>

      </div>
    </section>
  );
}
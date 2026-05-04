import { useEffect, useRef, useState } from "react";
import { imageAssets } from "../data/imageAssets";
import "../styles/AboutSection.css";

/* ── Scroll-reveal hook ───────────────────────────── */
function useReveal(threshold = 0.12) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setVisible(true); obs.disconnect(); }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return [ref, visible];
}

/* ── Reveal wrapper ───────────────────────────────── */
function Reveal({ children, delay = 0, className = "", variant = "up" }) {
  const [ref, visible] = useReveal();
  return (
    <div
      ref={ref}
      className={`ab-reveal ab-reveal--${variant}${visible ? " ab-reveal--in" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ── Image with parallax on mouse-enter ───────────── */
function ParallaxImage({ src, alt, className, strength = 6 }) {
  const imgRef = useRef(null);

  const onMouseMove = (e) => {
    const el = imgRef.current;
    if (!el) return;
    const rect = el.closest(".ab-img-wrap").getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * strength;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * strength;
    el.style.transform = `translate(${x}px, ${y}px) scale(1.05)`;
  };

  const onMouseLeave = () => {
    if (imgRef.current) imgRef.current.style.transform = "";
  };

  return (
    <img
      ref={imgRef}
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      fetchPriority="low"
      decoding="async"
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      draggable={false}
    />
  );
}

/* ── Main component ───────────────────────────────── */
export default function AboutSection({ content, onMoreAbout }) {
  return (
    <section className="section ab-section" id="about" aria-labelledby="about-title">

      {/* Ambient background */}
      <div className="ab-bg" aria-hidden="true">
        <div className="ab-blob ab-blob--1" />
        <div className="ab-blob ab-blob--2" />
        <div className="ab-grain" />
      </div>

      <div className="container ab-inner">

        {/* ── Copy column ─────────────────────────────── */}
        <div className="ab-copy">

          <Reveal variant="left" delay={0}>
            <div className="ab-eyebrow">
              <span className="ab-eyebrow-dot" aria-hidden="true" />
              <span className="ab-eyebrow-text">{content.title}</span>
              <span className="ab-eyebrow-line" aria-hidden="true" />
            </div>
          </Reveal>

          <Reveal variant="up" delay={80}>
            <h2 className="ab-title" id="about-title">{content.title}</h2>
          </Reveal>

          <div className="ab-paragraphs">
            {content.paragraphs.map((paragraph, i) => (
              <Reveal key={i} variant="up" delay={160 + i * 90}>
                <p className="ab-paragraph">{paragraph}</p>
              </Reveal>
            ))}
          </div>

          <Reveal variant="up" delay={160 + content.paragraphs.length * 90}>
            <div className="ab-actions">
              <button
                className="ab-more-btn"
                type="button"
                onClick={onMoreAbout}
              >
                <span>{content.moreLabel}</span>
                <span className="ab-more-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </span>
              </button>
            </div>
          </Reveal>

          {/* Pull quote */}
          <Reveal variant="fade" delay={500}>
            <blockquote className="ab-quote">
              <span className="ab-quote-mark" aria-hidden="true">"</span>
              <p className="ab-quote-text">
                {content.paragraphs[content.paragraphs.length - 1]}
              </p>
            </blockquote>
          </Reveal>
        </div>

        {/* ── Media column ────────────────────────────── */}
        <Reveal variant="right" delay={200} className="ab-media">

          {/* Decorative bracket */}
          <span className="ab-bracket ab-bracket--tl" aria-hidden="true" />
          <span className="ab-bracket ab-bracket--br" aria-hidden="true" />

          {/* Main image */}
          <figure className="ab-img-wrap ab-img-wrap--main">
            <ParallaxImage
              src={imageAssets.about.main}
              alt={content.images.fieldAlt}
              className="ab-img"
              strength={7}
            />
            <div className="ab-img-grain" aria-hidden="true" />
            <div className="ab-img-overlay" aria-hidden="true" />

            {/* Floating trust badge */}
            <div className="ab-badge" role="img" aria-label="NFSA certified since 2018">
              <span className="ab-badge-icon" aria-hidden="true">✦</span>
              <div className="ab-badge-text">
                <strong>NFSA Certified</strong>
                <span>Since 2018</span>
              </div>
            </div>
          </figure>

          {/* Secondary image */}
          <figure className="ab-img-wrap ab-img-wrap--secondary">
            <ParallaxImage
              src={imageAssets.about.secondary}
              alt={content.images.harvestAlt}
              className="ab-img"
              strength={5}
            />
            <div className="ab-img-grain" aria-hidden="true" />
            <div className="ab-img-overlay" aria-hidden="true" />

            {/* Caption chip */}
            <figcaption className="ab-img-chip">
              <span className="ab-chip-dot" aria-hidden="true" />
              Egyptian Harvest
            </figcaption>
          </figure>

          {/* Watermark number */}
          <span className="ab-watermark" aria-hidden="true">Est.</span>

        </Reveal>
      </div>
    </section>
  );
}

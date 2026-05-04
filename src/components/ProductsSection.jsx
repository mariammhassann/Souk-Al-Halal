import { useEffect, useRef, useState } from "react";
import { imageAssets } from "../data/imageAssets";
import "../styles/ProductsSection.css";

/* ── Scroll reveal hook ───────────────────────────── */
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
      className={`ps-reveal ps-reveal--${variant}${visible ? " ps-reveal--in" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ── Product card ─────────────────────────────────── */
function ProductCard({ item, image, index, ctaLabel, onViewDetails }) {
  const cardRef = useRef(null);
  const imgRef  = useRef(null);
  const [hovered, setHovered] = useState(false);

  /* 3-D tilt + image parallax on mouse move */
  const onMouseMove = (e) => {
    const card = cardRef.current;
    const img  = imgRef.current;
    if (!card || !img) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform = `perspective(1000px) rotateX(${-y * 7}deg) rotateY(${x * 7}deg)`;
    img.style.transform  = `translate(${x * 12}px, ${y * 12}px) scale(1.08)`;
  };

  const onMouseLeave = () => {
    setHovered(false);
    if (cardRef.current) cardRef.current.style.transform = "";
    if (imgRef.current)  imgRef.current.style.transform  = "";
  };

  return (
    <article
      ref={cardRef}
      className={`ps-card${hovered ? " ps-card--hovered" : ""}`}
      onMouseMove={onMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={onMouseLeave}
    >
      {/* Image layer */}
      <div className="ps-card-img-wrap">
        <img
          ref={imgRef}
          className="ps-card-img"
          src={image}
          alt={item.imageAlt}
          loading="lazy"
          fetchPriority="low"
          decoding="async"
          draggable={false}
        />
        <div className="ps-card-grain"   aria-hidden="true" />
        <div className="ps-card-overlay" aria-hidden="true" />
      </div>

      {/* Badge */}
      <div className="ps-card-badge" aria-label={item.imageBadge}>
        <span className="ps-badge-gem" aria-hidden="true" />
        <span>{item.imageBadge}</span>
      </div>

      {/* Index watermark */}
      <span className="ps-card-index" aria-hidden="true">
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* Content panel — slides up on hover */}
      <div className="ps-card-panel">
        <p className="ps-card-tag" aria-hidden="true">Egyptian Export</p>
        <h3 className="ps-card-name">{item.name}</h3>
        <p className="ps-card-desc">{item.description}</p>
        <button
          className="ps-card-cta"
          type="button"
          onClick={onViewDetails}
          aria-label={`${ctaLabel} — ${item.name}`}
        >
          <span>{ctaLabel}</span>
          <span className="ps-cta-arrow" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </span>
        </button>
      </div>
    </article>
  );
}

/* ── Main section ─────────────────────────────────── */
export default function ProductsSection({ content, ctaLabel, onViewDetails }) {
  const productImages = {
    garlic: imageAssets.products.garlic,
    export: imageAssets.products.export,
  };

  return (
    <section className="section section-alt ps-section" id="products">
      {/* Ambient background */}
      <div className="ps-bg" aria-hidden="true">
        <div className="ps-blob ps-blob--1" />
        <div className="ps-blob ps-blob--2" />
        <div className="ps-grain" />
      </div>

      <div className="container ps-inner">
        {/* Header */}
        <div className="ps-header">
          <Reveal variant="left" delay={0}>
            <div className="ps-eyebrow">
              <span className="ps-eyebrow-line" aria-hidden="true" />
              <span className="ps-eyebrow-text">{content.title}</span>
            </div>
          </Reveal>

          <div className="ps-header-body">
            <Reveal variant="up" delay={80}>
              <h2 className="ps-title">{content.title}</h2>
            </Reveal>
            <Reveal variant="up" delay={160}>
              <p className="ps-intro">{content.intro}</p>
            </Reveal>
          </div>
        </div>

        {/* Cards */}
        <div className="ps-grid">
          {content.items.map((item, index) => (
            <Reveal key={item.name} variant="up" delay={index * 120} className="ps-card-reveal">
              <ProductCard
                item={item}
                image={productImages[item.imageKey]}
                index={index}
                ctaLabel={ctaLabel}
                onViewDetails={onViewDetails}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

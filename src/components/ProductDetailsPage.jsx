import { useState, useEffect, useRef, useCallback } from "react";
import { imageAssets } from "../data/imageAssets";
import "../styles/Productdetailspage.css";

/* ── Scroll-reveal hook ─────────────────────────────── */
function useReveal(options = {}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: options.threshold ?? 0.1, rootMargin: options.rootMargin ?? "0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return [ref, visible];
}

/* ── Reveal wrapper ─────────────────────────────────── */
function Reveal({ children, delay = 0, className = "", variant = "up" }) {
  const [ref, visible] = useReveal();

  return (
    <div
      ref={ref}
      className={`pd-reveal pd-reveal--${variant}${visible ? " pd-reveal--in" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ── Animated count-up for stats ────────────────────── */
function useCountUp(target, duration = 1400, start = false) {
  const [value, setValue] = useState(0);
  const frameRef = useRef(null);

  useEffect(() => {
    if (!start) return;
    const num = parseFloat(target);
    if (isNaN(num)) return;

    const startTime = performance.now();
    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setValue(Math.round(eased * num * 10) / 10);
      if (progress < 1) frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [target, duration, start]);

  return value;
}

/* ── Stat item with count-up ────────────────────────── */
function StatItem({ stat, started }) {
  const numMatch = stat.value.match(/^([\d.,]+)(.*)/);
  const rawNum = numMatch ? parseFloat(numMatch[1].replace(",", "")) : null;
  const suffix = numMatch ? numMatch[2] : stat.value;
  const count = useCountUp(rawNum ?? 0, 1600, started && rawNum !== null);

  const display =
    rawNum !== null
      ? `${Number.isInteger(count) ? count.toLocaleString() : count}${suffix}`
      : stat.value;

  return (
    <div className="pd-stat">
      <strong aria-live="polite">{display}</strong>
      <span>{stat.label}</span>
    </div>
  );
}

/* ── Gallery ────────────────────────────────────────── */
function Gallery({ items }) {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState("next");
  const [animating, setAnimating] = useState(false);
  const [hovering, setHovering] = useState(false);
  const count = items.length;
  const stageRef = useRef(null);

  const go = useCallback(
    (index, dir) => {
      if (animating) return;
      setDirection(dir);
      setAnimating(true);
      setTimeout(() => {
        setActive(((index % count) + count) % count);
        setAnimating(false);
      }, 340);
    },
    [animating, count]
  );

  const next = useCallback(() => go(active + 1, "next"), [active, go]);
  const prev = useCallback(() => go(active - 1, "prev"), [active, go]);

  /* Keyboard navigation */
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const onKey = (e) => {
      if (document.activeElement === el || el.contains(document.activeElement)) {
        if (e.key === "ArrowRight") { e.preventDefault(); next(); }
        if (e.key === "ArrowLeft")  { e.preventDefault(); prev(); }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  /* Touch swipe */
  const startX = useRef(null);
  const onTouchStart = (e) => { startX.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    if (startX.current === null) return;
    const delta = e.changedTouches[0].clientX - startX.current;
    if (Math.abs(delta) > 44) delta < 0 ? next() : prev();
    startX.current = null;
  };

  /* Mouse parallax on active image */
  const imgRef = useRef(null);
  const onMouseMove = (e) => {
    if (!imgRef.current || !hovering) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 8;
    imgRef.current.style.transform = `translate(${x}px, ${y}px) scale(1.06)`;
  };
  const onMouseLeave = () => {
    setHovering(false);
    if (imgRef.current) imgRef.current.style.transform = "";
  };

  return (
    <div className="pdg-root" role="region" aria-label="Product image gallery">
      {/* Main stage */}
      <div
        ref={stageRef}
        className={`pdg-stage${animating ? ` pdg-stage--exit-${direction}` : ""}`}
        tabIndex={0}
        aria-roledescription="carousel"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onMouseMove={onMouseMove}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={onMouseLeave}
      >
        <div className="pdg-film-grain" aria-hidden="true" />

        <img
          ref={imgRef}
          key={active}
          src={items[active].image}
          alt={items[active].title}
          className={`pdg-image pdg-image--enter-${direction}`}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          draggable={false}
        />

        <div className="pdg-stage-overlay" aria-hidden="true" />

        {/* Counter badge */}
        <div className="pdg-counter" aria-live="polite" aria-atomic="true">
          <span className="pdg-counter-current">{String(active + 1).padStart(2, "0")}</span>
          <span className="pdg-counter-track">
            <span className="pdg-counter-fill" style={{ width: `${((active + 1) / count) * 100}%` }} />
          </span>
          <span className="pdg-counter-total">{String(count).padStart(2, "0")}</span>
        </div>

        {/* Caption */}
        <div className="pdg-caption" aria-live="polite">
          <span className="pdg-caption-text">{items[active].title}</span>
        </div>

        {/* Nav arrows */}
        <button
          className="pdg-arrow pdg-arrow--prev"
          type="button"
          onClick={prev}
          aria-label="Previous image"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <button
          className="pdg-arrow pdg-arrow--next"
          type="button"
          onClick={next}
          aria-label="Next image"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>

        {/* Dot indicators */}
        <div className="pdg-dots" role="tablist" aria-label="Slide indicators">
          {items.map((_, i) => (
            <button
              key={i}
              role="tab"
              type="button"
              aria-selected={i === active}
              aria-label={`Go to image ${i + 1}`}
              className={`pdg-dot${i === active ? " pdg-dot--active" : ""}`}
              onClick={() => go(i, i > active ? "next" : "prev")}
            />
          ))}
        </div>
      </div>

      {/* Thumbnail strip */}
      <div className="pdg-footer">
        <div className="pdg-thumbs" role="tablist" aria-label="Product image thumbnails">
          {items.map((item, index) => (
            <button
              key={index}
              role="tab"
              aria-selected={index === active}
              type="button"
              className={`pdg-thumb${index === active ? " pdg-thumb--active" : ""}`}
              onClick={() => go(index, index > active ? "next" : "prev")}
              aria-label={`View image ${index + 1}: ${item.title}`}
            >
              <img
                src={item.image}
                alt=""
                loading="lazy"
                fetchPriority="low"
                decoding="async"
                draggable={false}
              />
              <span className="pdg-thumb-shine" aria-hidden="true" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Section Card ───────────────────────────────────── */
function SectionCard({ section, index, image }) {
  const cardRef = useRef(null);

  /* 3-D tilt on hover */
  const onMouseMove = (e) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(900px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg) translateY(-6px)`;
  };

  const onMouseLeave = () => {
    if (cardRef.current) cardRef.current.style.transform = "";
  };

  return (
    <article
      ref={cardRef}
      className="pd-card"
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <div className="pd-card-img-wrap">
        <img
          className="pd-card-img"
          src={image}
          alt={section.title}
          loading="lazy"
          fetchPriority="low"
          decoding="async"
          draggable={false}
        />
        <div className="pd-card-img-overlay" aria-hidden="true" />
        <span className="pd-card-num" aria-hidden="true">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div className="pd-card-shine" aria-hidden="true" />
      </div>

      <div className="pd-card-body">
        <div className="pd-card-eyebrow" aria-hidden="true">
          <span className="pd-card-line" />
          <span>0{index + 1}</span>
        </div>
        <h2 className="pd-card-title">{section.title}</h2>
        <p className="pd-card-desc">{section.description}</p>
        <ul className="pd-point-list" aria-label="Key points">
          {section.points.map((point, pointIndex) => (
            <li key={pointIndex}>
              <span className="pd-point-dot" aria-hidden="true" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

/* ── Main page ──────────────────────────────────────── */
export default function ProductDetailsPage({ content, onBackHome }) {
  const [statsStarted, setStatsStarted] = useState(false);
  const statsRef = useRef(null);

  /* Trigger count-up when stats scroll into view */
  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsStarted(true);
          obs.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const detailImages = [
    ...imageAssets.products.garlicDetails,
    imageAssets.products.garlic,
    imageAssets.products.export,
  ];

  const galleryItems = detailImages.map((image, index) => ({
    image,
    title:
      content.sections[index]?.title ||
      content.sections[0]?.title ||
      content.title,
  }));

  return (
    <main className="pd-page">

      {/* ── Hero ──────────────────────────────────────── */}
      <section className="pd-hero">
        <div className="pd-hero-bg" aria-hidden="true">
          <div className="pd-hero-blob pd-hero-blob--1" />
          <div className="pd-hero-blob pd-hero-blob--2" />
          <div className="pd-hero-blob pd-hero-blob--3" />
          <div className="pd-hero-grain" />
        </div>

        <div className="container pd-hero-inner">
          <Reveal variant="down" delay={0}>
            <button className="pd-back" type="button" onClick={onBackHome}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              <span>{content.backLabel}</span>
            </button>
          </Reveal>

          <div className="pd-hero-grid">
            {/* Copy column */}
            <div className="pd-hero-copy">
              <Reveal variant="up" delay={80}>
                <div className="pd-eyebrow">
                  <span className="pd-eyebrow-line" aria-hidden="true" />
                  <span className="pd-eyebrow-text">Product Details</span>
                </div>
              </Reveal>

              <Reveal variant="up" delay={160}>
                <h1 className="pd-title">{content.title}</h1>
              </Reveal>

              <Reveal variant="up" delay={240}>
                <p className="pd-intro">{content.intro}</p>
              </Reveal>

              <Reveal variant="up" delay={320}>
                <div className="pd-stats" ref={statsRef}>
                  {(content.stats || []).map((stat, index) => (
                    <StatItem key={index} stat={stat} started={statsStarted} />
                  ))}
                </div>
              </Reveal>

            </div>

            {/* Gallery column */}
            <Reveal variant="fade" delay={200} className="pd-gallery-wrap">
              <Gallery items={galleryItems} />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Section cards ─────────────────────────────── */}
      <section className="pd-sections section section-alt" id="pd-sections">
        <div className="container">
          <Reveal variant="up" delay={0} className="pd-sections-header">
            <span className="pd-sections-tag">In depth</span>
            <h2 className="pd-sections-title">What sets us apart</h2>
          </Reveal>

          <div className="pd-sections-grid">
            {content.sections.map((section, index) => (
              <Reveal
                key={section.title}
                delay={index * 100}
                variant={index % 2 === 0 ? "up" : "fade"}
              >
                <SectionCard
                  section={section}
                  index={index}
                  image={detailImages[index % detailImages.length]}
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

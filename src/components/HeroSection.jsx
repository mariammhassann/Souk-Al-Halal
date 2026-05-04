import { useEffect, useRef, useState, useCallback } from "react";
import { imageAssets } from "../data/imageAssets";

/* ─── tiny hook: swipe detection ───────────────────────────────────────── */
function useSwipe(onSwipeLeft, onSwipeRight, threshold = 50) {
  const startX = useRef(null);

  const onTouchStart = useCallback((e) => {
    startX.current = e.touches[0].clientX;
  }, []);

  const onTouchEnd = useCallback(
    (e) => {
      if (startX.current === null) return;
      const delta = e.changedTouches[0].clientX - startX.current;
      if (Math.abs(delta) >= threshold) {
        delta < 0 ? onSwipeLeft() : onSwipeRight();
      }
      startX.current = null;
    },
    [onSwipeLeft, onSwipeRight, threshold]
  );

  return { onTouchStart, onTouchEnd };
}

/* ─── component ─────────────────────────────────────────────────────────── */
export default function HeroSection({ content }) {
  const slides = [
    {
      image: imageAssets.hero.slides[0],
      eyebrow: content.visualBadge,
      title: content.visualTitle,
      text: content.visualText,
    },
    {
      image: imageAssets.hero.slides[1],
      title: content.title,
      text: content.subtitle,
    },
    {
      image: imageAssets.hero.slides[2],
      eyebrow: content.visualKicker,
      title: content.visualTitle,
      text: content.visualText,
    },
  ];

  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);

  const goTo = useCallback(
    (index) => setActiveSlide((index + slides.length) % slides.length),
    [slides.length]
  );
  const next = useCallback(() => goTo(activeSlide + 1), [activeSlide, goTo]);
  const prev = useCallback(() => goTo(activeSlide - 1), [activeSlide, goTo]);

  const swipeHandlers = useSwipe(next, prev);

  /* auto-advance */
  useEffect(() => {
    if (isPaused) return;
    intervalRef.current = window.setInterval(next, 3800);
    return () => window.clearInterval(intervalRef.current);
  }, [isPaused, next]);

  return (
    <section className="hero section hero-section-root">
      <div className="hero-shell">
        <div
          className="hero-visual hero-showcase"
          role="region"
          aria-label={content.visualAlt}
          aria-live="polite"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          {...swipeHandlers}
        >
          {/* ── slides ── */}
          {slides.map((slide, index) => {
            const isActive = index === activeSlide;
            return (
              <div
                key={index}
                className={`hero-slide${isActive ? " is-active" : ""}`}
                aria-hidden={!isActive}
              >
                <img
                  className="hero-visual-image"
                  src={slide.image}
                  alt={content.visualAlt}
                  loading={index === 0 ? "eager" : "lazy"}
                  fetchPriority={index === 0 ? "high" : "low"}
                  decoding="async"
                  draggable={false}
                />
                <div className="hero-visual-overlay" />
              </div>
            );
          })}

          {/* ── main copy (always on the image) ── */}
          <div className="hero-slide-inner">
            <div className="hero-slide-copy hero-slide-copy-main">
              <h1>{content.title}</h1>
              <p className="hero-main-subtitle">{content.subtitle}</p>

              <div className="hero-actions hero-actions-overlay">
                <a href="#contact" className="btn btn-primary">
                  {content.primaryAction}
                </a>
                <a href="#products" className="btn btn-outline">
                  {content.secondaryAction}
                </a>
              </div>
            </div>
          </div>

          {/* ── bottom bar: thumb + dots + prev/next ── */}
          <div className="hero-showcase-inner">
            <div className="hero-showcase-footer">
              <div className="visual-thumb">
                <img
                  src={imageAssets.hero.thumb}
                  alt={content.visualTitle}
                  loading="lazy"
                  fetchPriority="low"
                  decoding="async"
                  draggable={false}
                />
              </div>

              <div className="hero-showcase-meta">
                <span>{content.visualKicker}</span>

                {/* dots */}
                <div className="hero-showcase-dots" role="tablist" aria-label="Hero slides">
                  {slides.map((_, index) => (
                    <button
                      key={index}
                      role="tab"
                      aria-selected={index === activeSlide}
                      className={`hero-showcase-dot${index === activeSlide ? " is-active" : ""}`}
                      type="button"
                      aria-label={`Slide ${index + 1}`}
                      onClick={() => { setIsPaused(true); goTo(index); }}
                    />
                  ))}
                </div>
              </div>

              {/* prev / next — visible on all sizes */}
              <div className="hero-nav-arrows">
                <button
                  type="button"
                  className="hero-arrow"
                  aria-label="Previous slide"
                  onClick={() => { setIsPaused(true); prev(); }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>
                <button
                  type="button"
                  className="hero-arrow"
                  aria-label="Next slide"
                  onClick={() => { setIsPaused(true); next(); }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* ── progress bar ── */}
          <div className="hero-progress" aria-hidden="true">
            <div
              key={`${activeSlide}-${isPaused}`}
              className={`hero-progress-bar${isPaused ? " paused" : ""}`}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

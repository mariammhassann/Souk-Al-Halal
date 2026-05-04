import { useState, useEffect, useRef, useCallback } from "react";
import { imageAssets } from "../data/imageAssets";
import "../styles/Productdetailspage.css";

function useReveal() {
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
      { threshold: 0.12 }
    );

    obs.observe(el);

    return () => obs.disconnect();
  }, []);

  return [ref, visible];
}

function Reveal({ children, delay = 0, className = "" }) {
  const [ref, visible] = useReveal();

  return (
    <div
      ref={ref}
      className={`pd-reveal${visible ? " pd-reveal--in" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function Gallery({ items }) {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState("next");
  const [animating, setAnimating] = useState(false);
  const count = items.length;

  const go = useCallback(
    (index, dir) => {
      if (animating) return;
      setDirection(dir);
      setAnimating(true);
      setTimeout(() => {
        setActive((index + count) % count);
        setAnimating(false);
      }, 320);
    },
    [animating, count]
  );

  const next = () => go(active + 1, "next");
  const prev = () => go(active - 1, "prev");

  const startX = useRef(null);

  const onTouchStart = (e) => {
    startX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e) => {
    if (startX.current === null) return;
    const delta = e.changedTouches[0].clientX - startX.current;
    if (Math.abs(delta) > 44) {
      delta < 0 ? next() : prev();
    }
    startX.current = null;
  };

  return (
    <div className="pdg-root">
      <div
        className={`pdg-stage ${animating ? `pdg-stage--exit-${direction}` : ""}`}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <img
          key={active}
          src={items[active].image}
          alt={items[active].title}
          className={`pdg-image pdg-image--enter-${direction}`}
        />
        <div className="pdg-stage-overlay" />

        <div className="pdg-counter" aria-live="polite">
          <span>{active + 1}</span>
          <span className="pdg-counter-sep" />
          <span>{count}</span>
        </div>

        <button className="pdg-arrow pdg-arrow--prev" type="button" onClick={prev} aria-label="Previous image">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <button className="pdg-arrow pdg-arrow--next" type="button" onClick={next} aria-label="Next image">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      <div className="pdg-footer">
        <p className="pdg-caption">{items[active].title}</p>
        <div className="pdg-thumbs" role="tablist" aria-label="Product images">
          {items.map((item, index) => (
            <button
              key={index}
              role="tab"
              aria-selected={index === active}
              type="button"
              className={`pdg-thumb${index === active ? " pdg-thumb--active" : ""}`}
              onClick={() => go(index, index > active ? "next" : "prev")}
              aria-label={`Image ${index + 1}`}
            >
              <img src={item.image} alt="" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ProductDetailsPage({ content, onBackHome }) {
  const detailImages = [
    ...imageAssets.products.garlicDetails,
    imageAssets.products.garlic,
    imageAssets.products.export
  ];

  const galleryItems = detailImages.map((image, index) => ({
    image,
    title: content.sections[index]?.title || content.sections[0]?.title || content.title
  }));

  return (
    <main className="pd-page">
      <section className="pd-hero">
        <div className="container pd-hero-inner">
          <button className="pd-back" type="button" onClick={onBackHome}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            {content.backLabel}
          </button>

          <div className="pd-hero-grid">
            <div className="pd-hero-copy">
              <h1 className="pd-title">{content.title}</h1>
              <p className="pd-intro">{content.intro}</p>

              <div className="pd-stats">
                {(content.stats || []).map((stat, index) => (
                  <div className="pd-stat" key={index}>
                    <strong>{stat.value}</strong>
                    <span>{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pd-gallery-wrap">
              <Gallery items={galleryItems} />
            </div>
          </div>
        </div>
      </section>

      <section className="pd-sections section section-alt">
        <div className="container">
          <div className="pd-sections-grid">
            {content.sections.map((section, index) => (
              <Reveal key={section.title} delay={index * 80}>
                <article className="pd-card">
                  <div className="pd-card-img-wrap">
                    <img
                      className="pd-card-img"
                      src={detailImages[index % detailImages.length]}
                      alt={section.title}
                      loading="lazy"
                    />
                    <div className="pd-card-img-overlay" />
                    <span className="pd-card-num">0{index + 1}</span>
                  </div>

                  <div className="pd-card-body">
                    <h2 className="pd-card-title">{section.title}</h2>
                    <p className="pd-card-desc">{section.description}</p>
                    <ul className="pd-point-list">
                      {section.points.map((point, pointIndex) => (
                        <li key={pointIndex}>
                          <span className="pd-point-dot" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function ProductDetailsPage({ content, onBackHome }) {
  return (
    <main className="product-details-page">
      <section className="section founder-hero-section">
        <div className="container product-details-hero">
          <div className="founder-copy">
            <button className="founder-back" type="button" onClick={onBackHome}>
              {content.backLabel}
            </button>
            <p className="eyebrow">{content.eyebrow}</p>
            <h1 className="founder-title">{content.title}</h1>
            <p className="founder-intro">{content.intro}</p>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container product-details-grid">
          {content.sections.map((section) => (
            <article className="founder-panel" key={section.title}>
              <h2 className="section-title">{section.title}</h2>
              <p className="product-details-copy">{section.description}</p>
              <ul className="founder-list">
                {section.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <article className="founder-panel product-standards-panel">
            <h2 className="section-title">{content.standardsTitle}</h2>
            <ul className="founder-list founder-list-values">
              {content.standards.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </div>
      </section>
    </main>
  );
}

export default ProductDetailsPage;

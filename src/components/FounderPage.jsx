import { imageAssets } from "../data/imageAssets";

function FounderPage({ content, onBackHome }) {
  return (
    <main className="founder-page">
      <section className="section founder-hero-section">
        <div className="container founder-page-grid">
          <div className="founder-copy">
            <button className="founder-back" type="button" onClick={onBackHome}>
              {content.backLabel}
            </button>
            <p className="eyebrow">{content.eyebrow}</p>
            <h1 className="founder-title">{content.title}</h1>
            <p className="founder-intro">{content.intro}</p>

            <blockquote className="founder-quote">{content.quote}</blockquote>
          </div>

          <aside className="founder-profile-card">
            <div className="founder-portrait" aria-label={content.portrait.alt}>
              <span className="founder-portrait-badge">{content.portrait.badge}</span>
              <img
                className="founder-portrait-image"
                src={imageAssets.founder.portrait}
                alt={content.portrait.alt}
              />
            </div>

            <div className="founder-profile-text">
              <h2>{content.founder.name}</h2>
              <p className="founder-role">{content.founder.role}</p>
              <p className="founder-company">{content.founder.company}</p>
              <p>{content.founder.note}</p>
            </div>
          </aside>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container founder-details-grid">
          <article className="founder-panel">
            <h2 className="section-title">{content.objectivesTitle}</h2>
            <ul className="founder-list">
              {content.objectives.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>

          <article className="founder-panel">
            <h2 className="section-title">{content.valuesTitle}</h2>
            <ul className="founder-list founder-list-values">
              {content.values.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </div>
      </section>
    </main>
  );
}

export default FounderPage;

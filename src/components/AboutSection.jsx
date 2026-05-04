import { imageAssets } from "../data/imageAssets";

function AboutSection({ content, onMoreAbout }) {
  return (
    <section className="section about-section" id="about">
      <div className="container">
        <h2 className="section-title about-title">{content.title}</h2>
        <div className="about-layout">
          <div className="about-box">
            {content.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}

            <button className="btn btn-outline about-more-btn" type="button" onClick={onMoreAbout}>
              {content.moreLabel}
            </button>
          </div>

          <div className="about-media">
            <figure className="about-image about-image-main">
              <img src={imageAssets.about.main} alt={content.images.fieldAlt} />
            </figure>

            <figure className="about-image about-image-secondary">
              <img src={imageAssets.about.secondary} alt={content.images.harvestAlt} />
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;

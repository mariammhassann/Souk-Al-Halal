import { imageAssets } from "../data/imageAssets";

function ProductsSection({ content, ctaLabel, onViewDetails }) {
  const productImages = {
    garlic: imageAssets.products.garlic,
    export: imageAssets.products.export
  };

  return (
    <section className="section section-alt" id="products">
      <div className="container">
        <div className="section-heading">
          <h2 className="section-title">{content.title}</h2>
          <p>{content.intro}</p>
        </div>

        <div className="products-grid">
          {content.items.map((item) => (
            <article className="product-card" key={item.name}>
              <div className="product-image-wrap">
                <img
                  className="product-image"
                  src={productImages[item.imageKey]}
                  alt={item.imageAlt}
                />
                <span className="product-image-badge">{item.imageBadge}</span>
              </div>
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <button className="btn btn-primary" type="button" onClick={onViewDetails}>
                {ctaLabel}
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProductsSection;

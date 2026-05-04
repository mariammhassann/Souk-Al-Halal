function QualitySection({ content }) {
  return (
    <section className="section" id="quality">
      <div className="container">
        <div className="section-heading">
          <h2 className="section-title">{content.title}</h2>
          <p>{content.intro}</p>
        </div>

        <ul className="quality-list">
          {content.items.map((item) => (
            <li key={item.title}>
              <strong>{item.title}</strong>
              <span>{item.description}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default QualitySection;

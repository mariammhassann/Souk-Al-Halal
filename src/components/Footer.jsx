function Footer({ content }) {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <p>{content.tagline}</p>
        <ul className="footer-contact">
          {content.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </footer>
  );
}

export default Footer;

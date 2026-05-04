function Header({
  content,
  isFounderPage,
  isMenuOpen,
  onBackHome,
  onCloseMenu,
  onToggleLanguage,
  onToggleMenu
}) {
  return (
    <header className="site-header" id="home">
      <div className="container nav-wrapper">
        {isFounderPage ? (
          <button className="logo logo-button" type="button" aria-label="Souq Al-Halal home" onClick={onBackHome}>
            <span className="logo-ar">{content.brand.nameAr}</span>
            <span className="logo-en">{content.brand.nameEn}</span>
          </button>
        ) : (
          <a className="logo" href="#home" aria-label="Souq Al-Halal home" onClick={onCloseMenu}>
            <span className="logo-ar">{content.brand.nameAr}</span>
            <span className="logo-en">{content.brand.nameEn}</span>
          </a>
        )}

        <button
          className="menu-toggle"
          type="button"
          aria-label={content.navigation.menuLabel}
          aria-expanded={isMenuOpen}
          aria-controls="primaryNav"
          onClick={onToggleMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav
          className={`primary-nav${isMenuOpen ? " open" : ""}`}
          id="primaryNav"
          aria-label="Primary navigation"
        >
          {isFounderPage ? (
            <button className="btn btn-outline header-home-btn" type="button" onClick={onBackHome}>
              {content.navigation.backHome}
            </button>
          ) : (
            <ul>
              {content.navigation.links.map((link) => (
                <li key={link.href}>
                  <a href={link.href} onClick={onCloseMenu}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          )}

          <button className="lang-btn" type="button" onClick={onToggleLanguage}>
            {content.navigation.languageSwitch}
          </button>
        </nav>
      </div>
    </header>
  );
}

export default Header;

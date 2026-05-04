import { useEffect, useMemo, useState } from "react";
import AboutSection from "./components/AboutSection";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";
import FounderPage from "./components/FounderPage";
import FloatingActions from "./components/FloatingActions";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import ProductDetailsPage from "./components/ProductDetailsPage";
import ProductsSection from "./components/ProductsSection";
import QualitySection from "./components/QualitySection";
import { siteContent } from "./data/siteContent";

const LANG_STORAGE_KEY = "souq-lang";
const FOUNDER_PATH = "/founder";
const PRODUCT_DETAILS_PATH = "/product-details";
const BASE_PATH = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");

function getAppPathname(pathname) {
  if (!BASE_PATH) {
    return pathname || "/";
  }

  if (pathname === BASE_PATH) {
    return "/";
  }

  if (pathname.startsWith(`${BASE_PATH}/`)) {
    return pathname.slice(BASE_PATH.length) || "/";
  }

  return pathname || "/";
}

function buildBrowserPath(path) {
  return `${BASE_PATH}${path === "/" ? "" : path}` || "/";
}

function App() {
  const [language, setLanguage] = useState(() => localStorage.getItem(LANG_STORAGE_KEY) || "ar");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [pathname, setPathname] = useState(() => getAppPathname(window.location.pathname));

  const content = useMemo(() => siteContent[language], [language]);
  const isFounderPage = pathname === FOUNDER_PATH;
  const isProductDetailsPage = pathname === PRODUCT_DETAILS_PATH;
  const isSubPage = isFounderPage || isProductDetailsPage;

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.title = content.meta.title;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", content.meta.description);

    localStorage.setItem(LANG_STORAGE_KEY, language);
  }, [content.meta.description, content.meta.title, language]);

  useEffect(() => {
    function handlePopState() {
      setPathname(getAppPathname(window.location.pathname));
      setIsMenuOpen(false);
    }

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  function navigateTo(path) {
    const nextPath = buildBrowserPath(path);

    if (window.location.pathname !== nextPath) {
      window.history.pushState({}, "", nextPath);
      setPathname(path);
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
    setIsMenuOpen(false);
  }

  function handleToggleLanguage() {
    setLanguage((currentLanguage) => (currentLanguage === "ar" ? "en" : "ar"));
    setIsMenuOpen(false);
    setIsSubmitted(false);
  }

  function handleToggleMenu() {
    setIsMenuOpen((currentValue) => !currentValue);
  }

  function handleCloseMenu() {
    setIsMenuOpen(false);
  }

  function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitted(true);
    event.currentTarget.reset();
  }

  function handleOpenFounderPage() {
    navigateTo(FOUNDER_PATH);
  }

  function handleBackHome() {
    navigateTo("/");
  }

  function handleOpenProductDetailsPage() {
    navigateTo(PRODUCT_DETAILS_PATH);
  }

  return (
    <>
      <Header
        content={content}
        isFounderPage={isSubPage}
        isMenuOpen={isMenuOpen}
        onBackHome={handleBackHome}
        onCloseMenu={handleCloseMenu}
        onToggleLanguage={handleToggleLanguage}
        onToggleMenu={handleToggleMenu}
      />

      {isFounderPage ? (
        <FounderPage content={content.founderPage} onBackHome={handleBackHome} />
      ) : isProductDetailsPage ? (
        <ProductDetailsPage content={content.productDetailsPage} onBackHome={handleBackHome} />
      ) : (
        <main>
          <HeroSection content={content.hero} />
          <AboutSection content={content.about} onMoreAbout={handleOpenFounderPage} />
          <ProductsSection
            content={content.products}
            ctaLabel={content.common.viewDetails}
            onViewDetails={handleOpenProductDetailsPage}
          />
          <QualitySection content={content.quality} />
          <ContactSection
            content={content.contact}
            isSubmitted={isSubmitted}
            language={language}
            onSubmit={handleSubmit}
          />
        </main>
      )}

      <Footer content={content.footer} />
      <FloatingActions language={language} />
    </>
  );
}

export default App;

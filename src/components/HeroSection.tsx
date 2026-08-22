import { useLanguage } from "@/contexts/LanguageContext";

const HeroSection = () => {
  const { t, lang } = useLanguage();

  return (
    <section className="cargo-hero cargo-hero-adaptive relative">
      <div className="cargo-hero-bg" aria-hidden="true">
        <img
          src="https://cdn.myportfolio.com/28e70582c8bd2069899fb42e60980ce2/af3f4d90-9ec9-4349-93f9-b47c33833106_rwc_0x98x1200x938x1200.gif?h=4a7cdfb5fee81de134dd238b6c03c921"
          alt=""
          className="cargo-hero-bg-img"
        />
        <div className="cargo-hero-overlay" />
      </div>
      <div className="cargo-hero-inner">
        <h1 className={`shop-title cargo-hero-title ${lang === "en" ? "gloria-title" : ""}`}>
          <span className="hero-title-brand">{t.shopTitle.line1}</span>
          <br />
          <span className="hero-title-brand">{t.shopTitle.line2}</span>
          <br />
          <span className="text-primary">{t.shopTitle.line3}</span>
        </h1>

        <p className="font-helvetica cargo-hero-description">
          {t.hero.description}
        </p>
        
        <p className="font-helvetica cargo-hero-byline">
          {/* {t.hero.createdExclusivelyBy}{" "} */}
          {/* <a href="https://www.chunwang.art" target="_blank" rel="noreferrer">
            <span className="text-primary">chun wang</span>
          </a>
          {t.hero.forImaginativeCollectors} */}
        </p>

        <nav className="cargo-hero-links" aria-label="hero links">
          <a href="/about" className="cargo-link">{t.index.ctaAbout}</a>
        </nav>

        <div className="hero-message-card">
          <h2 className="hero-dialog-title">{t.hero.dialogTitle}</h2>
          <p className="hero-dialog-sub font-helvetica">
            {t.hero.createdExclusivelyBy}{" "}
            <a href="https://www.chunwang.art" target="_blank" rel="noreferrer">
              <span className="text-primary">chun wang</span>
            </a>
            {t.hero.forImaginativeCollectors}
          </p>
          <a className="hero-dialog-btn" href="#products">{t.hero.shopCta}</a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

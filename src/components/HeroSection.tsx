import { ReactNode } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface HeroSectionProps {
  titleOverride?: ReactNode;
  bordered?: boolean;
  logoSrc?: string;
  aboutLinkBlack?: boolean;
  titleBlack?: boolean;
  yellowBackground?: boolean;
  hideBgImage?: boolean;
  bgImageSrc?: string;
  hideTitle?: boolean;
  hideAboutLink?: boolean;
}

const DEFAULT_BG_IMAGE =
  "https://cdn.myportfolio.com/28e70582c8bd2069899fb42e60980ce2/af3f4d90-9ec9-4349-93f9-b47c33833106_rwc_0x98x1200x938x1200.gif?h=4a7cdfb5fee81de134dd238b6c03c921";

const HeroSection = ({
  titleOverride,
  bordered = false,
  logoSrc,
  aboutLinkBlack = false,
  titleBlack = false,
  yellowBackground = false,
  hideBgImage = false,
  bgImageSrc = DEFAULT_BG_IMAGE,
  hideTitle = false,
  hideAboutLink = false,
}: HeroSectionProps = {}) => {
  const { t, lang } = useLanguage();

  return (
    <>
    <section className={`cargo-hero ${logoSrc ? "cargo-hero-theme-aware" : "cargo-hero-adaptive"} relative ${bordered ? "cargo-hero-framed" : ""} ${yellowBackground ? "!bg-yellow-400" : ""}`}>
      {!hideBgImage && (
        <div className="cargo-hero-bg" aria-hidden="true">
          <img
            src={bgImageSrc}
            alt=""
            className="cargo-hero-bg-img"
          />
          <div className="cargo-hero-overlay" />
        </div>
      )}
      <div className="cargo-hero-inner">
        {!hideTitle && (
          <h1 className={`shop-title cargo-hero-title ${lang === "en" ? "gloria-title" : ""} ${titleBlack ? "!text-black" : ""}`}>
            {titleOverride ? (
              <span className="hero-title-brand block">{titleOverride}</span>
            ) : (
              <>
                <span className="hero-title-brand block">{t.shopTitle.line1}</span>
                <span className="hero-title-brand hero-title-sub block">{t.shopTitle.line2}</span>
                <span className={`block hero-title-shop ${titleBlack ? "" : "text-primary"}`}>{t.shopTitle.line3}</span>
              </>
            )}
          </h1>
        )}

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

        {!hideAboutLink && (
          <nav className="cargo-hero-links" aria-label="hero links">
            <a href="/about" className={`cargo-link ${aboutLinkBlack ? "!text-black !border-black" : ""}`}>{t.index.ctaAbout}</a>
          </nav>
        )}

      </div>

      {logoSrc && (
        <div className="hero-message-card-bottom-wrap">
          <div className="hero-message-card hero-message-card-tight">
            <div className="hero-dialog-textbox">
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
        </div>
      )}
    </section>
    </>
  );
};

export default HeroSection;

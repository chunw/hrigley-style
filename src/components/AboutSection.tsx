import deliveryGif from "@/assets/delivery.gif";
import chunPortrait from "@/assets/chun.jpg";
import { useLanguage } from "@/contexts/LanguageContext";

const AboutSection = () => {
  const { t, lang } = useLanguage();

  return (
    <section className="cargo-hero relative">
      <div className="cargo-hero-bg" aria-hidden="true">
        <img
          src={deliveryGif}
          alt=""
          className="cargo-hero-bg-img"
        />
        <div className="cargo-hero-overlay" />
      </div>
      <div className="cargo-hero-inner">
        {lang !== "zh" && (
          <>
            <h1 className="shop-title about-hero-title gloria-title !text-white">{t.about.title}</h1>

            <p className="font-helvetica cargo-hero-subtitle">
              {t.about.subtitle}
            </p>
          </>
        )}

        <div className="about-portrait">
          <img
            src={chunPortrait}
            alt="Chun Wang"
            className="about-portrait-img"
          />
        </div>

        <div className="handwritten-note">
          <p
            className="handwritten-note-text whitespace-pre-line"
            dangerouslySetInnerHTML={{ __html: t.about.body }}
          />

          <nav className="handwritten-note-links" aria-label="about links">
            <a href="/#products" className="handwritten-note-link">{t.about.backToShop}</a>
          </nav>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;

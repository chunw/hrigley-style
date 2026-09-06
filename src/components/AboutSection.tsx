import deliveryGif from "@/assets/delivery.gif";
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

        <div className="about-content lg:flex lg:items-center lg:justify-center lg:gap-16">
          <div className="about-portrait lg:mx-0 lg:mb-0 lg:shrink-0">
            <img
              src={chunAbout}
              alt="Chun Wang holding handmade clay charms"
              className="about-portrait-img"
            />
          </div>

          <div className="handwritten-note lg:mx-0">
            <p
              className="handwritten-note-text whitespace-pre-line"
              dangerouslySetInnerHTML={{ __html: t.about.body }}
            />

            <nav className="handwritten-note-links" aria-label="about links">
              <a href="/#products" className="handwritten-note-link">{t.about.backToShop}</a>
            </nav>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;

import { useEffect } from "react";
import deliveryGif from "@/assets/delivery.gif";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const About = () => {
  const { t } = useLanguage();
  const { forceDark } = useTheme();

  useEffect(() => {
    forceDark(true);
    return () => forceDark(false);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />

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
          <h1 className="shop-title cargo-hero-title gloria-title !text-white">{t.about.title}</h1>

          <p className="font-helvetica cargo-hero-subtitle">
            {t.about.subtitle}
          </p>

          <div className="about-portrait">
            <img
              src="https://cdn.myportfolio.com/28e70582c8bd2069899fb42e60980ce2/bcfb5ed3-e3df-489e-ba87-518d4adccdd0_rw_1200.png?h=3e84d177c91ced5bbf3cede876150ae5"
              alt="Chun Wang"
              className="about-portrait-img"
            />
          </div>

          <div className="handwritten-note">
            <p className="handwritten-note-text whitespace-pre-line">
              {t.about.body}
            </p>

            <nav className="handwritten-note-links" aria-label="about links">
              <a href="/#products" className="handwritten-note-link">{t.about.backToShop}</a>
            </nav>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;

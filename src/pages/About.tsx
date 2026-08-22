import { Link } from "react-router-dom";
import deliveryGif from "@/assets/delivery.gif";
import { useLanguage } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const About = () => {
  const { t } = useLanguage();
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

          <div className="handwritten-note">
            <p className="handwritten-note-text whitespace-pre-line">
              {t.about.body}
            </p>
          </div>

          <nav className="cargo-hero-links" aria-label="about links">
            <Link to="/" className="cargo-link">{t.about.backToShop}</Link>
          </nav>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;

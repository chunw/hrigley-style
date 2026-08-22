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
          <h1 className="shop-title cargo-hero-title">{t.about.title}</h1>

          <p className="font-helvetica cargo-hero-description">
            {t.hero.description}
          </p>
          <p className="font-helvetica cargo-hero-byline">
            {t.hero.createdExclusivelyBy}{" "}
            <a href="https://www.chunwang.art" target="_blank" rel="noreferrer">
              <span className="text-primary">chun wang</span>
            </a>
            {t.hero.forImaginativeCollectors}
          </p>

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

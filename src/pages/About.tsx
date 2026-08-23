import { useEffect, useState } from "react";
import deliveryGif from "@/assets/delivery.gif";
import aboutPhoto1 from "@/assets/about/about-1.jpg";
import aboutPhoto3 from "@/assets/about/about-3.jpg";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { usePageMeta } from "@/hooks/usePageMeta";

const aboutPhotos = [
  { src: aboutPhoto1, caption: "Vending at Popup Gallery, Hotel Alameda High Line, NYC, July 2026" },
  { src: aboutPhoto3, caption: "Studio Collection, July 2026" },
];

const About = () => {
  const { t, lang } = useLanguage();
  const { forceDark } = useTheme();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  usePageMeta({
    title: t.about.title,
    description: t.about.body,
    path: "/about",
  });

  useEffect(() => {
    forceDark(true);
    return () => forceDark(false);
  }, []);

  useEffect(() => {
    if (expandedIndex === null) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setExpandedIndex(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [expandedIndex]);

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
          {lang !== "zh" && (
            <>
              <h1 className="shop-title cargo-hero-title gloria-title !text-white">{t.about.title}</h1>

              <p className="font-helvetica cargo-hero-subtitle">
                {t.about.subtitle}
              </p>
            </>
          )}

          <div className="about-portrait">
            <img
              src="https://cdn.myportfolio.com/28e70582c8bd2069899fb42e60980ce2/bcfb5ed3-e3df-489e-ba87-518d4adccdd0_rw_1200.png?h=3e84d177c91ced5bbf3cede876150ae5"
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

          <div className="about-gallery">
            {aboutPhotos.map((photo, index) => (
              <button
                type="button"
                className="about-gallery-item"
                key={photo.src}
                onClick={() => setExpandedIndex(index)}
                aria-label={`Expand photo: ${photo.caption}`}
              >
                <img
                  src={photo.src}
                  alt={photo.caption}
                  className="about-gallery-img"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        </div>
      </section>

      {expandedIndex !== null && (
        <div
          className="about-lightbox"
          role="dialog"
          aria-modal="true"
          onClick={() => setExpandedIndex(null)}
        >
          <button
            type="button"
            className="about-lightbox-close"
            onClick={() => setExpandedIndex(null)}
            aria-label="Close"
          >
            &times;
          </button>
          <figure className="about-lightbox-figure" onClick={(e) => e.stopPropagation()}>
            <img
              src={aboutPhotos[expandedIndex].src}
              alt={aboutPhotos[expandedIndex].caption}
              className="about-lightbox-img"
            />
            <figcaption className="about-lightbox-caption">
              {aboutPhotos[expandedIndex].caption}
            </figcaption>
          </figure>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default About;

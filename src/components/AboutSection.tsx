import deliveryGif from "@/assets/delivery.gif";
import { useLanguage } from "@/contexts/LanguageContext";
import MarketsSection from "@/components/MarketsSection";

const AboutSection = () => {
  const { t, lang } = useLanguage();

  return (
    <section className="cargo-hero about-hero relative">
      <div className="cargo-hero-inner">
        <img
          src={deliveryGif}
          alt=""
          className="block w-full max-w-[720px] h-auto mb-10"
        />
        {lang !== "zh" && (
          <>
            <h1 className="shop-title about-hero-title gloria-title !text-white">{t.about.title}</h1>
          </>
        )}

        <div className="about-columns">
          <MarketsSection />

          <aside className="about-bio-column">
            <h2 className="about-bio-heading">{t.about.artistLabel}</h2>
            <p
              className="about-bio-text whitespace-pre-line"
              dangerouslySetInnerHTML={{ __html: t.about.bio }}
            />
          </aside>

          <div className="handwritten-note">
            <p
              className="handwritten-note-text whitespace-pre-line"
              dangerouslySetInnerHTML={{ __html: t.about.body }}
            />

            <nav className="handwritten-note-links" aria-label="about links">
              <a
                href="/#products"
                className="sans-label gloria-button-label fun-sticker-btn inline-flex items-center justify-center bg-primary text-primary-foreground px-6 py-2.5 text-base font-bold hover:bg-primary/90 transition-colors text-center cursor-pointer"
              >
                {t.paymentSuccess.continueShopping}
              </a>
            </nav>
          </div>

        </div>

        <div className="about-studio-gallery grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-16">
          <img
            src="/about/studio-1.jpg"
            alt=""
            className="block w-full h-auto"
          />
        </div>
      </div>
    </section>
  );
};

export default AboutSection;

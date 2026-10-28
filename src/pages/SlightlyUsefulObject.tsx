import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SITE_URL } from "@/lib/constants";
import { useLanguage } from "@/contexts/LanguageContext";
import chunPortrait from "@/assets/chun.jpg";

const HERO_TITLE = {
  line1: "Slightly",
  line2: "Useful",
  line3: "Object",
};

const SlightlyUsefulObject = () => {
  const { t } = useLanguage();

  return (
    <div className="relative min-h-screen bg-background">
      <Header />

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
          <img
            src="/slightly-useful-object-logo.svg"
            alt="Slightly Useful Object logo"
            className="mx-auto w-full max-w-5xl h-auto object-contain drop-shadow-[0_12px_30px_rgba(0,0,0,0.12)]"
          />

          <nav className="cargo-hero-links" aria-label="hero links">
            <a href="/about" className="cargo-link">{t.index.ctaAbout}</a>
          </nav>

          <div className="hero-message-card">
            <h2 className="hero-dialog-title">{t.hero.dialogTitle}</h2>
            <p className="hero-dialog-sub font-helvetica">
              {t.hero.smallStudioPrefix}
              <a href="https://www.chunwang.art/about.html" target="_blank" rel="noreferrer">
                <span className="text-primary">{t.hero.smallStudioLinkText}</span>
              </a>
              {t.hero.smallStudioSuffix}
            </p>
            <a className="hero-dialog-btn" href="#products">{t.hero.shopCta}</a>
          </div>
        </div>
      </section>

      <section className=" relative bg-background py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left - Text Content */}
            <div className="space-y-8">
              <div className="space-y-1 lg:space-y-4">
                <h1 className="shop-title gloria-title text-4xl md:text-6xl lg:text-7xl leading-none">
                  {HERO_TITLE.line1} <br />{HERO_TITLE.line2}<br />
                  <span className="text-primary">{HERO_TITLE.line3}</span>
                </h1>
                <p className="hidden lg:block text-muted-foreground max-w-md font-helvetica">
                  {t.index.tagline}
                </p>

                <div className="lg:hidden flex items-start gap-4">
                  <div className="text-muted-foreground max-w-md font-helvetica flex-1">
                    <p className="font-helvetica">{t.index.tagline}</p>
                  </div>
                  <a
                    href={SITE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-lg overflow-hidden shrink-0 w-40 h-40"
                  >
                    <img
                      src={chunPortrait}
                      alt="chun wang shop cover image"
                      className="w-full h-full object-cover"
                    />
                  </a>
                </div>
              </div>
            </div>

            {/* Right - Image */}
            <div className="hidden lg:block relative">
              <a
                href={SITE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center aspect-square lg:aspect-[4/3] rounded-lg overflow-hidden scale-80"
              >
                <img
                  src={chunPortrait}
                  alt="chun wang shop cover image"
                  className="w-3/4 h-3/4 object-cover"
                />
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SlightlyUsefulObject;

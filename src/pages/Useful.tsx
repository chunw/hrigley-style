import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ProductGrid from "@/components/ProductGrid";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";
import { SITE_URL } from "@/lib/constants";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePageMeta } from "@/hooks/usePageMeta";
import usefulBg from "@/assets/hands_clay_objects_clean_skin.jpg";

const Useful = () => {
  const { lang, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [matchedCount, setMatchedCount] = useState(0);
  const location = useLocation();

  usePageMeta({
    title: "Handmade & One of a Kind",
    description: "All the good stuff created and sold by Chun Wang — original paintings, photography prints, ceramics, and handmade objects.",
    path: "/slightlyusefulobject",
  });

  // The initial page load's native scroll-to-hash happens before the SPA finishes
  // rendering #products, so deep links like /slightlyusefulobject#products need a manual scroll on mount.
  useEffect(() => {
    if (location.hash !== "#products") return;
    document.getElementById("products")?.scrollIntoView();
  }, [location.hash]);

  return (
    <div className="relative min-h-screen bg-background">

      <Header />
      <HeroSection
        titleOverride={
          <>
            <span className="block">Slightly</span>
            <span className="hero-title-sub block">Useful Object</span>
          </>
        }
        bordered
        logoSrc="/1%20logo.png"
        titleBlack
        bgImageSrc={usefulBg}
        hideTitle
        hideAboutLink
      />
      <section id="products">
        <ProductGrid
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onMatchCountChange={setMatchedCount}
          matchedCount={matchedCount}
          hideOrderButton
          hideShippingLabel
          lockedCategory="Slightly Useful Object"
        />
      </section>


      {/* <section className="border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Link
            to="/watercolor-catalog"
            className="group flex items-center justify-between hover:text-primary transition-colors"
          >
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-2">
                Original Works
              </p>
              <h2 className="shop-title text-4xl md:text-5xl leading-none">Visions in Watercolor</h2>
            </div>
            <span className="handwritten text-sm text-muted-foreground group-hover:text-primary transition-colors">
              view all →
            </span>
          </Link>
        </div>
      </section> */}

      <section className=" relative bg-background py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left - Text Content */}
            <div className="space-y-8">
              <div className="space-y-1 lg:space-y-4">
                <h1 className="shop-title gloria-title text-4xl md:text-6xl lg:text-7xl leading-none">
                  {t.shopTitle.line1} <br />{t.shopTitle.line2}<br />
                  <span className="text-primary">{t.shopTitle.line3}</span>
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
                      src="https://cdn.myportfolio.com/28e70582c8bd2069899fb42e60980ce2/bcfb5ed3-e3df-489e-ba87-518d4adccdd0_rw_1200.png?h=3e84d177c91ced5bbf3cede876150ae5"
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
                  src="https://cdn.myportfolio.com/28e70582c8bd2069899fb42e60980ce2/bcfb5ed3-e3df-489e-ba87-518d4adccdd0_rw_1200.png?h=3e84d177c91ced5bbf3cede876150ae5"
                  alt="chun wang shop cover image"
                  className="w-3/4 h-3/4 object-cover"
                />
              </a>
              {/* Decorative border */}
              <div className="absolute inset-0 border-4 border-primary translate-x-4 translate-y-4 rounded-lg -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      <AboutSection />

      <Footer />
    </div>
  );
};

export default Useful;

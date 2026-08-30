import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Store } from "lucide-react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ProductGrid from "@/components/ProductGrid";
import Footer from "@/components/Footer";
import { usePageMeta } from "@/hooks/usePageMeta";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { buildVendorCatalogHTML } from "@/lib/printCatalog";
import usefulBg from "@/assets/hands_clay_objects_clean_skin.jpg";

const Useful = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [matchedCount, setMatchedCount] = useState(0);
  const [printMenuOpen, setPrintMenuOpen] = useState(false);
  const location = useLocation();
  const { t, lang } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  // This page always lands in dark mode, regardless of the site-wide theme preference
  // (still overridable via the header's toggle while on the page).
  useEffect(() => {
    if (theme === "light") {
      toggleTheme();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePrint = (printTheme: "light" | "dark") => {
    const html = buildVendorCatalogHTML(window.location.origin, lang, printTheme);
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
    setPrintMenuOpen(false);
  };

  usePageMeta({
    title: "Handmade & One of a Kind",
    description: "All the good stuff created and sold by Chun Wang — original paintings, photography prints, ceramics, and handmade objects.",
    path: "/slightlyusefulobject",
  });

  // The initial page load's native scroll-to-hash happens before the SPA finishes
  // rendering #products, so deep links like /slightlyusefulobject#products need a manual scroll on mount.
  // Otherwise (e.g. client-side nav from the homepage collection link), land at the hero
  // rather than keeping whatever scroll position the previous page was at.
  useEffect(() => {
    if (location.hash === "#products") {
      document.getElementById("products")?.scrollIntoView();
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.hash]);

  return (
    <div className="useful-page relative min-h-screen bg-background">

      <Header />

      <div className="border-t border-border bg-background">
        <div className="px-4 sm:px-6 lg:px-16 py-4 flex items-center justify-between">
          <Link
            to="/"
            className="sans-label font-normal inline-flex items-center gap-2 transition-colors text-xs uppercase tracking-widest px-3 py-2 text-foreground hover:text-primary"
          >
            ← {t.about.backToShop}
          </Link>
          <div className="relative">
            {printMenuOpen && (
              <div className="fixed inset-0 z-10" onClick={() => setPrintMenuOpen(false)} />
            )}
            <button
              type="button"
              onClick={() => setPrintMenuOpen((open) => !open)}
              className="sans-label font-normal inline-flex items-center gap-2 transition-colors text-xs uppercase tracking-widest px-3 py-2 text-foreground hover:text-primary"
            >
              <Store className="h-4 w-4" />
              {t.watercolorCatalog.printVendorCatalog}
            </button>
            {printMenuOpen && (
              <div className="absolute right-0 top-full mt-1 z-20 border border-border bg-background min-w-[160px]">
                {(["light", "dark"] as const).map((theme) => (
                  <button
                    key={theme}
                    type="button"
                    onClick={() => handlePrint(theme)}
                    className="w-full flex items-center gap-2 px-3 py-2 font-mono text-xs hover:bg-muted transition-colors text-foreground border-b border-border last:border-b-0"
                  >
                    <span className={`inline-block w-3 h-3 border border-current ${theme === "dark" ? "bg-foreground" : ""}`} />
                    {theme === "light" ? "Light" : "Dark"}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

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
        forceDarkHero
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

      <Footer />
    </div>
  );
};

export default Useful;

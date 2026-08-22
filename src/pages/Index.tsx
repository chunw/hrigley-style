import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ProductGrid from "@/components/ProductGrid";
import Footer from "@/components/Footer";
import { SITE_URL } from "@/lib/constants";
import { useLanguage } from "@/contexts/LanguageContext";

const Index = () => {
  const { lang, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [matchedCount, setMatchedCount] = useState(0);

  return (
    <div className="relative min-h-screen bg-background">
      
      <Header />
      <HeroSection />
      <ProductGrid
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onMatchCountChange={setMatchedCount}
        matchedCount={matchedCount}
        hideOrderButton
        hideShippingLabel
      />


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
                <h1 className=" shop-title text-4xl md:text-6xl lg:text-7xl leading-none">
                  {t.shopTitle.line1} <br />{t.shopTitle.line2}<br />
                  <span className="text-primary">{t.shopTitle.line3}</span>
                </h1>
                <p className="hidden lg:block text-muted-foreground max-w-md font-helvetica">

                  {t.index.tagline}
                </p>

                <div className="lg:hidden flex items-start gap-4">
                  <div className="text-muted-foreground max-w-md font-helvetica flex-1">
                    <p>{t.index.tagline}</p>
                  
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
     
      <section className="border-t border-border">
        <div className="group flex items-center justify-between gap-6 px-6 md:px-12 py-10">
          <div>
            <h2 className="shop-title text-3xl md:text-5xl leading-none">
              {lang === "zh" ? "浏览作品系列 →" : "View Art Catalogs →"}
            </h2>
          </div>
          <div className="flex gap-3 shrink-0">
            {["/watercolors/01/main.jpg", "/photography/02/main.jpg", "/remains/01/main.jpg", "/21spirit/01/main.jpg"].map((src) => (
              <div key={src} className="w-16 h-16 md:w-24 md:h-24 overflow-hidden border border-border bg-black shrink-0">
                <img
                  src={src}
                  alt=""
                  className="w-full h-full object-cover opacity-70 transition-all duration-500"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
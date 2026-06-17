import { useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ProductGrid from "@/components/ProductGrid";
import Footer from "@/components/Footer";
import { SITE_URL } from "@/lib/constants";
import About from "./About";
import { useLanguage } from "@/contexts/LanguageContext";
import { buildCombinedPrintHTML, type PrintTheme } from "@/lib/printCatalog";

const Index = () => {
  const { lang, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [matchedCount, setMatchedCount] = useState(0);
  const [printMenuOpen, setPrintMenuOpen] = useState(false);

  const handlePrint = (theme: PrintTheme) => {
    const blob = new Blob([buildCombinedPrintHTML(window.location.origin, lang, theme)], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
    setPrintMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      
      <Header />
      <HeroSection />
      <ProductGrid
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onMatchCountChange={setMatchedCount}
        matchedCount={matchedCount}
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
                <p className="hidden lg:block text-muted-foreground max-w-md handwritten">
                
                  {t.index.tagline}
                </p>
               
                <div className="lg:hidden flex items-start gap-4">
                  <div className="text-muted-foreground max-w-md handwritten flex-1">
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
     
        <section className="border-t border-border py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-6">
              {t.index.catalogsTitle}
            </p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-border">
              {[
                { to: "/watercolor-catalog",  label: t.watercolorCatalog.subtitle,  image: "/watercolors/01/main.jpg" },
                { to: "/remains-catalog",     label: t.remainsCatalog.subtitle,     image: "/remains/01/main.jpg" },
                { to: "/21spirit-catalog",    label: t.spirit21Catalog.subtitle,    image: "/21spirit/01/main.jpg" },
                { to: "/photography-catalog", label: t.photographyCatalog.subtitle, image: "/photography/01/main.jpg" },
              ].map(({ to, label, image }) => (
                <Link
                  key={to}
                  to={to}
                  className="bg-background flex items-center gap-3 px-5 py-5 group hover:bg-primary/5 transition-colors"
                >
                  <img
                    src={image}
                    alt={label}
                    className="w-12 h-12 object-cover shrink-0 transition-all duration-300 group-hover:w-24 group-hover:h-24 group-hover:shadow-xl"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                  <span className="font-mono text-xs uppercase tracking-widest leading-tight flex-1 transition-all duration-300 group-hover:text-base group-hover:tracking-wide group-hover:text-primary">
                    {label}
                  </span>
                  <span className="text-primary text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-border py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            {/* <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              {t.watercolorCatalog.printCatalog}
            </p> */}
            <div className="relative">
              {printMenuOpen && (
                <div className="fixed inset-0 z-10" onClick={() => setPrintMenuOpen(false)} />
              )}
              <button
                type="button"
                onClick={() => setPrintMenuOpen(o => !o)}
                className="handwritten inline-flex items-center gap-2 transition-colors text-xs uppercase tracking-widest border border-border px-3 py-2 hover:text-primary hover:border-primary"
              >
                <BookOpen className="h-4 w-4" />
                {t.watercolorCatalog.printCatalog}
              </button>
              {printMenuOpen && (
                <div className="absolute right-0 bottom-full mb-1 z-20 border border-border bg-background min-w-[120px]">
                  {(["light", "dark"] as const).map(theme => (
                    <button
                      key={theme}
                      type="button"
                      onClick={() => handlePrint(theme)}
                      className="w-full flex items-center gap-2 px-3 py-2 font-mono text-xs hover:bg-muted transition-colors text-foreground"
                    >
                      <span className={`inline-block w-3 h-3 border border-current ${theme === "dark" ? "bg-foreground" : ""}`} />
                      {theme === "light" ? "Light" : "Dark"}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        <About /> <Footer />
      
    </div>
  );
};

export default Index;
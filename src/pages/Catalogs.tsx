import { useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { buildCombinedPrintHTML, type PrintTheme } from "@/lib/printCatalog";

const Catalogs = () => {
  const { lang, t } = useLanguage();
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

      <section className="border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-6">
            {t.index.catalogsTitle}
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-border">
            {[
              { to: "/watercolor-catalog", label: t.watercolorCatalog.subtitle, image: "/watercolors/01/main.jpg" },
              { to: "/remains-catalog",    label: t.remainsCatalog.subtitle,    image: "/remains/01/main.jpg" },
              { to: "/21spirit-catalog",   label: t.spirit21Catalog.subtitle,   image: "/21spirit/01/main.jpg" },
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

            <Link
              to="/photography-catalog"
              className="bg-background flex items-center gap-3 px-5 py-5 group hover:bg-primary/5 transition-colors"
            >
              <img
                src="/photography/01/main.jpg"
                alt={t.photographyCatalog.subtitle}
                className="w-12 h-12 object-cover shrink-0 transition-all duration-300 group-hover:w-24 group-hover:h-24 group-hover:shadow-xl"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
              <span className="font-mono text-xs uppercase tracking-widest leading-tight flex-1 transition-all duration-300 group-hover:text-base group-hover:tracking-wide group-hover:text-primary">
                {t.photographyCatalog.subtitle}
              </span>
              <span className="text-primary text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                →
              </span>
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
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
              <div className="absolute left-0 bottom-full mb-1 z-20 border border-border bg-background min-w-[120px]">
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

      <Footer />
    </div>
  );
};

export default Catalogs;

import { useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { buildCombinedPrintHTML, type PrintTheme } from "@/lib/printCatalog";

const CATALOGS = [
  {
    to: "/watercolor-catalog",
    images: ["/watercolors/01/main.jpg", "/watercolors/02/main.jpg"],
    labelKey: "watercolorCatalog" as const,
  },
  {
    to: "/remains-catalog",
    images: ["/remains/01/main.jpg", "/remains/02/main.jpg"],
    labelKey: "remainsCatalog" as const,
  },
  {
    to: "/21spirit-catalog",
    images: ["/21spirit/01/main.jpg", "/21spirit/02/main.jpg"],
    labelKey: "spirit21Catalog" as const,
  },
  {
    to: "/photography-catalog",
    images: ["/photography/01/main.jpg", "/photography/02/main.jpg"],
    labelKey: "photographyCatalog" as const,
  },
];

const Catalogs = () => {
  const { lang, t } = useLanguage();
  const [printMenuOpen, setPrintMenuOpen] = useState(false);

  const handlePrint = (theme: "light" | "dark") => {
    const blob = new Blob([buildCombinedPrintHTML(window.location.origin, lang, theme)], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
    setPrintMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="border-t border-border">
        {CATALOGS.map(({ to, images, labelKey }) => {
          const label = t[labelKey].subtitle;
          return (
            <Link
              key={to}
              to={to}
              className="group relative block overflow-hidden border-b border-border"
              style={{ height: "55vw", maxHeight: "80vh", minHeight: "240px" }}
            >
              {/* Two images side by side */}
              <div className="absolute inset-0 grid grid-cols-2">
                {images.map((src, i) => (
                  <div key={i} className="relative overflow-hidden bg-black">
                    <img
                      src={src}
                      alt=""
                      className="w-full h-full object-cover opacity-80 transition-all duration-700 group-hover:opacity-60 group-hover:scale-105"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                  </div>
                ))}
              </div>

              {/* Bottom gradient so text is legible */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent pointer-events-none" />

              {/* Title spanning full width at bottom */}
              <div className="absolute bottom-0 left-0 right-0 px-4 pb-4 md:px-8 md:pb-6">
                <h2
                  className="shop-title text-white leading-none"
                  style={{ fontSize: "clamp(2.5rem, 8vw, 7rem)" }}
                >
                  {label}
                </h2>
              </div>
            </Link>
          );
        })}
      </section>

      {/* Print catalog */}
      <section className="border-t border-border py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            {t.index.catalogsTitle}
          </p>
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

      <Footer />
    </div>
  );
};

export default Catalogs;

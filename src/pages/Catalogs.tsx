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

// Right image stops at this fraction of the section height,
// leaving a dark strip at the bottom so the title "peeks" into it.
const RIGHT_IMG_HEIGHT = "78%";

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
              className="group relative block bg-black border-b border-border overflow-hidden"
              style={{ height: "56vw", maxHeight: "85vh", minHeight: "300px" }}
            >
              {/* LEFT image — full height */}
              <div
                className="absolute inset-y-0 left-0 overflow-hidden"
                style={{ width: "calc(50% - 1px)" }}
              >
                <img
                  src={images[0]}
                  alt=""
                  className="w-full h-full object-cover opacity-90 transition-all duration-700 group-hover:opacity-70 group-hover:scale-105"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
                {/* gradient so title is legible over left image */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none" />
              </div>

              {/* 1px black gutter between columns */}
              <div className="absolute inset-y-0 bg-black" style={{ left: "calc(50% - 1px)", width: 2 }} />

              {/* RIGHT image — top-aligned, stops at RIGHT_IMG_HEIGHT (stagger) */}
              <div
                className="absolute top-0 right-0 overflow-hidden"
                style={{ width: "50%", height: RIGHT_IMG_HEIGHT }}
              >
                <img
                  src={images[1]}
                  alt=""
                  className="w-full h-full object-cover opacity-90 transition-all duration-700 group-hover:opacity-70 group-hover:scale-105"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
                {/* soften the bottom edge of the right image so title blends in */}
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
              </div>

              {/* TITLE — bottom of section, z-index above images so it overlaps their bottom edges */}
              <div className="absolute bottom-0 left-0 right-0 z-10 px-5 pb-5">
                <h2
                  className="shop-title text-white leading-none"
                  style={{ fontSize: "clamp(2rem, 9vw, 7.5rem)" }}
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

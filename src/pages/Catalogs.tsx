import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, BookOpen } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { buildCombinedPrintHTML, buildVendorCatalogHTML, type PrintTheme } from "@/lib/printCatalog";
import { usePageMeta } from "@/hooks/usePageMeta";

const CATALOGS = [
  {
    to: "/slightlyusefulobject",
    images: [
      new URL("../assets/products/spikedcupcakechoker/main.webp", import.meta.url).href,
      new URL("../assets/products/eggbaconmagnets/main.jpg", import.meta.url).href,
    ],
    labelKey: "usefulCatalog" as const,
  },
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

  usePageMeta({
    title: "Catalogs — Fine Art Prints & Wall Art",
    description: "Browse Chun Wang's fine Catalogs — original watercolor, mixed-media, and photography wall art and prints, from Watercolors, Remains, In the Spirit of the 21st Century, and Photography.",
    path: "/catalogs",
  });

  const handlePrint = (theme: "light" | "dark", mode: "combined" | "vendor") => {
    const html = mode === "vendor"
      ? buildVendorCatalogHTML(window.location.origin, lang, theme)
      : buildCombinedPrintHTML(window.location.origin, lang, theme);
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
    setPrintMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to="/"
            className="sans-label inline-flex items-center gap-2 text-xs uppercase tracking-widest transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Chun Wang Studio Shop
          </Link>
        </div>
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-2 border-t border-border">
        {CATALOGS.map(({ to, images, labelKey }, index) => {
          const label = t[labelKey].subtitle;
          const isLeftColumn = index % 2 === 0;
          return (
            <Link
              key={to}
              to={to}
              className={`group relative block bg-black border-b border-border overflow-hidden aspect-video ${
                isLeftColumn ? "sm:border-r" : ""
              }`}
              style={{ maxHeight: "85vh", minHeight: "300px" }}
            >
              {/* ── Layer 1 (back): RIGHT image — BEHIND the title text ── */}
              <div
                className="absolute top-0 right-0 overflow-hidden"
                style={{
                  width: "38%",
                  height: "50%",
                  zIndex: 5,
                  // soft right and bottom edges — organic, not rigid
                  maskImage: "linear-gradient(to bottom, black 55%, transparent 100%)",
                  WebkitMaskImage: "linear-gradient(to bottom, black 55%, transparent 100%)",
                }}
              >
                <img
                  src={images[1]}
                  alt={`${label} fine art print`}
                  className="w-full h-full object-cover opacity-90 group-hover:opacity-70 group-hover:scale-105 transition-all duration-700"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
              </div>

              {/* ── Layer 2 (middle): TITLE — in front of right image, behind left image ── */}
              {/* spans the full row width */}
              <div
                className="absolute bottom-0 left-0 right-0 px-5 pb-5"
                style={{ zIndex: 10 }}
              >
                <h2 className="shop-title gloria-title text-white leading-none w-full text-[clamp(2rem,9vw,7.5rem)] sm:text-[clamp(1.5rem,4.5vw,6rem)]">
                  {label}
                </h2>
              </div>

              {/* ── Layer 3 (front): LEFT image — ON TOP of the title, rests on the text ── */}
              {/* natural gap on the right side; bottom mask lets title peek through */}
              <div
                className="absolute top-0 left-0 overflow-hidden"
                style={{
                  width: "37%",
                  height: "68%",
                  zIndex: 20,
                  maskImage: "linear-gradient(to bottom, black 60%, transparent 100%)",
                  WebkitMaskImage: "linear-gradient(to bottom, black 60%, transparent 100%)",
                }}
              >
                <img
                  src={images[0]}
                  alt={`${label} original artwork`}
                  className="w-full h-full object-cover opacity-90 group-hover:opacity-70 group-hover:scale-105 transition-all duration-700"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
              </div>
            </Link>
          );
        })}
      </section>

      {/* Print catalog */}
      <section className="border-t border-border py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="relative">
            {printMenuOpen && (
              <div className="fixed inset-0 z-10" onClick={() => setPrintMenuOpen(false)} />
            )}
            <button
              type="button"
              onClick={() => setPrintMenuOpen(o => !o)}
              className="sans-label inline-flex items-center gap-2 transition-colors text-xs uppercase tracking-widest px-3 py-2 hover:text-primary"
            >
              <BookOpen className="h-4 w-4" />
              {t.watercolorCatalog.printCatalog}
            </button>
            {printMenuOpen && (
              <div className="absolute right-0 bottom-full mb-1 z-20 border border-border bg-background min-w-[220px]">
                <div className="border-b border-border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  {t.watercolorCatalog.printCatalog}
                </div>
                {(["light", "dark"] as const).map(theme => (
                  <button
                    key={`combined-${theme}`}
                    type="button"
                    onClick={() => handlePrint(theme, "combined")}
                    className="w-full flex items-center gap-2 px-3 py-2 font-mono text-xs hover:bg-muted transition-colors text-foreground border-b border-border last:border-b-0"
                  >
                    <span className={`inline-block w-3 h-3 border border-current ${theme === "dark" ? "bg-foreground" : ""}`} />
                    {theme === "light" ? "Light" : "Dark"} · complete
                  </button>
                ))}

                <div className="border-t border-border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  {t.watercolorCatalog.printVendorCatalog}
                </div>
                {(["light", "dark"] as const).map(theme => (
                  <button
                    key={`vendor-${theme}`}
                    type="button"
                    onClick={() => handlePrint(theme, "vendor")}
                    className="w-full flex items-center gap-2 px-3 py-2 font-mono text-xs hover:bg-muted transition-colors text-foreground"
                  >
                    <span className={`inline-block w-3 h-3 border border-current ${theme === "dark" ? "bg-foreground" : ""}`} />
                    {theme === "light" ? "Light" : "Dark"} · vendor
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

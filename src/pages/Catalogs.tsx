import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, BookImage, BookOpen, Store } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { buildCombinedPrintHTML, buildVendorCatalogHTML, type PrintTheme } from "@/lib/printCatalog";
import { usePageMeta } from "@/hooks/usePageMeta";
import { useImageHoverExpand } from "@/hooks/useImageHoverExpand";

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

const CatalogTile = ({
  to,
  images,
  label,
  isLeftColumn,
}: {
  to: string;
  images: string[];
  label: string;
  isLeftColumn: boolean;
}) => {
  const rightImage = useImageHoverExpand("cover");
  const leftImage = useImageHoverExpand("cover");

  return (
    <Link
      to={to}
      className={`group relative block bg-black border-b border-border overflow-hidden aspect-video ${
        isLeftColumn ? "sm:border-r" : ""
      }`}
      style={{ maxHeight: "85vh", minHeight: "300px" }}
      onMouseEnter={() => { rightImage.hoverHandlers.onMouseEnter(); leftImage.hoverHandlers.onMouseEnter(); }}
      onMouseLeave={() => { rightImage.hoverHandlers.onMouseLeave(); leftImage.hoverHandlers.onMouseLeave(); }}
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
          ref={rightImage.imgRef}
          src={images[1]}
          alt={`${label} fine art print`}
          className="w-full h-full object-cover opacity-90 group-hover:opacity-70 transition-opacity duration-700"
          style={rightImage.imgStyle}
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
          ref={leftImage.imgRef}
          src={images[0]}
          alt={`${label} original artwork`}
          className="w-full h-full object-cover opacity-90 group-hover:opacity-70 transition-opacity duration-700"
          style={leftImage.imgStyle}
          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
        />
      </div>
    </Link>
  );
};

const Catalogs = () => {
  const { lang, t } = useLanguage();
  const [openMenu, setOpenMenu] = useState<"art" | "shop" | null>(null);

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
    setOpenMenu(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link
            to="/"
            className="sans-label font-normal inline-flex items-center gap-2 text-xs uppercase tracking-widest transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Chun Wang Studio Shop
          </Link>

          <div className="flex items-center gap-2">
            <Link
              to="/catalogs/book"
              className="sans-label font-normal inline-flex items-center gap-2 transition-colors text-xs uppercase tracking-widest px-3 py-2 hover:text-primary"
            >
              <BookImage className="h-4 w-4" />
              {t.catalogBook.cta}
            </Link>

            <Link
              to="/book"
              className="sans-label font-normal inline-flex items-center gap-2 transition-colors text-xs uppercase tracking-widest px-3 py-2 hover:text-primary"
            >
              <BookOpen className="h-4 w-4" />
              {lang === "zh" ? "读整本书" : "Read the book"}
            </Link>
            <div className="relative">
              {openMenu === "shop" && (
                <div className="fixed inset-0 z-10" onClick={() => setOpenMenu(null)} />
              )}
              <button
                type="button"
                onClick={() => setOpenMenu(m => (m === "shop" ? null : "shop"))}
                className="sans-label font-normal inline-flex items-center gap-2 transition-colors text-xs uppercase tracking-widest px-3 py-2 hover:text-primary"
              >
                <Store className="h-4 w-4" />
                {t.watercolorCatalog.printVendorCatalog}
              </button>
              {openMenu === "shop" && (
                <div className="absolute right-0 top-full mt-1 z-20 border border-border bg-background min-w-[160px]">
                  {(["light", "dark"] as const).map(theme => (
                    <button
                      key={`vendor-${theme}`}
                      type="button"
                      onClick={() => handlePrint(theme, "vendor")}
                      className="w-full flex items-center gap-2 px-3 py-2 font-mono text-xs hover:bg-muted transition-colors text-foreground border-b border-border last:border-b-0"
                    >
                      <span className={`inline-block w-3 h-3 border border-current ${theme === "dark" ? "bg-foreground" : ""}`} />
                      {theme === "light" ? "Light" : "Dark"}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              {openMenu === "art" && (
                <div className="fixed inset-0 z-10" onClick={() => setOpenMenu(null)} />
              )}
              <button
                type="button"
                onClick={() => setOpenMenu(m => (m === "art" ? null : "art"))}
                className="sans-label font-normal inline-flex items-center gap-2 transition-colors text-xs uppercase tracking-widest px-3 py-2 hover:text-primary"
              >
                <BookOpen className="h-4 w-4" />
                {t.watercolorCatalog.printCatalog}
              </button>
              {openMenu === "art" && (
                <div className="absolute right-0 top-full mt-1 z-20 border border-border bg-background min-w-[160px]">
                  {(["light", "dark"] as const).map(theme => (
                    <button
                      key={`combined-${theme}`}
                      type="button"
                      onClick={() => handlePrint(theme, "combined")}
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
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-2 border-t border-border">
        {CATALOGS.map(({ to, images, labelKey }, index) => (
          <CatalogTile
            key={to}
            to={to}
            images={images}
            label={t[labelKey].subtitle}
            isLeftColumn={index % 2 === 0}
          />
        ))}
        {/* The printed book — same tile language, linking to the full print-ready edition */}
        <CatalogTile
          to="/book"
          images={["/watercolors/01/main.jpg", "/remains/01/main.jpg"]}
          label={lang === "zh" ? "王淳绘画集" : "Chun Wang Paintings"}
          isLeftColumn={false}
        />
      </section>

      <Footer />
    </div>
  );
};

export default Catalogs;

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getWatercolor, seriesList, watercolors as allWatercolors } from "@/lib/watercolors";

const watercolors = allWatercolors.filter((w) => w.showInStorefront !== false);
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ZoomableImage } from "@/components/ZoomableImage";
import { toast } from "sonner";

const INQUIRY_EMAIL = "chunwang.me@gmail.com";
const MAX_DETAIL_IMAGES = 20;

const WatercolorDetail = () => {
  const { t, lang } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [images, setImages] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const work = id ? getWatercolor(id) : undefined;
  const paddedId = id?.padStart(2, "0") ?? "";

  useEffect(() => {
    if (!paddedId) return;
    setSelectedIndex(0);

    const candidates = [
      `/watercolors/${paddedId}/main.jpg`,
      ...Array.from({ length: MAX_DETAIL_IMAGES }, (_, i) => `/watercolors/${paddedId}/${i + 1}.jpg`),
    ];

    Promise.all(
      candidates.map(
        (src) =>
          new Promise<string | null>((resolve) => {
            const img = new Image();
            img.onload = () => resolve(src);
            img.onerror = () => resolve(null);
            img.src = src;
          })
      )
    ).then((results) => setImages(results.filter(Boolean) as string[]));
  }, [paddedId]);

  if (!work) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="handwritten text-muted-foreground">{t.watercolor.notFound}</p>
        </div>
        <Footer />
      </div>
    );
  }

  const currentImage = images[selectedIndex] ?? null;

  const seriesData = seriesList.find((s) => s.id === work.series);

  const handleInquire = () => {
    navigator.clipboard.writeText(INQUIRY_EMAIL).then(() => {
      toast("Email copied to clipboard", { description: INQUIRY_EMAIL });
    });
  };

  const currentIndex = work ? watercolors.findIndex((item) => item.id === work.id) : -1;
  const prevWork = currentIndex > 0 ? watercolors[currentIndex - 1] : undefined;
  const nextWork = currentIndex >= 0 && currentIndex < watercolors.length - 1 ? watercolors[currentIndex + 1] : undefined;

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(work!.paylink, "_blank");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between gap-4 mb-10">
          <button
            onClick={() => navigate("/watercolor-catalog")}
            className="handwritten flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {t.watercolor.backToCatalog}
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => prevWork && navigate(`/watercolors/${prevWork.id}`)}
              disabled={!prevWork}
              className="inline-flex items-center gap-2 rounded border border-border bg-background px-3 py-2 text-xs text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 hover:border-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              {lang === "zh" ? "上一件" : "Previous"}
            </button>
            <button
              type="button"
              onClick={() => nextWork && navigate(`/watercolors/${nextWork.id}`)}
              disabled={!nextWork}
              className="inline-flex items-center gap-2 rounded border border-border bg-background px-3 py-2 text-xs text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 hover:border-foreground hover:text-foreground transition-colors"
            >
              {lang === "zh" ? "下一件" : "Next"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Main image */}
          <div className="space-y-3">
            {currentImage ? (
              <ZoomableImage
                src={currentImage}
                alt={work.title}
                imgClassName="w-full h-auto"
                images={images}
                startIndex={selectedIndex}
                onNavigate={setSelectedIndex}
              />
            ) : (
              <div className="aspect-[8.5/11] bg-secondary flex items-center justify-center">
                <span className="font-mono text-xs text-muted-foreground/40 uppercase tracking-widest">
                  No image
                </span>
              </div>
            )}

            {/* Detail image thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 flex-wrap">
                {images.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedIndex(i)}
                    className={`w-24 h-24 flex-shrink-0 overflow-hidden border transition-colors ${
                      selectedIndex === i ? "border-primary" : "border-border hover:border-muted-foreground"
                    }`}
                  >
                    <img src={src} alt={`view ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-8">
            <div>
              <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase mb-2">
                {seriesData ? `${lang === "zh" ? seriesData.chineseName : seriesData.englishName}` : `${t.watercolor.seriesPrefix} ${work.series}`}
              </p>
              <h1 className="shop-title text-4xl leading-none">
                {lang === "zh" && work.titleZh ? work.titleZh : work.title}
              </h1>
            </div>

            {(work.description || work.descriptionZh) && (
              <p
                className="description-html text-sm text-muted-foreground leading-relaxed"
                dangerouslySetInnerHTML={{ __html: lang === "zh" && work.descriptionZh ? work.descriptionZh : work.description ?? "" }}
              />
            )}

            <div className={`space-y-1 font-mono text-muted-foreground ${lang === "zh" ? "text-sm" : "text-xs"}`}>
              <p>{lang === "zh" && work.mediumZh ? work.mediumZh : work.medium}</p>
              {(work.dimensions || work.dimensionsZh) && (
                <p>{lang === "zh" && work.dimensionsZh ? work.dimensionsZh : work.dimensions}</p>
              )}
              <p>{work.year}</p>
            </div>

            <div className="border-t border-border pt-8 space-y-4">
              {work.price != null && work.paylink ? (
                <>
                  <button
                    onClick={handleBuyNow}
                    className="handwritten inline-block w-full bg-primary text-primary-foreground px-8 py-3 text-lg font-bold hover:bg-primary/90 transition-colors text-center"
                  >
                    {t.watercolor.buyNow} — ${work.price}
                  </button>
                  <p className="text-xs text-muted-foreground font-mono">
                    {t.watercolor.shippingIncluded}
                  </p>
                </>
              ) : (
                <button
                  onClick={handleInquire}
                  className="handwritten inline-block bg-primary text-primary-foreground px-8 py-3 text-sm hover:bg-primary/90 transition-colors"
                >
                  {t.watercolor.inquire}
                </button>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default WatercolorDetail;

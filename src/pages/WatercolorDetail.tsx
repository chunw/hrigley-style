import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getWatercolor, seriesList, studioCardPayLink, PRINT_9X12_PAYLINK } from "@/lib/watercolors";
import { shopOrderNavigableItems } from "@/hooks/useProducts";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ZoomableImage } from "@/components/ZoomableImage";
import { toast } from "sonner";
import { usePageMeta } from "@/hooks/usePageMeta";
import { buildArtworkJsonLd } from "@/lib/seo";

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

  usePageMeta({
    title: work ? work.title : "Watercolor",
    description: work?.description || `${work?.title ?? ""} — ${work?.medium ?? "Watercolor"}, ${work?.year ?? ""}. Original watercolor painting by Chun Wang.`,
    image: work ? `/watercolors/${paddedId}/main.jpg` : undefined,
    path: `/watercolors/${id ?? ""}`,
    type: "product",
    jsonLd: work
      ? buildArtworkJsonLd({
          title: work.title,
          medium: work.medium ?? "Watercolor",
          year: work.year,
          image: `/watercolors/${paddedId}/main.jpg`,
          description: work.description,
          price: work.price ?? work.printPrice,
          soldOut: work.soldOut,
        })
      : undefined,
  });

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

  const currentIndex = shopOrderNavigableItems.findIndex(
    (item) => item.type === "watercolor" && item.id === work.id
  );
  const prevItem = currentIndex > 0 ? shopOrderNavigableItems[currentIndex - 1] : undefined;
  const nextItem =
    currentIndex >= 0 && currentIndex < shopOrderNavigableItems.length - 1
      ? shopOrderNavigableItems[currentIndex + 1]
      : undefined;

  const effectivePaylink = work?.series === "III" ? studioCardPayLink(work.title) : (work?.paylink ?? PRINT_9X12_PAYLINK);

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(effectivePaylink, "_blank");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        {(prevItem || nextItem) && (
          <div className="flex items-center gap-3 mt-4 mb-10">
              {prevItem && (
                <button
                  type="button"
                  onClick={() => navigate(prevItem.path)}
                  className="inline-flex items-center gap-2 px-3 py-2 text-xs font-helvetica text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  {lang === "zh" ? "上一件" : "Previous"}
                </button>
              )}
              {nextItem && (
                <button
                  type="button"
                  onClick={() => navigate(nextItem.path)}
                  className="inline-flex items-center gap-2 px-3 py-2 text-xs font-helvetica text-muted-foreground hover:text-foreground transition-colors"
                >
                  {lang === "zh" ? "下一件" : "Next"}
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
          </div>
        )}

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
                    className={`w-24 h-24 flex-shrink-0 overflow-hidden transition-all ${
                      selectedIndex === i ? "ring-2 ring-primary" : "opacity-60 hover:opacity-100"
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
              <h1 className="shop-title product-title text-4xl leading-none">
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
              {work.medium && <p>{lang === "zh" && work.mediumZh ? work.mediumZh : work.medium}</p>}
              {(work.dimensions || work.dimensionsZh) && (
                <p>{lang === "zh" && work.dimensionsZh ? work.dimensionsZh : work.dimensions}</p>
              )}
              <p>{work.year}</p>
              <p>{lang === "zh" ? `现提供${work.printInfoZh ?? '23×30厘米精细艺术哑光纸印刷品'}` : `Available as ${work.printInfo ?? '9×12" fine art matte paper print'}`}</p>
            </div>

            <div className="border-t border-border pt-8 space-y-4">
              {(() => {
                const displayPrice = work.price ?? work.printPrice ?? 10;
                if (displayPrice != null) {
                  return (
                    <>
                      <p className="sans-label text-2xl font-bold">${displayPrice}</p>
                      <button
                        onClick={work.soldOut ? undefined : (effectivePaylink ? handleBuyNow : handleInquire)}
                        disabled={work.soldOut}
                        className={`sans-label gloria-button-label inline-block w-full bg-primary text-primary-foreground px-8 py-3 text-lg font-bold hover:bg-primary/90 transition-colors text-center ${work.soldOut ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                      >
                        {work.soldOut ? t.productDetails.soldOut : t.watercolor.buyNow}
                      </button>
                      <p className="text-xs text-muted-foreground font-mono">
                        {t.watercolor.shippingIncluded}
                      </p>
                    </>
                  );
                }
                return null;
              })()}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default WatercolorDetail;

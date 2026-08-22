import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { remainsWorks } from "@/lib/remains";
import { studioCardPayLink, PRINT_9X12_PAYLINK } from "@/lib/watercolors";
import { shopOrderNavigableItems } from "@/hooks/useProducts";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ZoomableImage } from "@/components/ZoomableImage";
import { toast } from "sonner";
import { usePageMeta } from "@/hooks/usePageMeta";
import { buildArtworkJsonLd } from "@/lib/seo";
import { catalogMeta } from "@/lib/remains";

const INQUIRY_EMAIL = "chunwang.me@gmail.com";
const MAX_DETAIL_IMAGES = 20;

const RemainsDetail = () => {
  const { t, lang } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [images, setImages] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const work = id ? remainsWorks.find((w) => w.id === id) : undefined;
  const paddedId = id?.padStart(2, "0") ?? "";

  usePageMeta({
    title: work ? work.title : "Remains",
    description: work?.description || catalogMeta.description,
    image: work ? `/remains/${paddedId}/main.jpg` : undefined,
    path: `/remains/${id ?? ""}`,
    type: "product",
    jsonLd: work
      ? buildArtworkJsonLd({
          title: work.title,
          medium: work.medium ?? catalogMeta.medium,
          year: work.year,
          image: `/remains/${paddedId}/main.jpg`,
          description: work.description || catalogMeta.description,
          price: work.price,
        })
      : undefined,
  });

  useEffect(() => {
    if (!paddedId) return;
    setSelectedIndex(0);

    const candidates = [
      `/remains/${paddedId}/main.jpg`,
      ...Array.from({ length: MAX_DETAIL_IMAGES }, (_, i) => `/remains/${paddedId}/${i + 1}.jpg`),
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

  const handleInquire = () => {
    navigator.clipboard.writeText(INQUIRY_EMAIL).then(() => {
      toast("Email copied to clipboard", { description: INQUIRY_EMAIL });
    });
  };

  const currentIndex = shopOrderNavigableItems.findIndex(
    (item) => item.type === "remains" && item.id === work.id
  );
  const prevItem = currentIndex > 0 ? shopOrderNavigableItems[currentIndex - 1] : undefined;
  const nextItem = currentIndex >= 0 && currentIndex < shopOrderNavigableItems.length - 1
    ? shopOrderNavigableItems[currentIndex + 1]
    : undefined;

  const paylink4x6 = work.paylink ?? studioCardPayLink(work.title);
  const paylink9x12 = PRINT_9X12_PAYLINK;

  const handleBuy4x6 = (e: React.MouseEvent) => { e.stopPropagation(); window.open(paylink4x6, "_blank"); };
  const handleBuy9x12 = (e: React.MouseEvent) => { e.stopPropagation(); window.open(paylink9x12, "_blank"); };

  const title = lang === "zh" && work.titleZh ? work.titleZh : work.title;

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

          <div className="space-y-8">
            <div>
              <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase mb-2">
                Remains {paddedId}
              </p>
              <h1 className="shop-title product-title text-4xl leading-none">{title}</h1>
            </div>

            {(work.description || work.descriptionZh) && (
              <p
                className="description-html text-sm text-muted-foreground leading-relaxed"
                dangerouslySetInnerHTML={{ __html: lang === "zh" && work.descriptionZh ? work.descriptionZh : work.description ?? "" }}
              />
            )}

            <div className={`space-y-1 font-mono text-muted-foreground ${lang === "zh" ? "text-sm" : "text-xs"}`}>
              {(work.medium || work.mediumZh) && (
                <p>{lang === "zh" && work.mediumZh ? work.mediumZh : work.medium}</p>
              )}
              {(work.dimensions || work.dimensionsZh) && (
                <p>{lang === "zh" && work.dimensionsZh ? work.dimensionsZh : work.dimensions}</p>
              )}
              {work.year && <p>{work.year}</p>}
              <p>{lang === "zh" ? "现提供4×6英寸精细艺术哑光纸印刷品" : `Available as 4×6" fine art matte paper print`}</p>
            </div>

            <div className="border-t border-border pt-8 space-y-4">
              <>
                <button
                  onClick={handleBuy4x6}
                  className="sans-label gloria-button-label inline-block w-full bg-primary text-primary-foreground px-8 py-3 text-lg font-bold hover:bg-primary/90 transition-colors text-center"
                >
                  {t.watercolor.buyNow}
                </button>
                <p className="text-xs text-muted-foreground font-mono">
                  {t.watercolor.shippingIncluded}
                </p>
              </>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RemainsDetail;

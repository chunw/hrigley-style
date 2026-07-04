import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { remainsWorks } from "@/lib/remains";
import { studioCardPayLink, PRINT_9X12_PAYLINK } from "@/lib/watercolors";
import { shopOrderNavigableItems } from "@/hooks/useProducts";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ZoomableImage } from "@/components/ZoomableImage";
import { toast } from "sonner";

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
        <div className="flex items-center gap-3 mb-10">
          <button
            type="button"
            onClick={() => prevItem && navigate(prevItem.path)}
            disabled={!prevItem}
            className="inline-flex items-center gap-2 rounded border border-border bg-background px-3 py-2 text-xs text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 hover:border-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {lang === "zh" ? "上一件" : "Previous"}
          </button>
          <button
            type="button"
            onClick={() => nextItem && navigate(nextItem.path)}
            disabled={!nextItem}
            className="inline-flex items-center gap-2 rounded border border-border bg-background px-3 py-2 text-xs text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 hover:border-foreground hover:text-foreground transition-colors"
          >
            {lang === "zh" ? "下一件" : "Next"}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

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

          <div className="space-y-8">
            <div>
              <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase mb-2">
                Remains {paddedId}
              </p>
              <h1 className="shop-title text-4xl leading-none">{title}</h1>
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
              <p>{lang === "zh" ? "所有印刷品均有签名和限量版号" : "All prints are signed and editioned"}</p>
            </div>

            <div className="border-t border-border pt-8 space-y-4">
              <>
                <button
                  onClick={handleBuy4x6}
                  className="handwritten inline-block w-full bg-primary text-primary-foreground px-8 py-3 text-lg font-bold hover:bg-primary/90 transition-colors text-center"
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

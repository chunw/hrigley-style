import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { spiritWorks } from "@/lib/21spirit";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ZoomableImage } from "@/components/ZoomableImage";
import { toast } from "sonner";

const INQUIRY_EMAIL = "chunwang.me@gmail.com";
const MAX_DETAIL_IMAGES = 20;

const Spirit21Detail = () => {
  const { t, lang } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [images, setImages] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const work = id ? spiritWorks.find((w) => w.id === id) : undefined;
  const paddedId = id?.padStart(2, "0") ?? "";

  useEffect(() => {
    if (!paddedId) return;
    setSelectedIndex(0);

    const candidates = [
      `/21spirit/${paddedId}/main.jpg`,
      ...Array.from({ length: MAX_DETAIL_IMAGES }, (_, i) => `/21spirit/${paddedId}/${i + 1}.jpg`),
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

  const currentIndex = spiritWorks.findIndex((item) => item.id === work.id);
  const prevWork = currentIndex > 0 ? spiritWorks[currentIndex - 1] : undefined;
  const nextWork = currentIndex >= 0 && currentIndex < spiritWorks.length - 1 ? spiritWorks[currentIndex + 1] : undefined;

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(work!.paylink, "_blank");
  };

  const title = lang === "zh" && work.titleZh ? work.titleZh : work.title;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between gap-4 mb-10">
          <button
            onClick={() => navigate("/21spirit-catalog")}
            className="handwritten flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {t.watercolor.backToCatalog}
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => prevWork && navigate(`/21spirit/${prevWork.id}`)}
              disabled={!prevWork}
              className="inline-flex items-center gap-2 rounded border border-border bg-background px-3 py-2 text-xs text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 hover:border-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              {lang === "zh" ? "上一件" : "Previous"}
            </button>
            <button
              type="button"
              onClick={() => nextWork && navigate(`/21spirit/${nextWork.id}`)}
              disabled={!nextWork}
              className="inline-flex items-center gap-2 rounded border border-border bg-background px-3 py-2 text-xs text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 hover:border-foreground hover:text-foreground transition-colors"
            >
              {lang === "zh" ? "下一件" : "Next"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
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
                In The Spirit of the 21st Century {paddedId}
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

export default Spirit21Detail;

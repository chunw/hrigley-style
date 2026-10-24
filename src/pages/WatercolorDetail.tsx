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
import ArtworkPurchase, { type ArtworkCartOption } from "@/components/ArtworkPurchase";

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

  // Purchasable options for the cart. Works with a two-price label
  // (e.g. "$10 / $35") offer the 9×12" print at the first price and the
  // framed original at the second; everything else is a single option at
  // the price the page already charges through its PayPal link.
  const priceLabelPrices = work.priceLabel
    ? [...work.priceLabel.matchAll(/\$(\d+(?:\.\d+)?)/g)].map((m) => parseFloat(m[1]))
    : [];
  const isMultiOption = Boolean(work.multiOptionsPaylink) || priceLabelPrices.length === 2;
  let purchaseOptions: ArtworkCartOption[];
  if (isMultiOption) {
    const [firstPrice, secondPrice] =
      priceLabelPrices.length === 2
        ? (priceLabelPrices as [number, number])
        : [work.price ?? 10, work.printPrice ?? 35];
    purchaseOptions = [
      { key: "print-9x12", labelEn: '9×12" fine art print', labelZh: "9×12英寸艺术微喷印刷品", price: firstPrice },
      { key: "framed-original", labelEn: "Framed original", labelZh: "原作（已装裱）", price: secondPrice },
    ];
  } else {
    const price = work.price ?? work.printPrice ?? 10;
    const isStudioCard = work.series === "III";
    const labelEn = isStudioCard
      ? "Studio card"
      : price === 25
        ? "Framed print"
        : (work.printInfo ?? (price === 4 ? '4×6" fine art print' : '9×12" fine art print'));
    const labelZh = isStudioCard
      ? "工作室卡片"
      : price === 25
        ? "装裱印刷品"
        : (work.printInfoZh ?? (price === 4 ? "4×6英寸艺术微喷印刷品" : "9×12英寸艺术微喷印刷品"));
    purchaseOptions = [{ key: "standard", labelEn, labelZh, price }];
  }

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
              <p>{lang === "zh" ? (work.availabilityTextZh ?? `现提供${work.printInfoZh ?? '9×12英寸精细艺术哑光纸印刷品'}`) : (work.availabilityText ?? `Available as ${work.printInfo ?? '9×12" fine art matte paper print'}`)}</p>
            </div>

            <ArtworkPurchase
              baseId={`watercolor-${work.id}`}
              title={work.title}
              imageUrl={`/watercolors/${paddedId}/main.jpg`}
              options={purchaseOptions}
              soldOut={work.soldOut}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default WatercolorDetail;

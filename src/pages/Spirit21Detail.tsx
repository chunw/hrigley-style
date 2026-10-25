import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { spiritWorks } from "@/lib/21spirit";
import { studioCardPayLink, PRINT_9X12_PAYLINK } from "@/lib/watercolors";
import { shopOrderNavigableItems } from "@/hooks/useProducts";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ZoomableImage } from "@/components/ZoomableImage";
import { toast } from "sonner";
import { usePageMeta } from "@/hooks/usePageMeta";
import { buildArtworkJsonLd } from "@/lib/seo";
import { catalogMeta } from "@/lib/21spirit";
import ArtworkPurchase, { type ArtworkCartOption } from "@/components/ArtworkPurchase";
import { Badge } from "@/components/ui/badge";

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

  usePageMeta({
    title: work ? work.title : "In the Spirit of the 21st Century",
    description: work?.description ? work.description.replace(/<[^>]*>/g, " ").trim() : catalogMeta.description.replace(/<[^>]*>/g, " ").trim(),
    image: work ? `/21spirit/${paddedId}/main.jpg` : undefined,
    path: `/21spirit/${id ?? ""}`,
    type: "product",
    jsonLd: work
      ? buildArtworkJsonLd({
          title: work.title,
          medium: work.medium ?? catalogMeta.medium,
          year: work.year,
          image: `/21spirit/${paddedId}/main.jpg`,
          description: work.description || catalogMeta.description,
          price: work.price,
        })
      : undefined,
  });

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

  const currentIndex = shopOrderNavigableItems.findIndex(
    (item) => item.type === "spirit" && item.id === work.id
  );
  const prevItem = currentIndex > 0 ? shopOrderNavigableItems[currentIndex - 1] : undefined;
  const nextItem = currentIndex >= 0 && currentIndex < shopOrderNavigableItems.length - 1
    ? shopOrderNavigableItems[currentIndex + 1]
    : undefined;

  // Purchasable options for the cart. The one work with its own paylink has
  // a two-price label ("$4 / $10"): the 4×6" print at the first price and
  // the 9×12" print at the second. Every other work is the 4×6" print only,
  // at the same $4 the studio-card PayPal link charges.
  const priceLabelPrices = work.priceLabel
    ? [...work.priceLabel.matchAll(/\$(\d+(?:\.\d+)?)/g)].map((m) => parseFloat(m[1]))
    : [];
  const purchaseOptions: ArtworkCartOption[] =
    work.paylink && priceLabelPrices.length === 2
      ? [
          { key: "print-4x6", labelEn: '4×6" fine art print', labelZh: "4×6英寸艺术微喷印刷品", price: priceLabelPrices[0] },
          { key: "print-9x12", labelEn: '9×12" fine art print', labelZh: "9×12英寸艺术微喷印刷品", price: priceLabelPrices[1] },
        ]
      : [
          {
            key: "print-4x6",
            labelEn: '4×6" fine art print',
            labelZh: "4×6英寸艺术微喷印刷品",
            price: work.price ?? 4,
          },
        ];

  const title = lang === "zh" && work.titleZh ? work.titleZh : work.title;

  const detailChips: { en: string; zh: string }[] = [{ en: "Fine Art Prints", zh: "版画 · 限量版号" }];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center gap-3 mt-4 mb-10">
          <button
            type="button"
            onClick={() => prevItem && navigate(prevItem.path)}
            disabled={!prevItem}
            className="inline-flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {lang === "zh" ? "上一件" : "Previous"}
          </button>
          <button
            type="button"
            onClick={() => nextItem && navigate(nextItem.path)}
            disabled={!nextItem}
            className="inline-flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 hover:text-foreground transition-colors"
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
                In The Spirit of the 21st Century {paddedId}
              </p>
              <h1 className="shop-title product-title text-4xl leading-none">{title}</h1>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {detailChips.map((chip) => (
                <Link key={chip.en} to={`/?category=${encodeURIComponent(chip.en)}`}>
                  <Badge variant="outline" className="rounded-none font-helvetica text-[11px] uppercase tracking-[0.1em] border-foreground/30 text-muted-foreground hover:border-foreground hover:text-foreground cursor-pointer transition-colors">
                    {lang === "zh" ? chip.zh : chip.en}
                  </Badge>
                </Link>
              ))}
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
              <p>{work.paylink
                ? (lang === "zh" ? "现提供9×12英寸或4×6英寸精细艺术哑光纸印刷品" : `Available as 9×12" or 4×6" fine art matte paper print`)
                : (lang === "zh" ? "现提供4×6英寸精细艺术哑光纸印刷品" : `Available as 4×6" fine art matte paper print`)
              }</p>
            </div>

            <ArtworkPurchase
              baseId={`spirit-${work.id}`}
              title={work.title}
              imageUrl={`/21spirit/${paddedId}/main.jpg`}
              options={purchaseOptions}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Spirit21Detail;

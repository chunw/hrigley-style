import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useProductDetails, useProductImages } from "@/hooks/useProductDetails";
import { shopOrderNavigableItems, getArtboxPrintCount } from "@/hooks/useProducts";
import { getProductCategories, getProductCategoriesZh } from "@/lib/products";
import { ArrowLeft, ArrowRight } from "lucide-react";
import About from "./About";
import { ZoomableImage } from "@/components/ZoomableImage";

const ProductDetails = () => {
  const { t, lang } = useLanguage();
  const zh = lang === "zh";
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [containerHeight, setContainerHeight] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: product, isLoading: productLoading, error: productError } = useProductDetails(id!);
  const { data: images, isLoading: imagesLoading } = useProductImages(id!);

  // Compute allImages before early returns so the useEffect below is never conditional
  const rawImages = (images && images.length > 0)
    ? images
    : product ? [{ image_url: product.image_url, alt_text: product.name || product.title }] : [];
  const allImages = rawImages.filter(img => img && img.image_url);

  // Measure all images and lock container to the tallest one so layout never jumps
  useEffect(() => {
    const urls = allImages.map(img => img.image_url).filter(Boolean);
    if (!urls.length || !containerRef.current) return;
    const containerWidth = containerRef.current.offsetWidth;
    let remaining = urls.length;
    let maxHeight = 0;
    urls.forEach(src => {
      const img = new window.Image();
      img.onload = () => {
        const h = (img.naturalHeight / img.naturalWidth) * containerWidth;
        if (h > maxHeight) maxHeight = h;
        if (--remaining === 0) setContainerHeight(Math.min(maxHeight, 500));
      };
      img.onerror = () => { if (--remaining === 0 && maxHeight > 0) setContainerHeight(maxHeight); };
      img.src = src;
    });
  }, [allImages]);

  if (productLoading || imagesLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-lg text-muted-foreground handwritten">{t.productDetails.loading}</div>
        </div>
      </div>
    );
  }

  if (productError || !product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
      </div>
    );
  }

  const currentImage = allImages[selectedImageIndex] || allImages[0];

  const currentShopIndex = shopOrderNavigableItems.findIndex(
    (item) => item.type === "product" && item.id === id
  );
  const prevItem = currentShopIndex > 0 ? shopOrderNavigableItems[currentShopIndex - 1] : undefined;
  const nextItem = currentShopIndex >= 0 && currentShopIndex < shopOrderNavigableItems.length - 1
    ? shopOrderNavigableItems[currentShopIndex + 1]
    : undefined;

  const formatPrice = (price: number) => `$${price.toLocaleString()}`;

  const handleOrderNow = (e: React.MouseEvent) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'click_paypal_link', {
        'event_category': 'ecommerce',
        'event_label': 'Chun Wang Shop Item - ' + (product.title || product.name),
        'value': 1
      });
    }
    e.stopPropagation();
    window.open(product.paylink, '_blank');
  };

  // Pick the right language field, fall back to English if Chinese not filled in
  const displayTitle = (zh && product.title_zh) ? product.title_zh : (product.title || product.name);
  const englishCategories = getProductCategories(product);
  const displayCategories = zh ? getProductCategoriesZh(product) : englishCategories;
  const displayDescription = (zh && product.description_zh) ? product.description_zh : product.description;
  const displayDetailedHtml = (zh && product.detailed_description_html_zh) ? product.detailed_description_html_zh : product.detailed_description_html;
  const displayEditionInfo = (zh && product.edition_info_zh) ? product.edition_info_zh : product.edition_info;
  const artboxPrintCount = getArtboxPrintCount(product.id);
  const displayDimensions = (zh && (product as any).dimensions_zh) ? (product as any).dimensions_zh : product.dimensions;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-2">
        {(prevItem || nextItem) && (
          <div className="flex items-center gap-3 mt-4 mb-8">
            <span className="font-helvetica text-[10px] uppercase tracking-widest text-muted-foreground/60">
              {lang === "zh" ? (
                <>
                  查看
                  <Link to="/" className="text-pink hover:text-pink/80 transition-colors">
                    商店
                  </Link>
                </>
              ) : (
                <>
                  View in{" "}
                  <Link to="/" className="text-pink hover:text-pink/80 transition-colors">
                    Shop
                  </Link>
                </>
              )}
            </span>
            {prevItem && (
              <button
                type="button"
                onClick={() => navigate(prevItem.path)}
                className="inline-flex items-center gap-2 rounded border border-border bg-background px-3 py-2 text-xs font-helvetica text-muted-foreground hover:border-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                {lang === "zh" ? "上一件" : "Previous"}
              </button>
            )}
            {nextItem && (
              <button
                type="button"
                onClick={() => navigate(nextItem.path)}
                className="inline-flex items-center gap-2 rounded border border-border bg-background px-3 py-2 text-xs font-helvetica text-muted-foreground hover:border-foreground hover:text-foreground transition-colors"
              >
                {lang === "zh" ? "下一件" : "Next"}
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div
              ref={containerRef}
              className="rounded-lg overflow-hidden bg-black border-2 border-primary/20"
              style={containerHeight ? { height: `${containerHeight}px` } : {}}
            >
              <ZoomableImage
                src={currentImage?.image_url || "/placeholder.svg"}
                alt={product.name}
                imgClassName="w-full h-full object-contain block"
                images={allImages.map((img) => img.image_url)}
                startIndex={selectedImageIndex}
                onNavigate={setSelectedImageIndex}
              />
            </div>

            {allImages.length > 1 && (
              <div className="flex gap-2 flex-wrap">
                {allImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`w-24 h-24 flex-shrink-0 overflow-hidden border-2 transition-colors bg-black ${
                      selectedImageIndex === index
                        ? 'border-primary'
                        : 'border-border hover:border-muted-foreground'
                    }`}
                  >
                    <img
                      src={image.image_url || "/placeholder.svg"}
                      alt={`${product.name} view ${index + 1}`}
                      className="w-full h-full object-contain"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            <div>
              <h1 className="shop-title text-3xl md:text-4xl leading-tight mb-2 mt-4">
                {displayTitle}
              </h1>
              {displayCategories.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {displayCategories.map((label, index) => (
                    <Link key={label} to={`/?category=${encodeURIComponent(englishCategories[index] ?? "")}`}>
                      <Badge variant="secondary" className="handwritten text-sm hover:bg-secondary/80 cursor-pointer transition-colors">
                        {label}
                      </Badge>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="text-2xl font-bold text-primary handwritten">
              {formatPrice(product.price)}
            </div>

            {displayDescription && (
              <div className="space-y-2">
                <p className="text-muted-foreground font-helvetica">{displayDescription}</p>
              </div>
            )}

            {artboxPrintCount > 0 && (
              <p className="font-mono text-sm text-muted-foreground">
                {artboxPrintCount} {zh ? "张印刷品" : "prints included"}
              </p>
            )}

            {displayDetailedHtml && (
              <div className="space-y-2">
                <h3 className="handwritten text-base">{t.productDetails.details}</h3>
                <div
                  className="text-muted-foreground font-helvetica whitespace-pre-wrap product-details-html"
                  dangerouslySetInnerHTML={{ __html: displayDetailedHtml }}
                />
              </div>
            )}

            {displayDimensions && (
              <div className="space-y-2">
                <p className="text-muted-foreground font-helvetica">{displayDimensions}</p>
              </div>
            )}

            {displayEditionInfo && (
              <div className="space-y-2">
                <p className="text-muted-foreground font-helvetica">{displayEditionInfo}</p>
              </div>
            )}

            {product.edition_size && (
              <div className="space-y-2">
                <p className="text-muted-foreground font-helvetica">
                  {t.productDetails.limitedEditionPrefix} {product.edition_size}{t.productDetails.limitedEditionSuffix}
                </p>
              </div>
            )}

            {product.paylink && (
              <div className="pt-4">
                <Button
                  variant="outline-pink"
                  size="lg"
                  onClick={product.soldOut ? undefined : handleOrderNow}
                  className={`w-full handwritten text-lg font-bold px-8 py-6 ${product.soldOut ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                  asChild
                >
                  <span>
                    {product.soldOut
                      ? t.productDetails.soldOut
                      : `${t.productDetails.orderNow} - ${formatPrice(product.price)}`}
                  </span>
                </Button>

                <p className="pt-4 w-full text-xs text-muted-foreground font-helvetica">{t.productDetails.shippingIncluded}</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <About />
      <Footer />
    </div>
  );
};

export default ProductDetails;

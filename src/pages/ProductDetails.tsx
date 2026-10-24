import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useProductDetails, useProductImages } from "@/hooks/useProductDetails";
import { shopOrderNavigableItems, getArtboxPrintCount } from "@/hooks/useProducts";
import { getProductCategories, getProductCategoriesZh, getProductCollections, getProductCollectionsZh } from "@/lib/products";
import { ArrowLeft, ArrowRight, ShoppingBag } from "lucide-react";
import { ZoomableImage } from "@/components/ZoomableImage";
import { toast } from "sonner";
import { usePageMeta } from "@/hooks/usePageMeta";
import { useCart } from "@/contexts/CartContext";

const ProductDetails = () => {
  const { t, lang } = useLanguage();
  const zh = lang === "zh";
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: product, isLoading: productLoading, error: productError } = useProductDetails(id!);
  const { data: images, isLoading: imagesLoading } = useProductImages(id!);
  const { addItem } = useCart();

  const rawImages = (images && images.length > 0)
    ? images
    : product ? [{ image_url: product.image_url, alt_text: product.name || product.title }] : [];
  const allImages = rawImages.filter(img => img && img.image_url);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    setSelectedIndex(0);
  }, [id]);

  usePageMeta({
    title: product ? (product.title || product.name) : "Product",
    description: product?.description || product?.detailed_description_html,
    image: product?.image_url,
    path: `/product/${id ?? ""}`,
    type: "product",
    jsonLd: product
      ? {
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.title || product.name,
          description: (product.description || "").replace(/<[^>]*>/g, " ").trim() || undefined,
          image: product.image_url,
          category: getProductCategories(product).join(", ") || undefined,
          offers: {
            "@type": "Offer",
            price: product.price,
            priceCurrency: product.currency ?? "USD",
            availability: product.soldOut ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
          },
        }
      : undefined,
  });

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

  const currentShopIndex = shopOrderNavigableItems.findIndex(
    (item) => item.type === "product" && item.id === id
  );
  const prevItem = currentShopIndex > 0 ? shopOrderNavigableItems[currentShopIndex - 1] : undefined;
  const nextItem = currentShopIndex >= 0 && currentShopIndex < shopOrderNavigableItems.length - 1
    ? shopOrderNavigableItems[currentShopIndex + 1]
    : undefined;

  const formatPrice = (price: number) => `$${price.toLocaleString()}`;

  const INQUIRY_EMAIL = "chunwang.me@gmail.com";

  const handleOrderNow = (e: React.MouseEvent) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'click_paypal_link', {
        'event_category': 'ecommerce',
        'event_label': 'Chun Wang Shop Item - ' + (product.title || product.name),
        'value': 1
      });
    }
    e.stopPropagation();

    if (product.paylink) {
      window.open(product.paylink, '_blank');
      return;
    }

    // Fallback: open mail client and copy contact email to clipboard
    const subject = encodeURIComponent(`Order inquiry: ${product.title || product.name}`);
    const body = encodeURIComponent(`Hello,%0D%0A%0D%0AI would like to order: ${product.title || product.name} (product id: ${product.id}).%0D%0A%0D%0APlease advise the next steps.%0D%0A%0D%0AThanks.`);
    try {
      navigator.clipboard?.writeText(INQUIRY_EMAIL).then(() => {
        toast('Email copied to clipboard', { description: INQUIRY_EMAIL });
      }).catch(() => {
        // ignore clipboard errors
      });
    } catch (err) {
      // ignore
    }
    window.location.href = `mailto:${INQUIRY_EMAIL}?subject=${subject}&body=${body}`;
  };

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      title: product.title || product.name,
      price: product.price,
      currency: product.currency ?? "USD",
      image_url: product.image_url,
    });
    toast(`${product.title || product.name} added to cart`);
  };

  // Pick the right language field, fall back to English if Chinese not filled in
  const displayTitle = (zh && product.title_zh) ? product.title_zh : (product.title || product.name);
  const englishCategories = getProductCategories(product);
  const displayCategories = zh ? getProductCategoriesZh(product) : englishCategories;
  const englishCollections = getProductCollections(product);
  const displayCollections = zh ? getProductCollectionsZh(product) : englishCollections;
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 mb-16 items-start">
          {/* Image Gallery */}
          <div className="flex gap-3 lg:gap-4 items-start">
            {allImages.length > 1 && (
              <div className="flex max-h-[70vh] w-20 shrink-0 flex-col gap-2 overflow-y-auto pr-1">
                {allImages.map((image, index) => (
                  <button
                    key={`${image.image_url}-${index}`}
                    type="button"
                    onClick={() => setSelectedIndex(index)}
                    className={`w-full overflow-hidden border transition-all ${
                      selectedIndex === index
                        ? "border-foreground opacity-100"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={image.image_url || "/placeholder.svg"}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      className="h-20 w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            <div className="flex-1 bg-[#f7f6f3]">
              {allImages.length > 0 ? (
                <ZoomableImage
                  src={allImages[selectedIndex]?.image_url || "/placeholder.svg"}
                  alt={`${product.name} view ${selectedIndex + 1}`}
                  imgClassName="w-full h-auto object-contain block"
                  images={allImages.map((img) => img.image_url)}
                  startIndex={selectedIndex}
                  onNavigate={setSelectedIndex}
                />
              ) : (
                <div className="aspect-[4/5] bg-[#f7f6f3] flex items-center justify-center text-xs uppercase tracking-[0.2em] text-muted-foreground/60">
                  No image
                </div>
              )}
            </div>
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            <div>
              <h1 className="product-title text-3xl md:text-4xl leading-tight mb-2 mt-4 text-foreground">
                {displayTitle}
              </h1>
              {(displayCategories.length > 0 || displayCollections.length > 0) && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {displayCategories.map((label, index) => (
                    <Link key={label} to={`/?category=${encodeURIComponent(englishCategories[index] ?? "")}`}>
                      <Badge variant="outline" className="rounded-none font-helvetica text-[11px] uppercase tracking-[0.1em] border-foreground/30 text-muted-foreground hover:border-foreground hover:text-foreground cursor-pointer transition-colors">
                        {label}
                      </Badge>
                    </Link>
                  ))}
                  {displayCollections.map((label, index) => (
                    <Link key={label} to={`/?category=${encodeURIComponent(englishCollections[index] ?? "")}`}>
                      <Badge variant="outline" className="rounded-none font-helvetica text-[11px] uppercase tracking-[0.1em] border-foreground/30 text-muted-foreground hover:border-foreground hover:text-foreground cursor-pointer transition-colors">
                        {label}
                      </Badge>
                    </Link>
                  ))}
                </div>
              )}

              {englishCollections.includes("Slightly Useful Object") && (
                <p className="text-sm text-muted-foreground font-helvetica mt-3">
                  {t.productDetails.partOfCollectionPrefix}{" "}
                  <Link to="/slightlyusefulobject" className="text-foreground font-semibold">
                    {zh ? "小用之物" : "Slightly Useful Object"}
                  </Link>{" "}
                  {t.productDetails.partOfCollectionSuffix}
                </p>
              )}
            </div>

            <div className="text-xl font-helvetica tracking-wide text-foreground">
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
                <h3 className="font-helvetica text-[11px] uppercase tracking-[0.15em] text-muted-foreground">{t.productDetails.details}</h3>
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

            {!product.soldOut && (
              <div className="pt-4">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleAddToCart}
                  className="w-full rounded-none text-sm px-8 py-6 transition-colors"
                >
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  ADD TO CART
                </Button>
              </div>
            )}

            {(product.paylink || product.is_active) && (
              <div className={product.soldOut ? "pt-4" : "pt-3"}>
                <Button
                  variant="outline-pink"
                  size="lg"
                  onClick={product.soldOut ? undefined : handleOrderNow}
                  className={`order-now-button w-full rounded-none text-sm px-8 py-6 transition-colors ${product.soldOut ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
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

      <Footer />
    </div>
  );
};

export default ProductDetails;

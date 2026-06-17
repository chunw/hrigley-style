import { useState } from "react";
import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useProductDetails, useProductImages } from "@/hooks/useProductDetails";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import About from "./About";
import { ZoomableImage } from "@/components/ZoomableImage";

const ProductDetails = () => {
  const { t, lang } = useLanguage();
  const zh = lang === "zh";
  const { id } = useParams<{ id: string }>();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const { data: product, isLoading: productLoading, error: productError } = useProductDetails(id!);
  const { data: images, isLoading: imagesLoading } = useProductImages(id!);

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

  const rawImages = [
    { image_url: product.image_url, alt_text: product.name || product.title },
    ...(images || [])
  ].filter(img => img && img.image_url);

  const allImages = Array.from(
    new Map(rawImages.map((img) => [img.image_url, img])).values()
  );

  const currentImage = allImages[selectedImageIndex] || allImages[0];

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
  const displayCategory = (zh && product.category_zh) ? product.category_zh : product.category;
  const displayDescription = (zh && product.description_zh) ? product.description_zh : product.description;
  const displayDetailedHtml = (zh && product.detailed_description_html_zh) ? product.detailed_description_html_zh : product.detailed_description_html;
  const displayEditionInfo = (zh && product.edition_info_zh) ? product.edition_info_zh : product.edition_info;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-2">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="rounded-lg overflow-hidden bg-black border-2 border-primary/20">
              <ZoomableImage
                src={currentImage?.image_url || "/placeholder.svg"}
                alt={product.name}
                imgClassName="w-full h-auto block"
                images={allImages.map((img) => img.image_url)}
                startIndex={selectedImageIndex}
                onNavigate={setSelectedImageIndex}
              />
            </div>

            {allImages.length > 1 && (
              <div className="w-full">
                <Carousel className="w-full">
                  <CarouselContent className="-ml-2 md:-ml-4">
                    {allImages.map((image, index) => (
                      <CarouselItem key={index} className="pl-2 md:pl-4 basis-1/4">
                        <button
                          onClick={() => setSelectedImageIndex(index)}
                          className={`w-full aspect-square rounded-lg overflow-hidden border-2 transition-colors bg-black ${
                            selectedImageIndex === index
                              ? 'border-primary'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <img
                            src={image.image_url || "/placeholder.svg"}
                            alt={`${product.name} view ${index + 1}`}
                            className="w-full h-full object-contain"
                          />
                        </button>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-2" />
                  <CarouselNext className="right-2" />
                </Carousel>
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            <div>
              <h1 className="shop-title text-3xl md:text-4xl leading-tight mb-2 mt-4">
                {displayTitle}
              </h1>
              {displayCategory && (
                <Badge variant="secondary" className="handwritten text-sm">
                  {displayCategory}
                </Badge>
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

            {displayDetailedHtml && (
              <div className="space-y-2">
                <h3 className="handwritten text-base">{t.productDetails.details}</h3>
                <div
                  className="text-muted-foreground font-helvetica whitespace-pre-wrap product-details-html"
                  dangerouslySetInnerHTML={{ __html: displayDetailedHtml }}
                />
              </div>
            )}

            {product.dimensions && (
              <div className="space-y-2">
                <p className="text-muted-foreground font-helvetica">{product.dimensions}</p>
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

            <div className="pt-4">
              <Button
                variant="outline-pink"
                size="lg"
                onClick={handleOrderNow}
                className="w-full handwritten text-lg font-bold px-8 py-6"
                asChild
              >
                <span>
                  {t.productDetails.orderNow} - {formatPrice(product.price)}
                </span>
              </Button>

              <p className="pt-4 w-full text-xs text-muted-foreground font-helvetica">{t.productDetails.shippingIncluded}</p>
            </div>
          </div>
        </div>
      </main>

      <About />
      <Footer />
    </div>
  );
};

export default ProductDetails;

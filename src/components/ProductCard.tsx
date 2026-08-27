import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { getProductCategories, getProductCategoriesZh, getProductCollections, getProductCollectionsZh } from "@/lib/products";
import { useImageHoverExpand } from "@/hooks/useImageHoverExpand";

interface ProductCardProps {
  id: string;
  name: string;
  title: string | null;
  title_zh?: string | null;
  description: string | null;
  description_zh?: string | null;
  price: number;
  currency: string;
  image_url: string | null;
  category?: string | null;
  category_zh?: string | null;
  categories?: string[];
  categories_zh?: string[];
  collections?: string[];
  collections_zh?: string[];
  paylink: string;
  detailPath?: string;
  priceLabel?: string;
  hideOrderButton?: boolean;
  hideShippingLabel?: boolean;
  highlightQuery?: string;
  artboxPrintCount?: number;
  soldOut?: boolean;
  is_active?: boolean;
}

const ProductCard = ({ id, name, title, title_zh, description, description_zh, price, priceLabel, currency, image_url, category, category_zh, categories, categories_zh, collections, collections_zh, paylink, detailPath, hideOrderButton, hideShippingLabel, highlightQuery, artboxPrintCount, soldOut, is_active }: ProductCardProps) => {
  const navigate = useNavigate();
  const { t, lang } = useLanguage();
  const { imgRef, imgStyle, hoverHandlers, wrapperHoverClassName } = useImageHoverExpand("contain");

  const zh = lang === "zh";
  const displayTitle = (zh && title_zh) ? title_zh : (title || name);
  const displayDescription = (zh && description_zh) ? description_zh : description;
  const displayCategoryList = zh
    ? getProductCategoriesZh({ category_zh, categories_zh })
    : getProductCategories({ category, categories });
  // Cards without a functional category (e.g. Slightly Useful Object items) fall back
  // to showing their collection instead, so the caption line is never empty.
  const displayCollectionList = zh
    ? getProductCollectionsZh({ id, collections_zh })
    : getProductCollections({ id, collections });
  const displayCategory = displayCategoryList.length > 0
    ? displayCategoryList.join(" · ")
    : (displayCollectionList.length > 0 ? displayCollectionList.join(" · ") : null);

  const renderHighlightedText = (text: string) => {
    if (!highlightQuery?.trim()) {
      return text;
    }

    const escapedQuery = highlightQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const segments = text.split(new RegExp(`(${escapedQuery})`, "gi"));

    return segments.map((segment, index) =>
      segment.toLowerCase() === highlightQuery.toLowerCase() ? (
        <mark key={`${segment}-${index}`} className="bg-primary/20 text-foreground rounded-sm px-0.5">
          {segment}
        </mark>
      ) : (
        <span key={`${segment}-${index}`}>{segment}</span>
      )
    );
  };

  const renderDescription = (text: string) => {
    if (/<[a-z][\s\S]*>/i.test(text)) {
      return (
        <span
          className="description-html"
          onClick={(e) => e.stopPropagation()}
          dangerouslySetInnerHTML={{ __html: text }}
        />
      );
    }
    return renderHighlightedText(text);
  };

  const handleCardClick = () => {
    navigate(detailPath || `/product/${id}`);
  };

  const handleOrderNow = (e: React.MouseEvent) => {
    const INQUIRY_EMAIL = "chunwang.me@gmail.com";

    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'click_paypal_link', {
        'event_category': 'ecommerce',
        'event_label': 'Chun Wang Shop Item - ' + (title || name),
        'value': 1
      });
    }
    e.stopPropagation();
    if (paylink) {
      window.open(paylink, '_blank');
      return;
    }

    // fallback to opening a mailto and copying email
    try {
      navigator.clipboard?.writeText(INQUIRY_EMAIL).then(() => {
        toast('Email copied to clipboard', { description: INQUIRY_EMAIL });
      }).catch(() => {});
    } catch (err) {}

    const subject = encodeURIComponent(`Order inquiry: ${title || name}`);
    const body = encodeURIComponent(`Hello,%0D%0A%0D%0AI would like to order: ${title || name} (id: ${id}).%0D%0A%0D%0APlease advise the next steps.%0D%0A%0D%0AThanks.`);
    window.location.href = `mailto:${INQUIRY_EMAIL}?subject=${subject}&body=${body}`;
  };

  return (
    <Card
      className="group border-0 rounded-none bg-transparent shadow-none cursor-pointer h-full flex flex-col"
      onClick={handleCardClick}
    >
      <CardContent className="p-0 flex flex-col flex-1">
        <div
          className={`relative aspect-square mb-4 sm:mb-6 overflow-hidden shrink-0 bg-background p-3 sm:p-6 flex items-center justify-center ${wrapperHoverClassName}`}
          {...hoverHandlers}
        >
          <img
            ref={imgRef}
            src={image_url || "/placeholder.svg"}
            alt={name}
            className="w-full h-full object-contain"
            style={imgStyle}
            onError={(e) => {
              console.log('Image failed to load:', image_url);
              e.currentTarget.src = "/placeholder.svg";
            }}
            loading="lazy"
          />
          {soldOut && (
            <div className="absolute top-3 left-3 z-10 w-16 h-16 bg-red-600 rounded-full shadow-lg border-2 border-white/80 flex items-center justify-center p-1">
              <span className="font-helvetica text-[10px] uppercase tracking-[0.15em] text-white text-center leading-tight">Sold Out</span>
            </div>
          )}
        </div>

        <div className="flex flex-col flex-1">
          <div className="space-y-2">
            <p className="text-[11px] font-helvetica uppercase tracking-[0.15em] text-muted-foreground">{displayCategory ? renderHighlightedText(displayCategory) : null}</p>
            <h3 className="text-base leading-tight product-title text-foreground">{renderHighlightedText(displayTitle)}</h3>
            {displayDescription && (
              <p className="text-sm font-helvetica text-muted-foreground">{renderDescription(displayDescription)}</p>
            )}
            {artboxPrintCount !== undefined && artboxPrintCount > 0 && (
              <p className="text-xs font-mono text-muted-foreground">{artboxPrintCount} {zh ? "张印刷品" : "prints included"}</p>
            )}
          </div>

          <div className="mt-auto pt-4 space-y-2.5">
            {(priceLabel || price > 0) && (
              <>
                <p className="text-sm font-helvetica tracking-wide text-foreground">
                  {renderHighlightedText(priceLabel ?? `${currency === 'gbp' ? '£' : '$'}${price.toFixed(2)}`)}
                </p>
                {!hideShippingLabel && <p className="text-xs text-muted-foreground font-helvetica">{t.productDetails.shippingIncluded}</p>}
                {!hideOrderButton && (paylink || is_active) && (
                  <Button
                    variant="outline-pink"
                    className="order-now-button w-full rounded-none text-xs transition-colors"
                    size="sm"
                    onClick={handleOrderNow}
                  >
                    {t.productDetails.orderNow}
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;

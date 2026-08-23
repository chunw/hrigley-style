import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { getProductCategories, getProductCategoriesZh, getProductCollections, getProductCollectionsZh } from "@/lib/products";

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
  isSearchHighlighted?: boolean;
  artboxPrintCount?: number;
  soldOut?: boolean;
}

const ProductCard = ({ id, name, title, title_zh, description, description_zh, price, priceLabel, currency, image_url, category, category_zh, categories, categories_zh, collections, collections_zh, paylink, detailPath, hideOrderButton, hideShippingLabel, highlightQuery, isSearchHighlighted, artboxPrintCount, soldOut }: ProductCardProps) => {
  const navigate = useNavigate();
  const { t, lang } = useLanguage();

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
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'click_paypal_link', {
        'event_category': 'ecommerce',
        'event_label': 'Chun Wang Shop Item - ' + (title || name),
        'value': 1
      });
    }
    e.stopPropagation();
    window.open(paylink, '_blank');
  };

  return (
    <Card
      className={`group cartoon-card hover:shadow-lg transition-shadow duration-200 border-2 cursor-pointer h-full flex flex-col ${
        isSearchHighlighted ? "border-primary ring-2 ring-primary/30" : "border-border"
      }`}
      onClick={handleCardClick}
    >
      <CardContent className="p-5 sm:p-6 flex flex-col flex-1">
        <div className="relative aspect-square bg-background mb-5 sm:mb-6 overflow-hidden shrink-0 cartoon-image-wrapper">
          <img
            src={image_url || "/placeholder.svg"}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            onError={(e) => {
              console.log('Image failed to load:', image_url);
              e.currentTarget.src = "/placeholder.svg";
            }}
            loading="lazy"
          />
          {soldOut && (
            <div className="absolute top-3 right-3 w-16 h-16 bg-red-600 rounded-full z-10 shadow-lg border-2 border-white/80 flex items-center justify-center p-1">
              <span className="sans-label text-white text-xs leading-tight text-center">SOLD OUT</span>
            </div>
          )}
        </div>

        <div className="flex flex-col flex-1">
          <div className="space-y-2.5">
            <p className="text-xs sans-label text-muted-foreground">{displayCategory ? renderHighlightedText(displayCategory) : null}</p>
            <h3 className="text-lg leading-tight handwritten product-title">{renderHighlightedText(displayTitle)}</h3>
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
                <p className="text-lg font-bold sans-label text-black">
                  {renderHighlightedText(priceLabel ?? `${currency === 'gbp' ? '£' : '$'}${price.toFixed(2)}`)}
                </p>
                {!hideShippingLabel && <p className="text-xs text-muted-foreground font-helvetica">{t.productDetails.shippingIncluded}</p>}
                {!hideOrderButton && paylink && (
                  <Button
                    variant="outline-pink"
                    className="w-full sans-label bg-pink text-white hover:bg-transparent hover:text-pink"
                    size="sm"
                    onClick={handleOrderNow}
                  >
                    <b>{t.productDetails.orderNow}</b>
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

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

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
  category: string | null;
  category_zh?: string | null;
  paylink: string;
  detailPath?: string;
  hideOrderButton?: boolean;
  hideShippingLabel?: boolean;
  highlightQuery?: string;
  isSearchHighlighted?: boolean;
}

const ProductCard = ({ id, name, title, title_zh, description, description_zh, price, currency, image_url, category, category_zh, paylink, detailPath, hideOrderButton, hideShippingLabel, highlightQuery, isSearchHighlighted }: ProductCardProps) => {
  const navigate = useNavigate();
  const { t, lang } = useLanguage();

  const zh = lang === "zh";
  const displayTitle = (zh && title_zh) ? title_zh : (title || name);
  const displayDescription = (zh && description_zh) ? description_zh : description;
  const displayCategory = (zh && category_zh) ? category_zh : category;

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
      className={`group hover:shadow-lg transition-shadow duration-200 border-2 cursor-pointer h-full flex flex-col ${
        isSearchHighlighted ? "border-primary ring-2 ring-primary/30" : "border-border"
      }`}
      onClick={handleCardClick}
    >
      <CardContent className="p-4 flex flex-col flex-1">
        <div className="aspect-square bg-black mb-4 overflow-hidden shrink-0">
          <img
            src={image_url || "/placeholder.svg"}
            alt={name}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
            onError={(e) => {
              console.log('Image failed to load:', image_url);
              e.currentTarget.src = "/placeholder.svg";
            }}
            loading="lazy"
          />
        </div>

        <div className="flex flex-col flex-1">
          <div className="space-y-2">
            <p className="text-xs handwritten text-muted-foreground">{displayCategory ? renderHighlightedText(displayCategory) : null}</p>
            <h3 className="text-lg leading-tight handwritten">{renderHighlightedText(displayTitle)}</h3>
            {displayDescription && (
              <p className="text-sm font-helvetica text-muted-foreground">{renderHighlightedText(displayDescription)}</p>
            )}
          </div>

          <div className="mt-auto pt-3 space-y-2">
            {price > 0 && (
              <>
                <p className="text-lg font-bold handwritten">
                  {renderHighlightedText(`${currency === 'gbp' ? '£' : '$'}${price.toFixed(2)}`)}
                </p>
                {!hideShippingLabel && <p className="text-xs text-muted-foreground font-helvetica">{t.productDetails.shippingIncluded}</p>}
                {!hideOrderButton && paylink && (
                  <Button
                    variant="outline-pink"
                    className="w-full handwritten"
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

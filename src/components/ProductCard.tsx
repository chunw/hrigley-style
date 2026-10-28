import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { getProductCategories, getProductCategoriesZh, getProductCollections, getProductCollectionsZh } from "@/lib/products";
import { useImageHoverExpand } from "@/hooks/useImageHoverExpand";
import { useCart } from "@/contexts/CartContext";
import { ShoppingBag } from "lucide-react";

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
  secondImageUrl?: string | null;
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

const ProductCard = ({ id, name, title, title_zh, description, description_zh, price, priceLabel, currency, image_url, secondImageUrl, category, category_zh, categories, categories_zh, collections, collections_zh, paylink, detailPath, hideOrderButton, hideShippingLabel, highlightQuery, artboxPrintCount, soldOut, is_active }: ProductCardProps) => {
  const navigate = useNavigate();
  const { t, lang } = useLanguage();
  const { addItem } = useCart();
  const { imgRef, imgStyle, hovered, hoverHandlers, wrapperHoverClassName } = useImageHoverExpand("contain");

  // Preload the second photo (if any) so hovering can flip to it instantly -
  // never shown until confirmed loadable, so a missing "if available" image
  // never flashes a broken-image icon.
  const [secondImageReady, setSecondImageReady] = useState(false);
  useEffect(() => {
    setSecondImageReady(false);
    if (!secondImageUrl) return;
    let cancelled = false;
    const preload = new Image();
    preload.onload = () => { if (!cancelled) setSecondImageReady(true); };
    preload.src = secondImageUrl;
    return () => { cancelled = true; };
  }, [secondImageUrl]);

  const displayImageUrl = (hovered && secondImageReady && secondImageUrl) ? secondImageUrl : image_url;

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

  // Default purchasable option for catalog works, matching the first price
  // shown in priceLabel and the first option on the detail page, so a card
  // add and a detail-page add of the same option share one cart line.
  const cartVariantLabel = (() => {
    const en = lang !== "zh";
    if (id.startsWith("remains-") || id.startsWith("spirit-")) {
      return en ? '4×6" fine art print' : "4×6英寸艺术微喷印刷品";
    }
    if (id.startsWith("photography-")) {
      return en ? '9×12" fine art print' : "9×12英寸艺术微喷印刷品";
    }
    if (id.startsWith("watercolor-")) {
      if (category === "Cards") return en ? "Studio card" : "工作室卡片";
      if (price === 4) return en ? '4×6" fine art print' : "4×6英寸艺术微喷印刷品";
      if (price === 25) return en ? "Framed print" : "装裱印刷品";
      return en ? '9×12" fine art print' : "9×12英寸艺术微喷印刷品";
    }
    return null;
  })();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({
      id,
      name,
      title: title || name,
      price,
      currency,
      image_url,
      variant: cartVariantLabel,
    });
    toast(`${title || name} added to cart`);
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
            src={displayImageUrl || "/placeholder.svg"}
            alt={name}
            className="w-full h-full object-contain"
            style={imgStyle}
            onError={(e) => {
              console.log('Image failed to load:', displayImageUrl);
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
                <p className="text-sm font-helvetica tracking-wide text-foreground product-price">
                  {renderHighlightedText(priceLabel ?? `${currency === 'gbp' ? '£' : '$'}${price.toFixed(2)}`)}
                </p>
                {!hideShippingLabel && <p className="text-xs text-muted-foreground font-helvetica">{t.productDetails.shippingIncluded}</p>}
                {!hideOrderButton && !soldOut && (
                  <Button
                    variant="default"
                    className="w-full rounded-none text-xs transition-colors"
                    size="sm"
                    onClick={handleAddToCart}
                  >
                    <ShoppingBag className="h-3.5 w-3.5 mr-1.5" />
                    ADD TO CART
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

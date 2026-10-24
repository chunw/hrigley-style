import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

export interface ArtworkCartOption {
  key: string;
  labelEn: string;
  labelZh: string;
  price: number;
}

interface ArtworkPurchaseProps {
  // Catalog id of the work, matching the id used by the shop grid cards
  // (e.g. "watercolor-1", "remains-2"), so adding the default option from a
  // detail page and from a grid card lands on the same cart line.
  baseId: string;
  title: string;
  imageUrl: string | null;
  options: ArtworkCartOption[];
  soldOut?: boolean;
}

// Purchase block for artwork detail pages: option selector (when a work has
// more than one purchasable option), Add to Cart for the selected option,
// Checkout is cart-only (owner decision, Oct 2026): no single-item Buy Now links.
const ArtworkPurchase = ({ baseId, title, imageUrl, options, soldOut }: ArtworkPurchaseProps) => {
  const { t, lang } = useLanguage();
  const { addItem } = useCart();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const zh = lang === "zh";

  const selected = options[selectedIndex] ?? options[0];
  if (!selected) return null;

  const optionLabel = (option: ArtworkCartOption) => (zh ? option.labelZh : option.labelEn);

  const handleAddToCart = () => {
    addItem({
      // The default (first) option keeps the plain catalog id so it merges
      // with the same item added from a grid card; other options get a
      // suffixed id and stay separate cart lines.
      id: selectedIndex === 0 ? baseId : `${baseId}-${selected.key}`,
      name: title,
      title,
      price: selected.price,
      currency: "USD",
      image_url: imageUrl,
      variant: optionLabel(selected),
    });
    toast(zh ? "已加入购物车" : "Added to cart", {
      description: `${title} · ${optionLabel(selected)} · $${selected.price}`,
    });
  };

  return (
    <div className="border-t border-border pt-8 space-y-4">
      {options.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {options.map((option, i) => (
            <button
              key={option.key}
              type="button"
              onClick={() => setSelectedIndex(i)}
              className={`sans-label px-4 py-2 text-sm border transition-colors ${
                i === selectedIndex
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-transparent text-foreground border-border hover:border-primary"
              }`}
            >
              {optionLabel(option)} · ${option.price}
            </button>
          ))}
        </div>
      )}

      <p className="sans-label text-2xl font-bold">${selected.price}</p>

      <button
        onClick={soldOut ? undefined : handleAddToCart}
        disabled={soldOut}
        className={`sans-label gloria-button-label inline-block w-full bg-primary text-primary-foreground px-8 py-3 text-lg font-bold hover:bg-primary/90 transition-colors text-center ${soldOut ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      >
        {soldOut ? t.productDetails.soldOut : zh ? "加入购物车" : "Add to Cart"}
      </button>

      <p className="text-xs text-muted-foreground font-mono">
        {t.watercolor.shippingIncluded}
      </p>
    </div>
  );
};

export default ArtworkPurchase;

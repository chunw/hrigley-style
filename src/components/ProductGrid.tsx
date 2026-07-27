import { useEffect, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import ProductCard from "./ProductCard";
import { useProducts, getArtboxPrintCount } from "@/hooks/useProducts";
import { getProductCategories, getProductCategoriesZh } from "@/lib/products";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";


interface ProductGridProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onMatchCountChange?: (count: number) => void;
  matchedCount?: number;
  hideOrderButton?: boolean;
  hideShippingLabel?: boolean;
}

const ProductGrid = ({ searchQuery, onSearchChange, onMatchCountChange, matchedCount = 0, hideOrderButton, hideShippingLabel }: ProductGridProps) => {
  const { t, lang } = useLanguage();
  const zh = lang === "zh";
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState(() => searchParams.get("category") ?? "ALL");
  const [showAllItems, setShowAllItems] = useState(false);
  const [showHiddenOnly, setShowHiddenOnly] = useState(false);
  const { data: products, isLoading, error } = useProducts(showAllItems || showHiddenOnly);
  const firstMatchedCardRef = useRef<HTMLDivElement | null>(null);
  const normalizedSearchQuery = searchQuery?.trim() || "";
  const hasActiveSearch = normalizedSearchQuery.length > 0;

  // Unique categories (keyed by English value, displayed in current language).
  // A product can belong to multiple categories, so membership is an "includes" check.
  const visibleProducts = products?.filter((product) =>
    showHiddenOnly ? product.showInStorefront === false : (showAllItems || product.showInStorefront !== false)
  );
  const categories = ["ALL", ...Array.from(new Set(visibleProducts?.flatMap(p => getProductCategories(p)) || []))];
  const categoryCount = (cat: string) => {
    if (cat === "ALL") return visibleProducts?.length ?? 0;
    return visibleProducts?.filter(p => getProductCategories(p).includes(cat)).length ?? 0;
  };
  const categoryLabel = (cat: string) => {
    const count = categoryCount(cat);
    const label = (() => {
      if (cat === "ALL") return t.productGrid.categoryAll;
      if (zh) {
        for (const product of visibleProducts || []) {
          const index = getProductCategories(product).indexOf(cat);
          if (index !== -1) return getProductCategoriesZh(product)[index] || cat;
        }
        return cat;
      }
      return cat;
    })();
    return <>{label} <span className="font-helvetica">({count})</span></>;
  };

  const buildProductSearchText = (product: Record<string, unknown>) => {
    return Object.values(product)
      .filter((value) => typeof value === "string" || typeof value === "number")
      .map((value) => String(value).toLowerCase())
      .join(" ");
  };

  const filteredProducts = visibleProducts?.filter(product => {
    const categoryMatch = selectedCategory === "ALL" || getProductCategories(product).includes(selectedCategory);
    const searchText = buildProductSearchText(product as Record<string, unknown>);
    const searchMatch = !normalizedSearchQuery || searchText.includes(normalizedSearchQuery.toLowerCase());
    return categoryMatch && searchMatch;
  });

  const sortedFilteredProducts = useMemo(
    () => [...(filteredProducts || [])],
    [filteredProducts]
  );

  useEffect(() => {
    onMatchCountChange?.(hasActiveSearch ? sortedFilteredProducts.length : 0);
  }, [hasActiveSearch, sortedFilteredProducts.length, onMatchCountChange]);

  useEffect(() => {
    if (!hasActiveSearch || sortedFilteredProducts.length === 0) {
      return;
    }

    firstMatchedCardRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, [hasActiveSearch, sortedFilteredProducts.length, normalizedSearchQuery]);

  if (isLoading) {
    return (
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="handwritten text-lg">{t.productGrid.loading}</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="handwritten text-lg text-destructive">{t.productGrid.error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="shop" className="bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder={t.productGrid.searchPlaceholder}
              value={searchQuery || ""}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="pl-10 handwritten text-sm bg-muted/50 border-border"
            />
          </div>
          {hasActiveSearch && (
            <p className="mt-2 font-helvetica text-xs text-muted-foreground text-left">
              {matchedCount} {matchedCount === 1 ? t.productGrid.matchedProduct : t.productGrid.matchedProducts}
            </p>
          )}
        </div>

        {/* Category Filter */}
        <div className="mb-12">
          <div className="flex flex-wrap gap-4 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`handwritten text-sm px-4 py-2 border-2 transition-colors ${
                  selectedCategory === category
                    ? "border-primary text-primary bg-primary/10"
                    : "border-border hover:border-primary hover:text-primary"
                }`}
              >
                {categoryLabel(category)}
              </button>
            ))}
          </div>

          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={() => {
                setShowAllItems((prev) => !prev);
                setShowHiddenOnly(false);
              }}
              className={`handwritten text-sm px-4 py-2 border-2 transition-colors ${
                showAllItems
                  ? "border-primary text-primary bg-primary/10"
                  : "border-border hover:border-primary hover:text-primary"
              }`}
            >
              {t.productGrid.showAllItems}
            </button>
            <button
              onClick={() => {
                setShowHiddenOnly((prev) => !prev);
                setShowAllItems(false);
              }}
              className={`handwritten text-sm px-4 py-2 border-2 transition-colors ${
                showHiddenOnly
                  ? "border-primary text-primary bg-primary/10"
                  : "border-border hover:border-primary hover:text-primary"
              }`}
            >
              {t.productGrid.showHiddenOnly}
            </button>
          </div>
        </div>

        {/* Products Grid */}
        {hasActiveSearch && sortedFilteredProducts.length === 0 ? (
          <div className="rounded-lg border-2 border-destructive/40 bg-destructive/5 px-6 py-10 text-center">
            <p className="handwritten text-lg text-destructive">{t.productGrid.noResults}</p>
            <p className="font-helvetica text-sm text-muted-foreground mt-2">
              {t.productGrid.noResultsDetail} "{normalizedSearchQuery}".
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6 grid-rows-[auto]" style={{ gridAutoRows: '1fr' }}>
            {sortedFilteredProducts.map((product, index) => (
              <div key={product.id} ref={index === 0 && hasActiveSearch ? firstMatchedCardRef : null} className="h-full">
                <ProductCard
                  {...product}
                  highlightQuery={normalizedSearchQuery}
                  isSearchHighlighted={hasActiveSearch}
                  hideOrderButton={hideOrderButton}
                  hideShippingLabel={hideShippingLabel}
                  artboxPrintCount={getArtboxPrintCount(product.id)}
                />
              </div>
            ))}
            {/* <Link to="/watercolor-catalog" className="block">
              <Card className="group hover:shadow-lg transition-shadow duration-200 border-2 border-border cursor-pointer h-full">
                <CardContent className="p-4">
                  <div className="aspect-square bg-black mb-4 overflow-hidden">
                    <img
                      src="/watercolors/01/main.jpg"
                      alt="Visions in Watercolor"
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs handwritten text-muted-foreground">Original Works</p>
                    <h3 className="text-lg leading-tight handwritten">Visions in Watercolor</h3>
                    <p className="text-sm font-helvetica text-muted-foreground line-clamp-2">Original watercolor paintings — browse the full collection</p>
                    <Button variant="outline-pink" className="w-full handwritten" size="sm">
                      <b>View Collection →</b>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link> */}
          </div>
        )}

      </div>
    </section>
  );
};

export default ProductGrid;
import { useEffect, useMemo, useRef, useState } from "react";
import { Search, SlidersHorizontal, ChevronDown } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "./ProductCard";
import { useProducts, getArtboxPrintCount } from "@/hooks/useProducts";
import { getProductCategories, getProductCategoriesZh } from "@/lib/products";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";


interface ProductGridProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onMatchCountChange?: (count: number) => void;
  matchedCount?: number;
  hideOrderButton?: boolean;
  hideShippingLabel?: boolean;
  filterMode?: "default" | "all" | "hidden";
}

const ProductGrid = ({ searchQuery, onSearchChange, onMatchCountChange, matchedCount = 0, hideOrderButton, hideShippingLabel, filterMode = "default" }: ProductGridProps) => {
  const { t, lang } = useLanguage();
  const zh = lang === "zh";
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState(() => searchParams.get("category") ?? "ALL");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const { data: products, isLoading, error } = useProducts(true);
  const firstMatchedCardRef = useRef<HTMLDivElement | null>(null);
  const normalizedSearchQuery = searchQuery?.trim() || "";
  const hasActiveSearch = normalizedSearchQuery.length > 0;

  // Unique categories (keyed by English value, displayed in current language).
  // A product can belong to multiple categories, so membership is an "includes" check.
  const visibleProducts = products?.filter((product) =>
    filterMode === "hidden" ? product.showInStorefront === false : (filterMode === "all" || product.showInStorefront !== false)
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
        <div className="max-w-xl mx-auto pt-8 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              aria-label={t.productGrid.searchPlaceholder}
              value={searchQuery || ""}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="pl-10 sans-label text-sm bg-muted/50 border-border transition-all duration-300 ease-out focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-primary/50 focus-visible:bg-background focus-visible:shadow-[0_8px_24px_-8px_hsl(var(--primary)/0.4)]"
            />
          </div>
          {hasActiveSearch && (
            <p className="mt-2 font-helvetica text-xs text-muted-foreground text-left">
              {matchedCount} {matchedCount === 1 ? t.productGrid.matchedProduct : t.productGrid.matchedProducts}
            </p>
          )}
        </div>

        <div className="lg:flex lg:items-start lg:gap-10 pb-16">
          {/* Filters — left sidebar on desktop, collapsible panel on mobile */}
          <aside className="mb-6 lg:mb-0 lg:w-56 lg:shrink-0 lg:sticky lg:top-24">
            <button
              type="button"
              onClick={() => setFiltersOpen((prev) => !prev)}
              className="sans-label flex w-full items-center justify-between gap-2 border border-border px-4 py-3 text-sm uppercase tracking-widest lg:hidden"
            >
              <span className="inline-flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                {t.productGrid.filters}
              </span>
              <ChevronDown className={`h-4 w-4 transition-transform ${filtersOpen ? "rotate-180" : ""}`} />
            </button>

            <div className={`${filtersOpen ? "block" : "hidden"} lg:block mt-4 lg:mt-0`}>
              <nav className="flex flex-col items-start gap-3">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`gloria-title text-sm pb-1 border-b-2 lg:border-b-0 lg:border-l-2 lg:pl-3 transition-colors ${
                      selectedCategory === category
                        ? "border-primary text-primary"
                        : "border-transparent text-foreground hover:border-primary hover:text-primary"
                    }`}
                  >
                    {categoryLabel(category)}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1 min-w-0">
            {hasActiveSearch && sortedFilteredProducts.length === 0 ? (
              <div className="rounded-lg border-2 border-destructive/40 bg-destructive/5 px-6 py-10 text-center">
                <p className="handwritten text-lg text-destructive">{t.productGrid.noResults}</p>
                <p className="font-helvetica text-sm text-muted-foreground mt-2">
                  {t.productGrid.noResultsDetail} "{normalizedSearchQuery}".
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-auto">
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
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
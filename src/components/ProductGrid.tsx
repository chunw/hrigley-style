import { useEffect, useMemo, useRef, useState } from "react";
import { Search, SlidersHorizontal, ChevronDown } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ProductCard from "./ProductCard";
import { useProducts, getArtboxPrintCount } from "@/hooks/useProducts";
import { getProductCategories, getProductCategoriesZh, getProductCollections, getProductCollectionsZh } from "@/lib/products";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";


// Fixed display order for the Collections sidebar section — deliberately curated
// rather than derived from product array order. Anything not listed here falls in
// after these, in whatever order it's first encountered.
const COLLECTION_ORDER = ["Slightly Useful Object", "Remains"];

interface ProductGridProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onMatchCountChange?: (count: number) => void;
  matchedCount?: number;
  hideOrderButton?: boolean;
  hideShippingLabel?: boolean;
  filterMode?: "default" | "all" | "hidden";
  /** Restrict this grid to a single category (e.g. a dedicated series page) and hide the category filter sidebar. */
  lockedCategory?: string;
}

const ProductGrid = ({ searchQuery, onSearchChange, onMatchCountChange, matchedCount = 0, hideOrderButton, hideShippingLabel, filterMode = "default", lockedCategory }: ProductGridProps) => {
  const { t, lang } = useLanguage();
  const zh = lang === "zh";
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(() => lockedCategory ?? searchParams.get("category") ?? "ALL");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const { data: products, isLoading, error } = useProducts(true);
  const firstMatchedCardRef = useRef<HTMLDivElement | null>(null);
  const gridTopRef = useRef<HTMLDivElement | null>(null);

  const handleFilterSelect = (value: string) => {
    setSelectedCategory(value);
    gridTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const normalizedSearchQuery = searchQuery?.trim() || "";
  const hasActiveSearch = normalizedSearchQuery.length > 0;

  // A product's filter tags are its categories (functional type, e.g. "Accessories")
  // plus its collections (named series, e.g. "21 Spirit"). Both are "includes" checks
  // since a product can belong to several of either, and they share one selection state
  // since their label strings live in separate namespaces.
  const visibleProducts = products?.filter((product) => {
    const storefrontMatch = filterMode === "hidden" ? product.showInStorefront === false : (filterMode === "all" || product.showInStorefront !== false);
    const lockedCategoryMatch = !lockedCategory || getProductCategories(product).includes(lockedCategory) || getProductCollections(product).includes(lockedCategory);
    return storefrontMatch && lockedCategoryMatch;
  });
  const categories = ["ALL", ...Array.from(new Set(visibleProducts?.flatMap(p => getProductCategories(p)) || []))];
  const collections = Array.from(new Set(visibleProducts?.flatMap(p => getProductCollections(p)) || [])).sort((a, b) => {
    const indexA = COLLECTION_ORDER.indexOf(a);
    const indexB = COLLECTION_ORDER.indexOf(b);
    if (indexA === -1 && indexB === -1) return 0;
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });
  const tagCount = (tag: string, getTags: (p: typeof visibleProducts[number]) => string[]) => {
    if (tag === "ALL") return visibleProducts?.length ?? 0;
    return visibleProducts?.filter(p => getTags(p).includes(tag)).length ?? 0;
  };
  const tagLabel = (
    tag: string,
    getTags: (p: typeof visibleProducts[number]) => string[],
    getTagsZh: (p: typeof visibleProducts[number]) => string[],
    count: number,
  ) => {
    const label = (() => {
      if (tag === "ALL") return t.productGrid.categoryAll;
      if (zh) {
        for (const product of visibleProducts || []) {
          const index = getTags(product).indexOf(tag);
          if (index !== -1) return getTagsZh(product)[index] || tag;
        }
        return tag;
      }
      return tag;
    })();
    return <>{label} <span className="font-helvetica">({count})</span></>;
  };
  const categoryLabel = (cat: string) => tagLabel(cat, getProductCategories, getProductCategoriesZh, tagCount(cat, getProductCategories));
  const collectionLabel = (col: string) => tagLabel(col, getProductCollections, getProductCollectionsZh, tagCount(col, getProductCollections));

  const buildProductSearchText = (product: Record<string, unknown>) => {
    return Object.values(product)
      .filter((value) => typeof value === "string" || typeof value === "number")
      .map((value) => String(value).toLowerCase())
      .join(" ");
  };

  const filteredProducts = visibleProducts?.filter(product => {
    const categoryMatch = selectedCategory === "ALL" || getProductCategories(product).includes(selectedCategory) || getProductCollections(product).includes(selectedCategory);
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
      <div className={`max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 ${lockedCategory ? "xl:px-24" : ""}`}>
        <div ref={gridTopRef} className="max-w-xl mx-auto pt-16 mb-16">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              aria-label={t.productGrid.searchPlaceholder}
              value={searchQuery || ""}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="pl-10 rounded-none font-helvetica text-sm bg-transparent border-x-0 border-t-0 border-b border-border transition-colors duration-300 ease-out focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-foreground"
            />
          </div>
          {hasActiveSearch && (
            <p className="mt-2 font-helvetica text-xs text-muted-foreground text-left">
              {matchedCount} {matchedCount === 1 ? t.productGrid.matchedProduct : t.productGrid.matchedProducts}
            </p>
          )}
        </div>

        <div className="lg:flex lg:items-start lg:gap-14 pb-20 lg:pb-28">
          {/* Filters — left sidebar on desktop, collapsible panel on mobile */}
          {!lockedCategory && (
            <aside className="mb-6 lg:mb-0 lg:w-56 lg:shrink-0 lg:sticky lg:top-24">
              <button
                type="button"
                onClick={() => setFiltersOpen((prev) => !prev)}
                className="font-helvetica flex w-full items-center justify-between gap-2 border border-border px-4 py-3 text-xs uppercase tracking-[0.15em] lg:hidden"
              >
                <span className="inline-flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  {t.productGrid.filters}
                </span>
                <ChevronDown className={`h-4 w-4 transition-transform ${filtersOpen ? "rotate-180" : ""}`} />
              </button>

              <div className={`${filtersOpen ? "block" : "hidden"} lg:block mt-4 lg:mt-0 space-y-8`}>
                <nav className="flex flex-col items-start gap-3">
                  {collections.length > 0 && (
                    <p className="font-helvetica text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
                      {t.productGrid.categoryHeading}
                    </p>
                  )}
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => handleFilterSelect(category)}
                      className={`category-label text-sm pb-1 border-b lg:border-b-0 lg:border-l lg:pl-3 transition-colors ${
                        selectedCategory === category
                          ? "border-foreground text-foreground"
                          : "border-transparent text-muted-foreground hover:border-foreground hover:text-foreground"
                      }`}
                    >
                      {categoryLabel(category)}
                    </button>
                  ))}
                </nav>

                {collections.length > 0 && (
                  <nav className="flex flex-col items-start gap-3">
                    <p className="font-helvetica text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
                      {t.productGrid.collectionsHeading}
                    </p>
                    {collections.map((collection) => (
                      <button
                        key={collection}
                        onClick={() =>
                          collection === "Slightly Useful Object"
                            ? navigate("/slightlyusefulobject")
                            : handleFilterSelect(collection)
                        }
                        className={`category-label text-sm pb-1 border-b lg:border-b-0 lg:border-l lg:pl-3 transition-colors ${
                          selectedCategory === collection
                            ? "border-foreground text-foreground"
                            : "border-transparent text-muted-foreground hover:border-foreground hover:text-foreground"
                        }`}
                      >
                        {collectionLabel(collection)}
                      </button>
                    ))}
                  </nav>
                )}
              </div>
            </aside>
          )}

          {/* Products Grid */}
          <div className="flex-1 min-w-0">
            {hasActiveSearch && sortedFilteredProducts.length === 0 ? (
              <div className="border border-destructive/40 bg-destructive/5 px-6 py-10 text-center">
                <p className="font-helvetica text-lg text-destructive">{t.productGrid.noResults}</p>
                <p className="font-helvetica text-sm text-muted-foreground mt-2">
                  {t.productGrid.noResultsDetail} "{normalizedSearchQuery}".
                </p>
              </div>
            ) : (
              <div className={`grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 sm:gap-x-10 sm:gap-y-16 lg:gap-x-12 lg:gap-y-20 auto-rows-auto ${lockedCategory ? "lg:grid-cols-3 xl:grid-cols-3" : "lg:grid-cols-2 xl:grid-cols-3"}`}>
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
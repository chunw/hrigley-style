import { useEffect, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";
import { useProducts } from "@/hooks/useProducts";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";


interface ProductGridProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onMatchCountChange?: (count: number) => void;
  matchedCount?: number;
}

const ProductGrid = ({ searchQuery, onSearchChange, onMatchCountChange, matchedCount = 0 }: ProductGridProps) => {
  const { t, lang } = useLanguage();
  const zh = lang === "zh";
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const { data: products, isLoading, error } = useProducts();
  const firstMatchedCardRef = useRef<HTMLDivElement | null>(null);
  const normalizedSearchQuery = searchQuery?.trim() || "";
  const hasActiveSearch = normalizedSearchQuery.length > 0;

  // Unique categories (keyed by English value, displayed in current language)
  const visibleProducts = products?.filter((product) => product.showInStorefront !== false);
  const categories = ["ALL", ...Array.from(new Set(visibleProducts?.map(p => p.category) || []))];
  const categoryLabel = (cat: string) => {
    if (cat === "ALL") return t.productGrid.categoryAll;
    if (zh) {
      const match = visibleProducts?.find(p => p.category === cat);
      return (match?.category_zh) || cat;
    }
    return cat;
  };

  const buildProductSearchText = (product: Record<string, unknown>) => {
    return Object.values(product)
      .filter((value) => typeof value === "string" || typeof value === "number")
      .map((value) => String(value).toLowerCase())
      .join(" ");
  };

  const filteredProducts = visibleProducts?.filter(product => {
    const categoryMatch = selectedCategory === "ALL" || product.category === selectedCategory;
    const searchText = buildProductSearchText(product as Record<string, unknown>);
    const searchMatch = !normalizedSearchQuery || searchText.includes(normalizedSearchQuery.toLowerCase());
    return categoryMatch && searchMatch;
  });

  const sortedFilteredProducts = useMemo(
    () => [...(filteredProducts || [])].sort((a, b) => ((a as any).displayOrder ?? 0) - ((b as any).displayOrder ?? 0)),
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
    <section className="bg-background">
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
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedFilteredProducts.map((product, index) => (
              <div key={product.id} ref={index === 0 && hasActiveSearch ? firstMatchedCardRef : null}>
                <ProductCard
                  {...product}
                  highlightQuery={normalizedSearchQuery}
                  isSearchHighlighted={hasActiveSearch}
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
import { useEffect, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";
import ProductCard from "./ProductCard";
import { useProducts } from "@/hooks/useProducts";
import { Input } from "@/components/ui/input";


interface ProductGridProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onMatchCountChange?: (count: number) => void;
  matchedCount?: number;
}

const ProductGrid = ({ searchQuery, onSearchChange, onMatchCountChange, matchedCount = 0 }: ProductGridProps) => {
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const { data: products, isLoading, error } = useProducts();
  const firstMatchedCardRef = useRef<HTMLDivElement | null>(null);
  const normalizedSearchQuery = searchQuery?.trim() || "";
  const hasActiveSearch = normalizedSearchQuery.length > 0;

  const categories = ["ALL", ...(products?.map(p => p.category) || [])];

  const buildProductSearchText = (product: Record<string, unknown>) => {
    return Object.values(product)
      .filter((value) => typeof value === "string" || typeof value === "number")
      .map((value) => String(value).toLowerCase())
      .join(" ");
  };

  const filteredProducts = products?.filter(product => {
    const categoryMatch = selectedCategory === "ALL" || product.category === selectedCategory;
    const searchText = buildProductSearchText(product as Record<string, unknown>);
    const searchMatch = !normalizedSearchQuery || searchText.includes(normalizedSearchQuery.toLowerCase());
    return categoryMatch && searchMatch;
  });

  const sortedFilteredProducts = useMemo(
    () => [...(filteredProducts || [])].sort((a, b) => ((a as any).display_order || 0) - ((b as any).display_order || 0)),
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
            <p className="handwritten text-lg">LOADING REALLY GOOD STUFF...</p>
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
            <p className="handwritten text-lg text-destructive">SOMETHING WENT WRONG</p>
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
              placeholder="SEARCH"
              value={searchQuery || ""}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="pl-10 handwritten text-sm bg-muted/50 border-border"
            />
          </div>
          {hasActiveSearch && (
            <p className="mt-2 font-helvetica text-xs text-muted-foreground text-left">
              {matchedCount} {matchedCount === 1 ? "matched product" : "matched products"}
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
                {category}
              </button>
            ))}
          </div>

        </div>

        {/* Products Grid */}
        {hasActiveSearch && sortedFilteredProducts.length === 0 ? (
          <div className="rounded-lg border-2 border-destructive/40 bg-destructive/5 px-6 py-10 text-center">
            <p className="handwritten text-lg text-destructive">NO RESULTS FOUND</p>
            <p className="font-helvetica text-sm text-muted-foreground mt-2">
              We couldn't find anything for "{normalizedSearchQuery}".
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
          </div>
        )}

        {/* Load More */}
        {/* <div className="text-center mt-12">
          <button className="handwritten text-sm px-8 py-3 border-2 border-border hover:border-primary hover:text-primary transition-colors">
            LOAD MORE REALLY GOOD STUFF
          </button>
        </div> */}
      </div>
    </section>
  );
};

export default ProductGrid;
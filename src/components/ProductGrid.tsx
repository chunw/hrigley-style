import { useState } from "react";
import ProductCard from "./ProductCard";
import { useProducts } from "@/hooks/useProducts";

const categories = ["ALL", "UNIQUE WORKS", "PRINTED MATTER", "LIMITED EDITIONS", "HOMEWARES", "ACCESSORIES"];

const ProductGrid = ({ searchQuery }: { searchQuery?: string }) => {
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const { data: products, isLoading, error } = useProducts();

  const filteredProducts = products?.filter(product => {
    const categoryMatch = selectedCategory === "ALL" || product.category === selectedCategory;
    const searchMatch = !searchQuery || product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return categoryMatch && searchMatch;
  });

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
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts?.sort((a, b) => ((a as any).display_order || 0) - ((b as any).display_order || 0))?.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>

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
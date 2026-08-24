import { useState } from "react";
import Header from "@/components/Header";
import ProductGrid from "@/components/ProductGrid";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePageMeta } from "@/hooks/usePageMeta";

const AllItems = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [matchedCount, setMatchedCount] = useState(0);

  usePageMeta({
    title: "Shop All — Handmade Jewelry, Home Decor & Fine Art Prints",
    description: "Every handmade gift and one-of-a-kind object in the Chun Wang Studio Shop — handmade jewelry, sculptural home decor, original paintings, fine art prints, and more.",
    path: "/all-items",
  });

  return (
    <div className="relative min-h-screen bg-background">
      <Header />
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <h1 className="shop-title text-3xl md:text-4xl leading-none">{t.productGrid.showAllItems}</h1>
      </section>
      <ProductGrid
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onMatchCountChange={setMatchedCount}
        matchedCount={matchedCount}
        hideOrderButton
        hideShippingLabel
        filterMode="all"
      />
      <Footer />
    </div>
  );
};

export default AllItems;

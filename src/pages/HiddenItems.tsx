import { useState } from "react";
import Header from "@/components/Header";
import ProductGrid from "@/components/ProductGrid";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePageMeta } from "@/hooks/usePageMeta";

const HiddenItems = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [matchedCount, setMatchedCount] = useState(0);

  usePageMeta({
    title: "Hidden Items",
    description: "Unlisted items.",
    path: "/hidden-items",
    noindex: true,
  });

  return (
    <div className="relative min-h-screen bg-background">
      <Header />
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <h1 className="shop-title text-3xl md:text-4xl leading-none">{t.productGrid.showHiddenOnly}</h1>
      </section>
      <ProductGrid
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onMatchCountChange={setMatchedCount}
        matchedCount={matchedCount}
        hideOrderButton
        hideShippingLabel
        filterMode="hidden"
      />
      <Footer />
    </div>
  );
};

export default HiddenItems;

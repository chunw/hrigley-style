import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ProductGrid from "@/components/ProductGrid";
import Footer from "@/components/Footer";
import { SITE_URL, SHOP_URL, INSTAGRAM_URL } from "@/lib/constants";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePageMeta } from "@/hooks/usePageMeta";
import handsBg from "@/assets/hands_clay_objects_clean_skin.jpg";

const Index = () => {
  const { lang, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [matchedCount, setMatchedCount] = useState(0);
  const location = useLocation();

  usePageMeta({
    title: "Handmade Jewelry, Home Decor & Fine Art Prints",
    description: "Whimsical, one-of-a-kind home decor and handmade jewelry by artist Chun Wang — sculptural planters, clay pendants and charms, original paintings, fine art prints, and wall art for the home.",
    path: "/",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "OnlineStore",
      name: "Chun Wang Studio Shop",
      url: SHOP_URL,
      description: "Handmade, one-of-a-kind home decor and jewelry — sculptural planters, clay pendants and charms, original paintings, fine art prints, and photography by artist Chun Wang.",
      founder: { "@type": "Person", name: "Chun Wang", url: SITE_URL },
      sameAs: [INSTAGRAM_URL, SITE_URL],
    },
  });

  // The initial page load's native scroll-to-hash happens before the SPA finishes
  // rendering #products, so deep links like /#products need a manual scroll on mount.
  useEffect(() => {
    if (location.hash !== "#products") return;
    document.getElementById("products")?.scrollIntoView();
  }, [location.hash]);

  return (
    <div className="relative min-h-screen bg-background">
      
      <Header />

      <HeroSection bgImageSrc={handsBg} showMessageCard hideAboutLink hideDescription />

      <section id="products">
        <ProductGrid
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onMatchCountChange={setMatchedCount}
          matchedCount={matchedCount}
          hideOrderButton
          hideShippingLabel
        />
      </section>

      <Footer />
    </div>
  );
};

export default Index;
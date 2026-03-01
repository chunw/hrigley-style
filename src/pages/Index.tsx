import { useState } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ProductGrid from "@/components/ProductGrid";
import Footer from "@/components/Footer";
import { SITE_URL } from "@/lib/constants";
import { Analytics } from "@vercel/analytics/next";
import About from "./About";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [matchedCount, setMatchedCount] = useState(0);

  return (
    <div className="min-h-screen bg-background">
      
      <Header />
      <HeroSection />
      <ProductGrid
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onMatchCountChange={setMatchedCount}
        matchedCount={matchedCount}
      /> 

      <section className=" relative bg-background py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left - Text Content */}
            <div className="space-y-8">
              <div className="space-y-1 lg:space-y-4"> 
                <h1 className=" shop-title text-4xl md:text-6xl lg:text-7xl leading-none">
                 Chun Wang <br />Studio<br />
                  <span className="text-primary">SHOP</span>
                </h1>
                <p className="hidden lg:block text-muted-foreground max-w-md handwritten">
                
                  Unique works for the imaginative collectors
                </p>
               
                <div className="lg:hidden flex items-start gap-4">
                  <div className="text-muted-foreground max-w-md handwritten flex-1">
                    <p>Unique works for the imaginative collectors</p>
                  
                  </div>
                  <a
                    href={SITE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-lg overflow-hidden shrink-0 w-40 h-40"
                  >
                    <img
                      src="https://cdn.myportfolio.com/28e70582c8bd2069899fb42e60980ce2/bcfb5ed3-e3df-489e-ba87-518d4adccdd0_rw_1200.png?h=3e84d177c91ced5bbf3cede876150ae5"
                      alt="chun wang shop cover image"
                      className="w-full h-full object-cover"
                    />
                  </a>
                </div>
              </div> 
            </div>

            {/* Right - Image */}
            <div className="hidden lg:block relative">
              <a
                href={SITE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center aspect-square lg:aspect-[4/3] rounded-lg overflow-hidden scale-80"
              >
                <img 
                  src="https://cdn.myportfolio.com/28e70582c8bd2069899fb42e60980ce2/bcfb5ed3-e3df-489e-ba87-518d4adccdd0_rw_1200.png?h=3e84d177c91ced5bbf3cede876150ae5"
                  alt="chun wang shop cover image"
                  className="w-3/4 h-3/4 object-cover"
                />
              </a> 
              {/* Decorative border */}
              <div className="absolute inset-0 border-4 border-primary translate-x-4 translate-y-4 rounded-lg -z-10"></div>
            </div>
          </div>
        </div>
      </section>
      <section id="about">
        <About /> <Footer />
      </section>
      
    </div>
  );
};

export default Index;
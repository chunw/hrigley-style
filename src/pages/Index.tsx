import { useState } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ProductGrid from "@/components/ProductGrid";
import Footer from "@/components/Footer";
import { Analytics } from "@vercel/analytics/next";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-background">
      
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <HeroSection />
      <ProductGrid searchQuery={searchQuery} />
 
      <section className="border-t relative bg-background py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left - Text Content */}
            <div className="space-y-8">
              <div className="space-y-4">
{/* 
           
             <div className="handwritten text-sm text-muted-foreground">Welcome to</div> */}
              
                <h1 className=" shop-title text-4xl md:text-6xl lg:text-7xl leading-none">
                 Chun Wang <br />Studio<br />
                  <span className="text-primary">SHOP</span>
                </h1>
                <p className="text-muted-foreground max-w-md handwritten">
                  {/* What started as bespoke observations and a bit of overthinking turn into whimsical objects you can use, gift, or just stare at in existential curiosity.
                   */}
                  Unique works for the imaginative collectors
                </p>
              </div>

              {/* <div className="space-y-2">
                created exclusively by Chun Wang. 
              </div> */}
            </div>

            {/* Right - Image */}
            <div className="relative">
              <div className="aspect-square lg:aspect-[4/3] rounded-lg overflow-hidden scale-80">
                <img 
                  src="https://cdn.myportfolio.com/28e70582c8bd2069899fb42e60980ce2/bcfb5ed3-e3df-489e-ba87-518d4adccdd0_rw_1200.png?h=3e84d177c91ced5bbf3cede876150ae5"
                  alt="chun wang shop cover image"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Decorative border */}
              <div className="absolute inset-0 border-4 border-primary translate-x-4 translate-y-4 rounded-lg -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
import { useState } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ProductGrid from "@/components/ProductGrid";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-background">
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <HeroSection />
      <ProductGrid searchQuery={searchQuery} />

      {/* About Section from Msg from C.W. */}
      <section className="relative bg-background py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left - Text Content */}
            <div className="space-y-8">
              <div className="space-y-4">

             <div className="space-x-12"> Welcome to </div>
               
                {/* <i>Sincerely, What?</i> Shop —  */}
              
                <h1 className="shrigley-title text-4xl md:text-6xl lg:text-7xl leading-none">
                 Chun Wang <br />Studio<br />
                  <span className="text-primary">SHOP</span>
                </h1>
                <p className="handwritten text-lg text-muted-foreground max-w-md">
                  What started as bespoke observations and a bit of overthinking turn into whimsical objects you can use, gift, or just stare at in existential curiosity,
              
                </p>
              </div>

              <div className="space-y-4">
                created exclusively by Chun Wang. 
              </div>
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

      {/* Instagram Section */}
      <section className="relative bg-background py-8 ">
        {/* <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> */}
          <div className="text-center space-y-8">
             <p className="handwritten text-lg text-muted-foreground">
                Follow on Instagram
              </p>
            <a
              href="https://www.instagram.com/chunwang.art/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block"
            >
              <Button 
                size="lg"
                className="handwritten text-lg px-8 py-6 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                @chunwang.art
              </Button>
            </a>
          </div>

        {/* </div> */}
      </section>

      <Footer />
    </div>
  );
};

export default Index;
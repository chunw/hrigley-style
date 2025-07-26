import HeroSection from "@/components/HeroSection";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <section className="relative bg-background py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left - Text Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="shrigley-title text-4xl md:text-6xl lg:text-7xl leading-none">
               Sincerely, <br />What?<br />
                <span className="text-primary">SHOP</span>
              </h1>
              <p className="handwritten text-lg text-muted-foreground max-w-md">
                What started as bespoke observations and a bit of overthinking turn into 
              </p>
            </div>

            <div className="space-y-4">
              {/* Welcome to <i>Sincerely, What?</i> Shop —  */}
              whimsical objects you can use, gift, or just stare at in existential curiosity.
            </div>
             
            <div className="space-y-4">
              <Button 
                size="lg"
                className="handwritten text-lg px-8 py-6 bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={() => navigate('/')}
              >
                SHOP NOW
              </Button>
            </div>
          </div>

          {/* Right - Image */}
          <div className="relative">
            <div className="aspect-square lg:aspect-[4/3] rounded-lg overflow-hidden scale-80">
              <img 
                // src={heroBag} 
                src="https://cdn.myportfolio.com/28e70582c8bd2069899fb42e60980ce2/bcfb5ed3-e3df-489e-ba87-518d4adccdd0_rw_1200.png?h=3e84d177c91ced5bbf3cede876150ae5"
                alt="Shopping bag with really good stuff"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Decorative border */}
            <div className="absolute inset-0 border-4 border-primary translate-x-4 translate-y-4 rounded-lg -z-10"></div>
          </div>
        </div>
      </div>
    </section>
    </div>
  );
};

export default About;
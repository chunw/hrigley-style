import { Button } from "@/components/ui/button";
import heroBag from "@/assets/hero-bag.jpg";

const HeroSection = () => {
  return (
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
                UNIQUE WORKS, LIMITED EDITIONS, AND OTHER READY GOOD STUFF CREATED BY CHUN WANG
              </p>
            </div>
            
            {/* <div className="space-y-4">
              <Button 
                size="lg" 
                className="handwritten text-lg px-8 py-6 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                SHOP NOW
              </Button>
            </div> */}
          </div>

          {/* Right - Image */}
          <div className="relative">
            <div className="w-24 h-24 bg-muted rounded-lg overflow-hidden">
              <img 
                // src={heroBag} 
                src="https://file.notion.so/f/f/4629ec40-293c-4ec0-be5b-b4265df638ce/e46f189f-82b4-4d55-9b22-86101d18b378/Screenshot_2025-07-25_at_8.35.45_PM.png?table=block&id=23c89a10-7c46-80a6-b75e-c005d60b6234&spaceId=4629ec40-293c-4ec0-be5b-b4265df638ce&expirationTimestamp=1753516800000&signature=ZlPceEie6LvmPal6yhjR5JEkKmwmq0X_KYdS7bFgaYo&downloadName=Screenshot+2025-07-25+at+8.35.45%E2%80%AFPM.png"
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
  );
};

export default HeroSection;
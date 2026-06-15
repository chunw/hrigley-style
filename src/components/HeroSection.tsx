import { useLanguage } from "@/contexts/LanguageContext";

const HeroSection = () => {
  const { t } = useLanguage();
  return (
    <section className="relative bg-background py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="shop-title text-4xl md:text-6xl lg:text-7xl leading-none">
                {t.shopTitle.line1} <br />{t.shopTitle.line2}<br />
                <span className="text-primary">{t.shopTitle.line3}</span>
              </h1>
              <p className="handwritten max-w-md" style={{
                opacity: 0.7,
                fontSize: '0.85rem',
              }}>
                {t.hero.description}
              </p>
              <p className="handwritten text-muted-foreground max-w-md" style={{
                fontSize: '0.9rem',
              }}>
                {t.hero.createdExclusivelyBy}{" "}
                <a href="https://www.chunwang.art" target="_blank" rel="noreferrer">
                  <span className="text-primary">
                    chun wang
                  </span>
                </a>
              </p>
            </div>
          </div>

          <div className="relative">
            <a
              href="https://chun.myportfolio.com/copy-of-climate-collapse-the-war-against-powered-interests"
              target="_blank"
              rel="noreferrer"
              className="block aspect-square lg:aspect-[4/3] rounded-lg overflow-hidden sm:scale-60 md:scale-70 lg:scale-80"
            >
              <img
                src="https://cdn.myportfolio.com/28e70582c8bd2069899fb42e60980ce2/af3f4d90-9ec9-4349-93f9-b47c33833106_rwc_0x98x1200x938x1200.gif?h=4a7cdfb5fee81de134dd238b6c03c921"
                alt="CHUN WANG SHOP COVER IMAGE"
                className="w-full h-full object-cover"
              />
            </a>
            {/* <p className="mt-3 text-xs text-muted-foreground/70">
              Image by {" "}
              <a
                href="https://chun.myportfolio.com/copy-of-climate-collapse-the-war-against-powered-interests"
                target="_blank"
                rel="noreferrer"
                className="underline-offset-2 hover:underline"
              >
                Chun Wang
              </a>
            </p> */}
            {/* Decorative border */}
            <div className="absolute inset-0 border-4 border-primary translate-x-4 translate-y-4 rounded-lg -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
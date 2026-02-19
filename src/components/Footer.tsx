import { Button } from "@/components/ui/button";
import { INSTAGRAM_URL, SITE_NAME } from "@/lib/constants";

const Footer = () => {
  return (
    <footer className="bg-[hsl(var(--footer-background))] text-primary-foreground py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8">
          {/* Contact */}
          <div className="space-y-4">
            <h3 className="shop-title text-xl">CONTACT</h3>
            <div className="space-y-2">
              <p className="text-sm">chunwang.me@gmail.com</p>
              <p className="text-sm">
                NEW YORK CITY, USA<br />
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center">
          <div className="space-y-6 pb-6">
            <p className="handwritten text-lg text-primary-foreground">Follow on Instagram</p>
            <a
              href={INSTAGRAM_URL}
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
          <p className=" text-sm">
            ©2026 {SITE_NAME}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
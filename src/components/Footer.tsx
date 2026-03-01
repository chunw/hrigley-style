import { Button } from "@/components/ui/button";
import { INSTAGRAM_URL, SITE_NAME } from "@/lib/constants";

const Footer = () => {
  return (
    <footer className="">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-primary-foreground/20 text-center">
          <div className="space-y-6 pb-6">
            <p className="font-helvetica text-primary-foreground"></p>
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
          <p className="text-sm font-helvetica">
            © {new Date().getFullYear()} Chun Wang Studio. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
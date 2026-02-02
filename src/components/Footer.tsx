import { SITE_NAME } from "@/lib/constants";

const Footer = () => {
  return (
    <footer className="bg-[hsl(var(--footer-background))] text-primary-foreground py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8">
          {/* Contact */}
          <div className="space-y-4">
            <h3 className="shrigley-title text-xl">CONTACT</h3>
            <div className="space-y-2">
              <a href="https://www.instagram.com/chunwang.art/" className="handwritten text-sm block hover:underline">
                INSTAGRAM
              </a>
              <p className="handwritten text-sm">chunwang.me@gmail.com</p>
              <p className="handwritten text-sm">
                NEW YORK CITY, USA<br />
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center">
          <p className="handwritten text-sm">
            © 2026 {SITE_NAME}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
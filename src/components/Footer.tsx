const Footer = () => {
  return (
    <footer className="bg-[hsl(var(--footer-background))] text-primary-foreground py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left - About */}
          <div className="space-y-4">
            <h3 className="shrigley-title text-xl">ABOUT CHUN WANG SHOP</h3>
            <p className="handwritten text-sm">
             What started as bespoke observations and a bit of overthinking turn into whimsical objects you can use, gift, or just stare at in existential curiosity.
            </p>
            <p className="handwritten text-sm">
              CREATED EXCLUSIVELY BY CHUN WANG.
            </p>
          </div>

          {/* Center - Links */}
          <div className="space-y-4">
            <h3 className="shrigley-title text-xl">LINKS</h3>
            <div className="space-y-2">
              <a href="#" className="handwritten text-sm block hover:underline">SHOP</a>
              <a href="/about" className="handwritten text-sm block hover:underline">ABOUT</a>
              {/* <a href="#" className="handwritten text-sm block hover:underline">CONTACT</a>
              <a href="#" className="handwritten text-sm block hover:underline">SHIPPING</a>
              <a href="#" className="handwritten text-sm block hover:underline">RETURNS</a> */}
            </div>
          </div>

          {/* Right - Contact */}
          <div className="space-y-4">
            <h3 className="shrigley-title text-xl">CONTACT</h3>
            <div className="space-y-2">
              <p className="handwritten text-sm">chunwang.me@gmail.com</p>
              <p className="handwritten text-sm">
                NEW YORK<br />
                USA
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center">
          <p className="handwritten text-sm">
            © 2025 chun wang SHOP
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
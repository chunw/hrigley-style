import { ShoppingBag, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="border-b border-border bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          {/* Left - Logo */}
          <div className="flex-shrink-0">
            <h1 className="shrigley-title text-2xl">
              CHUN WANG<br />SHOP
            </h1>
          </div>

          {/* Center - Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a href="#" className="handwritten text-sm hover:text-primary transition-colors">
              SHOP
            </a>
            <a href="#" className="handwritten text-sm hover:text-primary transition-colors">
              ABOUT
            </a>
            <a href="#" className="handwritten text-sm hover:text-primary transition-colors">
              MSG FROM C.W.
            </a>
          </nav>

          {/* Right - Actions */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <ShoppingBag className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
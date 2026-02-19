import { useNavigate } from "react-router-dom";
import { SITE_NAME } from "@/lib/constants";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="border-b border-border bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-28">
          {/* Left - Logo */}
          <div className="flex-shrink-0">
            <h1 onClick={() => navigate('/')} className="shop-title text-2xl cursor-pointer hover:text-primary transition-colors">
              {SITE_NAME.split(' ').slice(0, 2).join(' ')}<br />{SITE_NAME.split(' ').slice(2).join(' ')}
            </h1>
          </div>

          <div className="flex-1" />

          {/* Navigation */}
          {/* <nav className="hidden lg:flex space-x-8">
            <a href="#" className="handwritten text-sm hover:text-primary transition-colors">
              SHOP
            </a>
          </nav> */}

          {/* Right - Actions */}
          {/* <div className="flex items-center space-x-4">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button 
                variant="outline"
                size="sm"
                className="handwritten text-sm"
              >
                CONNECT
              </Button>
            </a>
          </div> */}

        </div>
      </div>
    </header>
  );
};

export default Header;
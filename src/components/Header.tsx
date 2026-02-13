import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { SITE_NAME, INSTAGRAM_URL } from "@/lib/constants";

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const Header = ({ searchQuery, onSearchChange }: HeaderProps) => {
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

          {/* Center - Search and Navigation */}
          <div className="flex-1 max-w-xl mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="SEARCH"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 handwritten text-sm bg-muted/50 border-border"
              />
            </div>
          </div>

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
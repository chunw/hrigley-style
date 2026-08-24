import { Link, useLocation, useNavigate } from "react-router-dom";
import { Sun, Moon, BookOpen, User } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { INSTAGRAM_URL } from "@/lib/constants";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { lang, toggleLang, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const isHomePage = location.pathname === "/";
  const useGloriaTitle = /^\/(product|watercolors|remains|21spirit|photography)\/[^/]+\/?$/.test(location.pathname)
    || location.pathname === "/catalogs"
    || location.pathname === "/about"
    || location.pathname === "/slightlyusefulobject";

  const controlColor = isHomePage ? "text-foreground" : "text-white";

  return (
    <header className={`bg-black ${isHomePage ? "home-header-adaptive" : ""}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-28 pt-6">
          <div className="absolute inset-y-0 right-0 inline-flex items-center gap-8 text-sm fangsong-nav">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={toggleTheme}
                  aria-label="Toggle dark/light mode"
                  className={`transition-colors text-sm px-2 py-1 hover:text-primary ${controlColor}`}
                >
                  {theme === "light" ? (
                    <Moon className={`h-4 w-4 ${controlColor}`} />
                  ) : (
                    <Sun className={`h-4 w-4 ${controlColor}`} />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent>
                {theme === "light" ? "switch to dark mode" : "switch to light mode"}
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  to="/about"
                  aria-label={t.index.ctaAbout}
                  className={`transition-colors text-sm px-2 py-1 hover:text-primary ${controlColor}`}
                >
                  {t.index.ctaAbout}
                </Link>
              </TooltipTrigger>
              <TooltipContent>{t.index.ctaAbout}</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  to="/catalogs"
                  aria-label="art catalogs"
                  className={`transition-colors text-sm px-2 py-1 hover:text-primary ${controlColor}`}
                >
                  art catalogs
                </Link>
              </TooltipTrigger>
              <TooltipContent>art catalogs</TooltipContent>
            </Tooltip>

            {/* Removed link to /all-items per request */}

            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow on Instagram"
                  className={`transition-colors text-sm px-2 py-1 hover:text-primary ${controlColor}`}
                >
                  {t.index.ctaInstagram}
                </a>
              </TooltipTrigger>
              <TooltipContent>{t.index.ctaInstagram}</TooltipContent>
            </Tooltip>
          </div>

          {/* Left - Logo */}
          <div className="flex-shrink-0">
            <div className="shop-title instrument-title text-2xl leading-none transition-colors header-shop-scale">
              <Link to="/" className="block cursor-pointer text-white">
                {t.shopTitle.line1}
                <br />
                {t.shopTitle.line2}
              </Link>
              <Link to="/all-items" className="block text-primary hover:underline">
                {t.shopTitle.line3}
              </Link>
            </div>
          </div>

          <div className="flex-1" />

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
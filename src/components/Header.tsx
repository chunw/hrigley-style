import { Link, useLocation, useNavigate } from "react-router-dom";
import { Instagram, Sun, Moon, BookOpen } from "lucide-react";
import { INSTAGRAM_URL } from "@/lib/constants";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { lang, toggleLang, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const isHomePage = location.pathname === "/";
  const useGloriaTitle = /^\/(product|watercolors|remains|21spirit|photography)\/[^/]+\/?$/.test(location.pathname)
    || location.pathname === "/catalogs";

  const controlColor = "text-white";

  return (
    <header className="bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-28">
          <div className="absolute inset-y-0 right-0 inline-flex items-center gap-8 text-sm font-helvetica">
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  to="/catalogs"
                  aria-label={t.index.ctaCatalogs}
                  className={`inline-flex items-center justify-center w-8 h-8 transition-colors hover:text-primary ${controlColor}`}
                >
                  <BookOpen className="h-4 w-4" />
                </Link>
              </TooltipTrigger>
              <TooltipContent>{t.index.ctaCatalogs}</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={toggleTheme}
                  aria-label="Toggle dark/light mode"
                  className={`inline-flex items-center justify-center w-8 h-8 transition-colors hover:text-primary ${controlColor}`}
                >
                  {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                </button>
              </TooltipTrigger>
              <TooltipContent>
                {theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={toggleLang}
                  aria-label="Toggle language"
                  className={`sans-label transition-colors text-xs px-2 py-1 hover:text-primary ${controlColor}`}
                >
                  {lang === "en" ? "中文" : "EN"}
                </button>
              </TooltipTrigger>
              <TooltipContent>
                {lang === "en" ? "Switch to Chinese" : "Switch to English"}
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow on Instagram"
                  className={`handwritten inline-flex items-center gap-1 transition-colors hover:text-primary ${controlColor}`}
                >
                  <Instagram className="h-4 w-4" />
                </a>
              </TooltipTrigger>
              <TooltipContent>{t.index.ctaInstagram}</TooltipContent>
            </Tooltip>
          </div>

          {/* Left - Logo */}
          <div className="flex-shrink-0">
            <h1
              onClick={() => navigate('/')}
              className={`shop-title text-2xl leading-none cursor-pointer text-white transition-colors ${
                isHomePage ? "hidden" : "hover:text-primary"
              } ${useGloriaTitle ? "gloria-title" : ""}`}
            >
              {t.shopTitle.line1}<br />{t.shopTitle.line2}<br />
              <span className="text-primary">{t.shopTitle.line3}</span>
            </h1>
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
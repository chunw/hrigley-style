import { Link, useLocation, useNavigate } from "react-router-dom";
import { Sun, Moon, BookOpen, User, Menu, ShoppingBag } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Lang } from "@/lib/translations";
import { useTheme } from "@/contexts/ThemeContext";
import { useCart } from "@/contexts/CartContext";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { INSTAGRAM_URL } from "@/lib/constants";
import slightlyUsefulLogo from "@/assets/slightly_useful_mid_byline.png";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { lang, setLang, toggleLang, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { state: cartState } = useCart();
  const isHomePage = location.pathname === "/";
  const isSlightlyUsefulObjectPage = location.pathname === "/slightlyusefulobject";
  const useGloriaTitle = /^\/(product|watercolors|remains|21spirit|photography)\/[^/]+\/?$/.test(location.pathname)
    || location.pathname === "/catalogs"
    || location.pathname === "/about"
    || location.pathname === "/slightlyusefulobject";

  // Determine whether header should render in light mode.
  // On product/detail and related pages we prefer a light header so it observes
  // the page's light background even if the global theme is dark. The Slightly
  // Useful Object page's header bar is always dark, regardless of the site-wide
  // toggle (matching its hero below).
  const headerIsLight = isSlightlyUsefulObjectPage ? false : (theme === "light" || useGloriaTitle);
  const controlColor = headerIsLight ? "text-foreground" : "text-white";

  return (
    <header className={`${headerIsLight ? "bg-background" : "bg-black"} ${isHomePage ? "home-header-adaptive" : ""}`}>
      <div className={isSlightlyUsefulObjectPage ? "px-4 sm:px-6 lg:px-16" : "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"}>
        <div className={`relative flex items-center justify-between pt-6 pb-6 ${isSlightlyUsefulObjectPage ? "h-40" : "h-28"}`}>
          <div className="absolute inset-y-0 right-0 hidden md:inline-flex items-center gap-8 text-sm fangsong-nav">
            {!isSlightlyUsefulObjectPage && (
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
            )}

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
                  aria-label={t.index.ctaCatalog}
                  className={`transition-colors text-sm px-2 py-1 hover:text-primary ${controlColor}`}
                >
                  {t.index.ctaCatalog}
                </Link>
              </TooltipTrigger>
              <TooltipContent>{t.index.ctaCatalogs}</TooltipContent>
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

            <div className="relative">
              <label className="sr-only">Language</label>
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value as Lang)}
                aria-label="Select language"
                className={`transition-colors text-sm px-2 py-1 hover:text-primary bg-transparent border-none appearance-none ${controlColor}`}
              >
                <option value="en">EN</option>
                <option value="zh">中文</option>
              </select>
            </div>

            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  to="/cart"
                  aria-label="View cart"
                  className={`relative transition-colors text-sm px-2 py-1 hover:text-primary ${controlColor}`}
                >
                  <ShoppingBag className={`h-4 w-4 ${controlColor}`} />
                  {cartState.itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold leading-none text-primary-foreground">
                      {cartState.itemCount}
                    </span>
                  )}
                </Link>
              </TooltipTrigger>
              <TooltipContent>Cart ({cartState.itemCount})</TooltipContent>
            </Tooltip>
          </div>

          {/* Mobile - show compact drawer trigger */}
          <div className="absolute inset-y-0 right-0 flex items-center gap-1 md:hidden">
            <Link
              to="/cart"
              aria-label="View cart"
              className={`relative transition-colors p-2 hover:text-primary ${controlColor}`}
            >
              <ShoppingBag className={`h-5 w-5 ${controlColor}`} />
              {cartState.itemCount > 0 && (
                <span className="absolute top-0.5 right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold leading-none text-primary-foreground">
                  {cartState.itemCount}
                </span>
              )}
            </Link>
            <Drawer>
              <DrawerTrigger asChild>
                <button
                  type="button"
                  aria-label="Open menu"
                  className={`transition-colors p-2 hover:text-primary ${controlColor}`}
                >
                  <Menu className={`h-6 w-6 ${controlColor}`} />
                </button>
              </DrawerTrigger>

              <DrawerContent>
                <DrawerHeader className="text-left">
                  <DrawerTitle className="shop-title gloria-title text-lg font-bold leading-tight tracking-wide text-left pl-2">
                    <Link to="/" className="block cursor-pointer">
                      {t.shopTitle.line1}
                      <br />
                      {t.shopTitle.line2}
                      <br />
                      <span className="text-primary">{t.shopTitle.line3}</span>
                    </Link>
                  </DrawerTitle>
                </DrawerHeader>

                <div className="flex flex-col gap-4 p-4">
                  {!isSlightlyUsefulObjectPage && (
                    <button
                      type="button"
                      onClick={toggleTheme}
                      aria-label="Toggle dark/light mode"
                      className="flex items-center gap-2 text-sm p-2 transition-colors text-foreground"
                    >
                      {theme === "light" ? (
                        <Moon className="h-4 w-4 text-foreground" />
                      ) : (
                        <Sun className="h-4 w-4 text-foreground" />
                      )}
                      {theme === "light" ? "Dark" : "Light"}
                    </button>
                  )}

                  <Link to="/about" className="text-sm p-2 text-foreground">{t.index.ctaAbout}</Link>
                  <Link to="/catalogs" className="text-sm p-2 text-foreground">{t.index.ctaCatalog}</Link>
                  <a
                    href={INSTAGRAM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm p-2 text-foreground"
                  >
                    {t.index.ctaInstagram}
                  </a>

                  <div>
                    <label className="sr-only">Language</label>
                    <select
                      value={lang}
                      onChange={(e) => setLang(e.target.value as Lang)}
                      aria-label="Select language"
                      className="w-full text-sm p-2 bg-transparent border rounded text-foreground"
                    >
                      <option value="en">EN</option>
                      <option value="zh">中文</option>
                    </select>
                  </div>
                </div>

                <DrawerFooter>
                  <DrawerClose asChild>
                    <button className="w-full p-3 text-center">Close</button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </div>

          {/* Left - Logo */}
          <div className="flex-shrink-0">
            {isSlightlyUsefulObjectPage ? (
              <Link to="/" className="block cursor-pointer group">
                <img
                  src={slightlyUsefulLogo}
                  alt="Slightly Useful Object"
                  className="h-36 w-auto object-contain transition-transform duration-300 ease-out group-hover:scale-110 group-hover:-rotate-6"
                />
              </Link>
            ) : (
              !location.pathname.startsWith("/catalogs") && (
                <div className="shop-title gloria-title text-2xl leading-none transition-colors header-shop-scale">
                  <Link to="/" className="header-brand-link block cursor-pointer">
                    {t.shopTitle.line1}
                    <br />
                    {t.shopTitle.line2}
                  </Link>
                  <Link to="/" className="block text-primary cursor-pointer">
                    {t.shopTitle.line3}
                  </Link>
                </div>
              )
            )}
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
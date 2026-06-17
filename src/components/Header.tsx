import { useLocation, useNavigate } from "react-router-dom";
import { Instagram } from "lucide-react";
import { INSTAGRAM_URL } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { lang, toggleLang, t } = useLanguage();
  const isHomePage = location.pathname === "/";

  const handleContactClick = async () => {
    const email = "chunwang.me@gmail.com";

    try {
      await navigator.clipboard.writeText(email);
      toast({
        title: t.header.contactEmailCopiedTitle,
        description: `${email}`,
        className: "font-helvetica normal-case tracking-normal",
      });
    } catch {
      toast({
        title: t.header.contactEmailCopyFailedTitle,
        description: `${t.header.contactEmailCopyFailedDescription} ${email}`,
        variant: "destructive",
        className: "font-helvetica normal-case tracking-normal",
      });
    }
  };

  return (
    <header className="border-b border-border bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-28">
          <div className="absolute inset-y-0 right-0 inline-flex items-center gap-8 text-sm font-helvetica">
            <button
              type="button"
              onClick={toggleLang}
              aria-label="Toggle language"
              className={`handwritten transition-colors text-xs border px-2 py-1 ${
                isHomePage ? "text-white border-white/40 hover:text-primary hover:border-primary" : "text-foreground border-border hover:text-primary hover:border-primary"
              }`}
            >
              {lang === "en" ? "中文" : "EN"}
            </button>

            <a
              href="#about"
              rel="noopener noreferrer"
              aria-label="about"
              className={`handwritten inline-flex items-center gap-1 transition-colors ${
                isHomePage ? "text-white hover:text-primary" : "text-foreground hover:text-primary"
              }`}
            >
              <span>{t.header.about}</span>
            </a>

            <button
              type="button"
              onClick={handleContactClick}
              aria-label="Copy contact email"
              className={`handwritten transition-colors ${
                isHomePage ? "text-white hover:text-primary" : "text-foreground hover:text-primary"
              }`}
            >
              {t.header.contact}
            </button>

            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow on Instagram"
              className={`handwritten inline-flex items-center gap-1 transition-colors ${
                isHomePage ? "text-foreground hover:text-primary" : "text-foreground hover:text-primary"
              }`}
            >
              <Instagram className="h-4 w-4" />
            </a>
          </div>

          {/* Left - Logo */}
          <div className="flex-shrink-0">
            <h1
              onClick={() => navigate('/')}
              className={`shop-title text-2xl leading-none cursor-pointer transition-colors ${
                isHomePage ? "hidden" : "hover:text-primary"
              }`}
            >
              {t.shopTitle.line1}<br />{t.shopTitle.line2}<br />
              <span className={isHomePage ? "text-white" : "text-primary"}>{t.shopTitle.line3}</span>
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
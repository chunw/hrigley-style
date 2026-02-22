import { useNavigate } from "react-router-dom";
import { Instagram } from "lucide-react";
import { INSTAGRAM_URL } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";

const Header = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleContactClick = async () => {
    const email = "chunwang.me@gmail.com";

    try {
      await navigator.clipboard.writeText(email);
      toast({
        title: "Email copied to your clipboard",
        description: `${email}`,
      });
    } catch {
      toast({
        title: "Copy failed",
        description: `Please copy manually: ${email}`,
        variant: "destructive",
      });
    }
  };

  return (
    <header className="border-b border-border bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-28">
          <div className="absolute inset-y-0 right-0 inline-flex items-center gap-4 text-sm font-helvetica">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow on Instagram"
              className="inline-flex items-center gap-1 text-foreground hover:text-primary transition-colors"
            >
              <Instagram className="h-4 w-4" />
              <span>follow us</span>
            </a>
            <span aria-hidden="true" className="text-muted-foreground">|</span>
            <button
              type="button"
              onClick={handleContactClick}
              aria-label="Copy contact email"
              className="text-foreground hover:text-primary transition-colors"
            >
              contact us
            </button>
          </div>

          {/* Left - Logo */}
          <div className="flex-shrink-0">
            <div className="flex items-end gap-3">
              <h1 onClick={() => navigate('/')} className="shop-title text-2xl leading-none cursor-pointer hover:text-primary transition-colors">
                CHUN WANG<br />STUDIO<br />
                <span className="text-primary">SHOP</span>
              </h1>
              <img
                src="https://cdn.myportfolio.com/28e70582c8bd2069899fb42e60980ce2/bcfb5ed3-e3df-489e-ba87-518d4adccdd0_rw_1200.png?h=3e84d177c91ced5bbf3cede876150ae5"
                alt="Chun Wang portrait"
                className="w-24 h-24 object-cover"
              />
            </div>
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
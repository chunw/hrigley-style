import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import deliveryGif from "@/assets/delivery.gif";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const { clearCart } = useCart();
  const { lang, t } = useLanguage();
  const orderId = searchParams.get("order_id");
  const s = t.paymentSuccess;

  // The cart is already cleared right after a successful capture in Cart.tsx;
  // this is just a safety net for anyone who lands here directly.
  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-lg mx-auto">
          {/* Greeting */}
          <div className="text-center mb-10">
            <p
              className={
                lang === "zh"
                  ? "shop-title text-5xl md:text-6xl leading-tight"
                  : "handwritten text-5xl md:text-6xl leading-tight"
              }
            >
              {s.thankYou}
            </p>
            <p className="sans-label text-xs text-muted-foreground mt-4">
              {s.tagline}
            </p>
            <p className="text-sm text-muted-foreground mt-2">{s.supportLine}</p>
          </div>

          {/* Studio receipt card */}
          <div className="relative border border-foreground/20 bg-card shadow-[6px_6px_0_0_hsl(var(--primary)/0.15)]">
            {/* Paid stamp */}
            <div className="absolute -top-4 right-6 z-10 rotate-[-10deg] rounded-full border-2 border-primary px-4 py-1 bg-background">
              <span className="sans-label text-primary text-sm font-bold tracking-[0.25em]">
                {s.paid}
              </span>
            </div>

            {/* Illustration — the same delivery artwork as the About page backdrop */}
            <img
              src={deliveryGif}
              alt=""
              className="w-full h-44 md:h-52 object-cover border-b border-dashed border-foreground/30"
            />

            <div className="px-6 py-8 md:px-10">
              <h1 className="shop-title text-2xl md:text-3xl text-center">
                {s.orderConfirmed}
              </h1>
              {orderId && (
                <p className="text-center font-mono text-sm tracking-widest text-muted-foreground mt-2">
                  No. {orderId.slice(-8).toUpperCase()}
                </p>
              )}

              <p className="text-center leading-relaxed mt-8">
                {s.receiptNote} {s.nextNote}
              </p>

              <div className="border-t border-dashed border-foreground/30 mt-8 pt-6 text-center space-y-1.5">
                <p className="text-sm text-muted-foreground">
                  {s.orderQuestions}{" "}
                  <a
                    href="mailto:chunwang.me@gmail.com"
                    className="text-primary underline underline-offset-4"
                  >
                    chunwang.me@gmail.com
                  </a>
                </p>
                <p className="text-sm text-muted-foreground">
                  {s.updatesLine}{" "}
                  <a
                    href="https://www.instagram.com/chunwang.art"
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary underline underline-offset-4"
                  >
                    @chunwang.art
                  </a>
                </p>
              </div>
            </div>
          </div>

          <div className="text-center pt-10">
            <Button
              onClick={() => (window.location.href = "/")}
              variant="outline-pink"
              size="lg"
              className="sans-label"
            >
              {s.continueShopping}
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PaymentSuccess;

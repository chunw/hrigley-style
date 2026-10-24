import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";

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
          </div>

          {/* Studio receipt card */}
          <div className="relative border border-foreground/20 bg-card px-6 py-8 md:px-10 shadow-[6px_6px_0_0_hsl(var(--primary)/0.15)]">
            {/* Paid stamp */}
            <div className="absolute -top-4 right-6 rotate-[-10deg] rounded-full border-2 border-primary px-4 py-1 bg-background">
              <span className="sans-label text-primary text-sm font-bold tracking-[0.25em]">
                {s.paid}
              </span>
            </div>

            <h1 className="shop-title text-2xl md:text-3xl text-center">
              {s.orderConfirmed}
            </h1>

            <div className="border-t border-dashed border-foreground/30 mt-8 pt-6 space-y-5">
              {orderId && (
                <div className="flex items-baseline justify-between gap-4">
                  <span className="sans-label text-xs text-muted-foreground">
                    {s.orderNo}
                  </span>
                  <span className="font-mono text-lg tracking-widest">
                    No. {orderId.slice(-8).toUpperCase()}
                  </span>
                </div>
              )}

              <div className="flex items-baseline justify-between gap-4">
                <span className="sans-label text-xs text-muted-foreground">
                  {s.receipt}
                </span>
                <span className="text-sm text-right">{s.receiptNote}</span>
              </div>

              <div className="flex items-baseline justify-between gap-4">
                <span className="sans-label text-xs text-muted-foreground">
                  {s.next}
                </span>
                <span className="text-sm text-right">{s.nextNote}</span>
              </div>
            </div>

            <div className="border-t border-dashed border-foreground/30 mt-8 pt-6 text-center">
              <p className="text-sm text-muted-foreground">
                {s.questions}{" "}
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

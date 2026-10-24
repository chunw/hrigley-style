import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const { clearCart } = useCart();
  const orderId = searchParams.get("order_id");

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
          {/* Handwritten greeting */}
          <div className="text-center mb-10">
            <p className="handwritten text-5xl md:text-6xl leading-tight">
              thank you!
            </p>
            <p className="shop-title text-2xl md:text-3xl mt-2 tracking-wide">
              谢 谢
            </p>
            <p className="sans-label text-xs text-muted-foreground mt-4">
              A NEW PIECE FINDS ITS PERSON · 一件作品找到了它的人
            </p>
          </div>

          {/* Studio receipt card */}
          <div className="relative border border-foreground/20 bg-card px-6 py-8 md:px-10 shadow-[6px_6px_0_0_hsl(var(--primary)/0.15)]">
            {/* Paid stamp */}
            <div className="absolute -top-4 right-6 rotate-[-10deg] rounded-full border-2 border-primary px-4 py-1 bg-background">
              <span className="sans-label text-primary text-sm font-bold tracking-[0.25em]">
                PAID · 已付款
              </span>
            </div>

            <h1 className="shop-title text-2xl md:text-3xl text-center">
              ORDER CONFIRMED
            </h1>
            <p className="text-center text-muted-foreground mt-1">订单已确认</p>

            <div className="border-t border-dashed border-foreground/30 mt-8 pt-6 space-y-5">
              {orderId && (
                <div className="flex items-baseline justify-between gap-4">
                  <span className="sans-label text-xs text-muted-foreground">
                    ORDER NO. · 订单号
                  </span>
                  <span className="font-mono text-lg tracking-widest">
                    No. {orderId.slice(-8).toUpperCase()}
                  </span>
                </div>
              )}

              <div className="flex items-baseline justify-between gap-4">
                <span className="sans-label text-xs text-muted-foreground">
                  RECEIPT · 收据
                </span>
                <span className="text-sm text-right">
                  PayPal will email it to you shortly
                  <br />
                  <span className="text-muted-foreground">PayPal 会把收据发到你的邮箱</span>
                </span>
              </div>

              <div className="flex items-baseline justify-between gap-4">
                <span className="sans-label text-xs text-muted-foreground">
                  NEXT · 接下来
                </span>
                <span className="text-sm text-right">
                  Your piece will be wrapped in the studio
                  <br />
                  and shipped from New York
                  <br />
                  <span className="text-muted-foreground">作品会在工作室打包好，从纽约寄出</span>
                </span>
              </div>
            </div>

            <div className="border-t border-dashed border-foreground/30 mt-8 pt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Questions, or just want to say hi —
                <br />
                find me on Instagram{" "}
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
              CONTINUE SHOPPING
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PaymentSuccess;

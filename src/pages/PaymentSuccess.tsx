import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
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
        <div className="max-w-md mx-auto text-center space-y-6">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />

          <div className="space-y-4">
            <h1 className="shop-title text-3xl md:text-4xl">
              PAYMENT SUCCESSFUL!
            </h1>

            <p className="text-muted-foreground font-helvetica">
              Thank you for your purchase! You'll receive a receipt from PayPal at the email
              address on your PayPal account shortly.
            </p>

            {orderId && (
              <p className="text-sm text-muted-foreground font-mono">
                Order reference: {orderId.slice(-8)}
              </p>
            )}
          </div>

          <div className="pt-6">
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

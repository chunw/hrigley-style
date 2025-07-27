import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    // Clear the cart on successful payment
    clearCart();
    console.log("Payment completed with session:", sessionId);
  }, [sessionId, clearCart]);

  return (
    <div className="min-h-screen bg-background">
      <Header searchQuery="" onSearchChange={() => {}} />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center space-y-6">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
          
          <div className="space-y-4">
            <h1 className="shrigley-title text-3xl md:text-4xl">
              PAYMENT SUCCESSFUL!
            </h1>
            
            <p className="text-muted-foreground font-helvetica">
              Thank you for your purchase! You should receive a confirmation email shortly.
            </p>
            
            {sessionId && (
              <p className="text-sm text-muted-foreground font-mono">
                Order reference: {sessionId.slice(-8)}
              </p>
            )}
          </div>

          <div className="pt-6">
            <Button 
              onClick={() => navigate("/")}
              variant="outline-pink"
              size="lg"
              className="handwritten"
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
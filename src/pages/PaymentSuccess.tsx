import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart, state } = useCart();
  const { toast } = useToast();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    const sendOrderConfirmation = async () => {
      if (!sessionId) return;

      // Prevent multiple calls by checking if email was already sent for this session
      const emailSentKey = `email_sent_${sessionId}`;
      if (localStorage.getItem(emailSentKey)) {
        console.log("Email already sent for this session");
        return;
      }

      // For testing, use your actual email. In production, this should come from Stripe customer data
      const customerEmail = searchParams.get("customer_email") || "your-email@example.com"; // Replace with your actual email
      
      try {
        // Send order confirmation email
        const { data, error } = await supabase.functions.invoke('send-order-confirmation', {
          body: {
            customerEmail,
            orderReference: sessionId.slice(-8),
            cartItems: state.items.map(item => ({
              name: item.name,
              quantity: item.quantity,
              price: item.price
            })),
            totalAmount: state.total
          }
        });

        if (error) {
          console.error("Error sending order confirmation:", error);
          toast({
            title: "Email Error",
            description: "Order confirmation email could not be sent, but your payment was successful.",
            variant: "destructive",
          });
        } else {
          console.log("Order confirmation email sent successfully");
          // Mark email as sent for this session
          localStorage.setItem(emailSentKey, 'true');
          toast({
            title: "Email Sent",
            description: "Order confirmation email has been sent!",
          });
        }
      } catch (error) {
        console.error("Error sending order confirmation:", error);
        toast({
          title: "Email Error", 
          description: "Order confirmation email could not be sent, but your payment was successful.",
          variant: "destructive",
        });
      }
    };

    // Only send email if we have cart items to send
    if (state.items.length > 0) {
      sendOrderConfirmation();
    }
    
    // Clear the cart on successful payment (do this after email attempt)
    clearCart();
    console.log("Payment completed with session:", sessionId);
  }, [sessionId, clearCart, searchParams, state.items, state.total, toast]);

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
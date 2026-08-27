import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/contexts/CartContext";
import { Minus, Plus, Trash2, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const MINIMUM_ORDER_AMOUNT = 0.5;
const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID as string | undefined;

const Cart = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { state, updateQuantity, removeItem, clearCart } = useCart();
  const [searchQuery, setSearchQuery] = useState("");

  const formatPrice = (price: number, currency: string) => {
    const symbol = currency === 'gbp' ? '£' : currency === 'eur' ? '€' : '$';
    return `${symbol}${price.toFixed(2)}`;
  };

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(id);
    } else {
      updateQuantity(id, newQuantity);
    }
  };

  const createOrder = async () => {
    const response = await fetch("/api/paypal/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: state.items }),
    });

    if (!response.ok) {
      throw new Error("Failed to start PayPal checkout. Please try again.");
    }

    const order = await response.json();
    return order.id as string;
  };

  const onError = (error: unknown) => {
    console.error("PayPal checkout error:", error);
    toast({
      title: "Checkout Error",
      description: "Something went wrong with PayPal checkout. Please try again.",
      variant: "destructive",
    });
  };

  const onApprove = async (data: { orderID: string }) => {
    try {
      const response = await fetch("/api/paypal/capture-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderID: data.orderID }),
      });

      const capture = await response.json();

      if (!response.ok || capture.status !== "COMPLETED") {
        throw new Error("Capture did not complete");
      }

      clearCart();
      navigate(`/payment-success?order_id=${data.orderID}`);
    } catch (error) {
      onError(error);
    }
  };

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="shop-title text-3xl md:text-4xl mb-6">YOUR CART</h1>
            <div className="space-y-6">
              <p className="handwritten text-lg text-muted-foreground">YOUR CART IS EMPTY</p>
              <Button
                onClick={() => navigate("/")}
                variant="outline"
                className="sans-label"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                CONTINUE SHOPPING
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="shop-title text-3xl md:text-4xl">YOUR CART</h1>
            <Button
              onClick={() => navigate("/")}
              variant="ghost"
              className="sans-label"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              CONTINUE SHOPPING
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {state.items.map((item) => (
                <Card key={item.id} className="border-2 border-border">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      {/* Product Image */}
                      <div className="w-20 h-20 bg-background rounded overflow-hidden flex-shrink-0">
                        <img
                          src={item.image_url || "/placeholder.svg"}
                          alt={item.title || item.name}
                          className="w-full h-full object-contain"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="handwritten product-title text-lg font-medium truncate">
                          {item.title || item.name}
                        </h3>
                        <p className="sans-label text-lg text-primary font-bold">
                          {formatPrice(item.price, item.currency)}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          className="h-8 w-8"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="handwritten text-lg w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          className="h-8 w-8"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Remove Button */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.id)}
                        className="h-8 w-8 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Subtotal for this item */}
                    <div className="mt-2 text-right">
                      <span className="sans-label text-sm text-muted-foreground">
                        Subtotal: {formatPrice(item.price * item.quantity, item.currency)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="border-2 border-border sticky top-4">
                <CardContent className="p-6">
                  <h2 className="handwritten text-xl font-bold mb-4">ORDER SUMMARY</h2>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between sans-label">
                      <span>Items ({state.itemCount}):</span>
                      <span>${state.total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between sans-label">
                      <span>Shipping:</span>
                      <span>Calculated at checkout</span>
                    </div>
                    <div className="border-t border-border pt-3">
                      <div className="flex justify-between sans-label text-lg font-bold">
                        <span>Total:</span>
                        <span>${state.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {state.total < MINIMUM_ORDER_AMOUNT ? (
                      <p className="text-sm text-muted-foreground text-center sans-label">
                        Add at least {formatPrice(MINIMUM_ORDER_AMOUNT, "usd")} to check out.
                      </p>
                    ) : !PAYPAL_CLIENT_ID ? (
                      <p className="text-sm text-destructive text-center sans-label">
                        PayPal checkout isn't configured yet.
                      </p>
                    ) : (
                      <PayPalScriptProvider options={{ clientId: PAYPAL_CLIENT_ID, currency: "USD" }}>
                        <PayPalButtons
                          style={{ layout: "vertical", label: "pay" }}
                          createOrder={createOrder}
                          onApprove={onApprove}
                          onError={onError}
                        />
                      </PayPalScriptProvider>
                    )}

                    <Button
                      onClick={clearCart}
                      variant="ghost"
                      className="w-full sans-label text-sm"
                    >
                      CLEAR CART
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Cart;
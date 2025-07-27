import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Starting payment creation process");

    const body = await req.json();
    console.log("Request body:", body);

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Handle both single product and cart-based checkout
    if (body.productId) {
      // Single product checkout (legacy support)
      const { productId } = body;
      
      if (!productId) {
        throw new Error("Product ID is required");
      }

      // Get product details from Supabase
      const { data: product, error: productError } = await supabaseClient
        .from("products")
        .select("*")
        .eq("id", productId)
        .eq("is_active", true)
        .single();

      if (productError || !product) {
        throw new Error("Product not found or inactive");
      }

      console.log("Product found:", product.name, "Price:", product.price);

      // Convert price to cents (Stripe expects cents)
      const priceInCents = Math.round(parseFloat(product.price) * 100);

      // Create checkout session for one-time payment
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: product.title || product.name,
                description: product.description || undefined,
                images: product.image_url ? [product.image_url] : undefined,
              },
              unit_amount: priceInCents,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${req.headers.get("origin")}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.get("origin")}/product/${productId}`,
        allow_promotion_codes: true,
        customer_email: body.customerEmail, // Include customer email if provided
      });

      console.log("Stripe session created:", session.id);

      return new Response(JSON.stringify({ url: session.url }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    } else if (body.cartItems) {
      // Cart-based checkout
      const { cartItems } = body;
      
      if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
        throw new Error("Cart items are required");
      }

      console.log("Cart items received:", cartItems);

      // Get all product details from Supabase
      const productIds = cartItems.map((item: any) => item.productId);
      const { data: products, error: productsError } = await supabaseClient
        .from("products")
        .select("*")
        .in("id", productIds)
        .eq("is_active", true);

      if (productsError) {
        console.error("Products fetch error:", productsError);
        throw new Error(`Products not found: ${productsError.message}`);
      }

      if (!products || products.length === 0) {
        throw new Error("No valid products found");
      }

      console.log("Products found:", products.length);

      // Create line items for Stripe
      const lineItems = cartItems.map((cartItem: any) => {
        const product = products.find(p => p.id === cartItem.productId);
        if (!product) {
          throw new Error(`Product not found: ${cartItem.productId}`);
        }

        const priceInCents = Math.round(parseFloat(product.price) * 100);
        
        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: product.title || product.name,
              description: product.description || undefined,
              images: product.image_url ? [product.image_url] : undefined,
            },
            unit_amount: priceInCents,
          },
          quantity: cartItem.quantity,
        };
      });

      console.log("Creating Stripe session with", lineItems.length, "line items");

      // Create checkout session for cart
      const session = await stripe.checkout.sessions.create({
        line_items: lineItems,
        mode: "payment",
        success_url: `${req.headers.get("origin")}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.get("origin")}/cart`,
        allow_promotion_codes: true,
        customer_email: body.customerEmail, // Include customer email if provided
      });

      console.log("Stripe session created:", session.id);

      return new Response(JSON.stringify({ url: session.url }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    } else {
      throw new Error("Either productId or cartItems must be provided");
    }
  } catch (error) {
    console.error("Payment creation error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  }
});
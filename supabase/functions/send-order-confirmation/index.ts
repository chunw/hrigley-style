import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OrderConfirmationRequest {
  customerEmail: string;
  orderReference: string;
  cartItems?: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  totalAmount?: number;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { customerEmail, orderReference, cartItems, totalAmount }: OrderConfirmationRequest = await req.json();

    console.log("Sending order confirmation to:", customerEmail, "Order:", orderReference);

    // Generate cart items HTML
    let cartItemsHtml = "";
    if (cartItems && cartItems.length > 0) {
      cartItemsHtml = `
        <h3 style="color: #333; margin: 20px 0 10px 0;">Order Items:</h3>
        <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 10px 0;">
          ${cartItems.map(item => `
            <div style="display: flex; justify-content: space-between; margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #eee;">
              <span>${item.name} (x${item.quantity})</span>
              <span>$${(item.price * item.quantity / 100).toFixed(2)}</span>
            </div>
          `).join('')}
          ${totalAmount ? `
            <div style="display: flex; justify-content: space-between; margin: 15px 0 0 0; padding: 10px 0; border-top: 2px solid #333; font-weight: bold;">
              <span>Total:</span>
              <span>$${(totalAmount / 100).toFixed(2)}</span>
            </div>
          ` : ''}
        </div>
      `;
    }

    const emailResponse = await resend.emails.send({
      from: "Chun Wang Shop <onboarding@resend.dev>",
      to: [customerEmail],
      subject: "Order Confirmation - Thank you for your purchase!",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #333; text-align: center; margin-bottom: 30px;">Thank you for your order!</h1>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h2 style="color: #333; margin: 0 0 15px 0;">Order Details</h2>
            <p><strong>Order Reference:</strong> ${orderReference}</p>
            <p><strong>Email:</strong> ${customerEmail}</p>
            <p><strong>Order Date:</strong> ${new Date().toLocaleDateString()}</p>
          </div>

          ${cartItemsHtml}

          <div style="margin: 30px 0; padding: 20px; background: #e8f5e8; border-radius: 10px;">
            <p style="margin: 0; color: #333;">Your payment has been processed successfully. You should see the charge on your payment method within 1-2 business days.</p>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <p style="color: #666;">Questions about your order? Contact us anytime!</p>
          </div>

          <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 12px;">
              © 2025 Chun Wang Shop<br>
              This is an automated email. Please do not reply.
            </p>
          </div>
        </div>
      `,
    });

    console.log("Order confirmation email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailId: emailResponse.data?.id }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending order confirmation email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
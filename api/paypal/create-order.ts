import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getAccessToken, PAYPAL_API_BASE } from "../_lib/paypal";

interface CartItemInput {
  id: string;
  name?: string;
  title?: string | null;
  price: number;
  currency?: string;
  quantity: number;
}

const MAX_QUANTITY_PER_ITEM = 50;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const items: CartItemInput[] = Array.isArray(req.body?.items) ? req.body.items : [];

    if (items.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    const currency = (items[0].currency || "USD").toUpperCase();

    for (const item of items) {
      if (!item.id || typeof item.price !== "number" || item.price <= 0) {
        return res.status(400).json({ error: `Invalid price for item: ${item.id}` });
      }
      if (!Number.isInteger(item.quantity) || item.quantity <= 0 || item.quantity > MAX_QUANTITY_PER_ITEM) {
        return res.status(400).json({ error: `Invalid quantity for item: ${item.id}` });
      }
      if ((item.currency || "USD").toUpperCase() !== currency) {
        return res.status(400).json({ error: "All cart items must share the same currency" });
      }
    }

    const itemTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const accessToken = await getAccessToken();

    const orderResponse = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: currency,
              value: itemTotal.toFixed(2),
              breakdown: {
                item_total: { currency_code: currency, value: itemTotal.toFixed(2) },
              },
            },
            items: items.map((item) => ({
              name: (item.title || item.name || item.id).slice(0, 127),
              unit_amount: { currency_code: currency, value: item.price.toFixed(2) },
              quantity: String(item.quantity),
            })),
          },
        ],
      }),
    });

    if (!orderResponse.ok) {
      const errorBody = await orderResponse.text();
      console.error("PayPal create order failed:", errorBody);
      return res.status(502).json({ error: "Failed to create PayPal order" });
    }

    const order = (await orderResponse.json()) as { id: string };
    return res.status(200).json({ id: order.id });
  } catch (error) {
    console.error("create-order error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getAccessToken, PAYPAL_API_BASE } from "../_lib/paypal";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { orderID } = req.body || {};
    if (!orderID || typeof orderID !== "string") {
      return res.status(400).json({ error: "Missing orderID" });
    }

    const accessToken = await getAccessToken();

    const captureResponse = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${orderID}/capture`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const captureData = await captureResponse.json();

    if (!captureResponse.ok) {
      console.error("PayPal capture failed:", captureData);
      return res.status(502).json({ error: "Failed to capture PayPal order" });
    }

    return res.status(200).json({
      status: captureData.status,
      id: captureData.id,
    });
  } catch (error) {
    console.error("capture-order error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";
import { directus } from "@/lib/directus-server";
import { readItems, updateItem } from "@directus/sdk";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    // Signature verification
    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const verified = expected === razorpay_signature;

    const client = await directus();

    // 1️⃣ Fetch order from Directus
    const orders = await client.request(
      readItems("orders" as any, {
        filter: { order_id: { _eq: razorpay_order_id } },
        limit: 1,
      })
    );

    const order = orders[0];
    if (!order) {
      console.error("Order not found in Directus");
      return res.status(404).json({ error: "Order not found" });
    }

    // 2️⃣ Update the record using its numeric ID
    await client.request(
      updateItem("orders", order.id, {
        payment_id: razorpay_payment_id,
        status: verified ? "paid" : "failed",
      })
    );

    return res.json({ success: verified });
  } catch (err: any) {
    console.error("VERIFY ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
}

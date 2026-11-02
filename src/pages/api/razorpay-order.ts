import type { NextApiRequest, NextApiResponse } from "next";
import Razorpay from "razorpay";
import { directus } from "@/lib/directus-server";
import { createItem } from "@directus/sdk";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  try {
    const { amount, email } = req.body;

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    const order = await razorpay.orders.create({
      amount: Number(amount) * 100,
      currency: "USD",
      receipt: `order_${Date.now()}`,
      notes: {
        email,
      },
    });

    // Insert into Directus via SDK (NOT fetch)
    const client = await directus();

    // Insert into Directus
    await client.request(
      createItem("orders", {
        order_id: order.id,
        email,
        amount: Number(amount),
        currency: order.currency,
        status: order.status,
        receipt: order.receipt,
        razorpay_meta: order, // store full metadata JSON
      })
    );

    return res.json({
      success: true,
      order,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err: any) {
    console.error("ORDER ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
}

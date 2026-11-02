// // import type { NextApiRequest, NextApiResponse } from "next";
// // import crypto from "crypto";
// // import getRawBody from "raw-body";
// // import { createDirectus, rest, readItems, updateItem } from "@directus/sdk";
// // import type { OrdersCollection } from "@/types/orders";

// // export const config = {
// //   api: {
// //     bodyParser: false,
// //   },
// // };

// // export default async function handler(
// //   req: NextApiRequest,
// //   res: NextApiResponse
// // ) {
// //   try {
// //     const rawBody = await getRawBody(req);

// //     const signature = req.headers["x-razorpay-signature"] as string;
// //     const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET!;

// //     // Verify Razorpay webhook signature
// //     const expectedSignature = crypto
// //       .createHmac("sha256", webhookSecret)
// //       .update(rawBody)
// //       .digest("hex");

// //     if (expectedSignature !== signature) {
// //       return res.status(400).json({ error: "Invalid Razorpay signature" });
// //     }

// //     const body = JSON.parse(rawBody.toString());

// //     if (body.event === "payment.captured") {
// //       const payment = body.payload.payment.entity;
// //       const orderId = payment.order_id;
// //       const paymentId = payment.id;

// //       const client = createDirectus<OrdersCollection>(
// //         process.env.PUBLIC_DIRECTUS_URL!
// //       ).with(rest());

// //       // Fetch the order
// //       const [orderRecord] = await client.request(
// //         readItems("orders", {
// //           filter: { order_id: { _eq: orderId } },
// //           limit: 1,
// //         })
// //       );

// //       if (!orderRecord) {
// //         return res.status(404).json({ error: "Order not found in Directus" });
// //       }

// //       // Update payment status
// //       await client.request(
// //         updateItem("orders", orderRecord.id as string, {
// //           payment_id: paymentId,
// //           status: "paid",
// //         })
// //       );
// //     }

// //     return res.json({ success: true });
// //   } catch (err: any) {
// //     console.error("WEBHOOK ERROR:", err);
// //     return res.status(500).json({ error: err.message });
// //   }
// // }

// // src/pages/api/razorpay-webhook.ts
// import type { NextApiRequest, NextApiResponse } from "next";
// import crypto from "crypto";
// import getRawBody from "raw-body";

// export const config = {
//   api: {
//     bodyParser: false, // required for signature verification
//   },
// };

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method !== "POST") return res.status(405).send("Method not allowed");

//   try {
//     const raw = await getRawBody(req);
//     const signature = (req.headers["x-razorpay-signature"] || "") as string;
//     const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET!;
//     if (!webhookSecret) {
//       console.error("No RAZORPAY_WEBHOOK_SECRET configured");
//       return res.status(500).send("Server misconfigured");
//     }

//     const expected = crypto.createHmac("sha256", webhookSecret).update(raw).digest("hex");
//     if (expected !== signature) {
//       console.warn("Invalid webhook signature");
//       return res.status(400).json({ error: "Invalid signature" });
//     }

//     const body = JSON.parse(raw.toString());
//     // Handle only payment.captured (or whichever event you care about)
//     if (body.event === "payment.captured") {
//       const payment = body.payload.payment.entity;
//       const orderId = payment.order_id;
//       const paymentId = payment.id;

//       // 1) Find the Directus record for this order
//       const q = new URLSearchParams();
//       q.set("filter[order_id][_eq]", orderId);
//       q.set("limit", "1");

//       const getRes = await fetch(`${process.env.DIRECTUS_URL}/items/orders?${q.toString()}`, {
//         headers: {
//           Authorization: `Bearer ${process.env.DIRECTUS_ADMIN_TOKEN}`,
//         },
//       });

//       const getJson = await getRes.json();
//       const data = getJson?.data ?? getJson; // handle Directus shape
//       const orderRecord = Array.isArray(data) ? data[0] : null;
//       if (!orderRecord) {
//         console.warn("Order not found in Directus for order_id:", orderId);
//         return res.status(404).json({ error: "Order not found" });
//       }

//       // 2) Update the Directus item using its primary key id
//       const itemId = orderRecord?.id;
//       await fetch(`${process.env.DIRECTUS_URL}/items/orders/${itemId}`, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${process.env.DIRECTUS_ADMIN_TOKEN}`,
//         },
//         body: JSON.stringify({
//           payment_id: paymentId,
//           status: "paid",
//         }),
//       });

//       // (Optional) respond to Razorpay quickly
//       return res.status(200).json({ success: true });
//     }

//     // Other events: acknowledge
//     return res.status(200).json({ received: true });
//   } catch (err: any) {
//     console.error("WEBHOOK ERROR:", err);
//     return res.status(500).json({ error: err.message || String(err) });
//   }
// }

// src/pages/api/razorpay-webhook.ts
import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";
import getRawBody from "raw-body";

import { directus } from "@/lib/directus-server"; // <-- your helper
import { readItems, updateItem } from "@directus/sdk";

export const config = {
  api: {
    bodyParser: false, // required for Razorpay verification
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).send("Method not allowed");

  try {
    const raw = await getRawBody(req);

    const signature = req.headers["x-razorpay-signature"] as string;
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET!;

    const expected = crypto
      .createHmac("sha256", secret)
      .update(raw)
      .digest("hex");

    if (expected !== signature) {
      console.warn("❌ Invalid webhook signature");
      return res.status(400).json({ error: "Invalid signature" });
    }

    const body = JSON.parse(raw.toString());
    if (body.event !== "payment.captured") {
      return res.status(200).json({ received: true });
    }

    // -------------------------
    // 1️⃣ Extract payment data
    // -------------------------
    const payment = body.payload.payment.entity;
    const orderId = payment.order_id;
    const paymentId = payment.id;

    // -------------------------
    // 2️⃣ Login to Directus
    // -------------------------
    const client = await directus();

    // -------------------------
    // 3️⃣ Find the order
    // -------------------------
    const orders = await client.request(
      readItems("orders" as any, {
        filter: { order_id: { _eq: orderId } },
        limit: 1,
      })
    );

    if (!orders.length) {
      console.warn("❌ Order not found in Directus:", orderId);
      return res.status(404).json({ error: "Order not found" });
    }

    const order = orders[0];

    // -------------------------
    // 4️⃣ Update the order
    // -------------------------
    await client.request(
      updateItem("orders", order.id, {
        payment_id: paymentId,
        status: "paid",
      })
    );

    console.log("✅ Order updated in Directus");

    return res.status(200).json({ success: true });
  } catch (err: any) {
    console.error("WEBHOOK ERROR:", err);
    return res.status(500).json({ error: err.message || String(err) });
  }
}

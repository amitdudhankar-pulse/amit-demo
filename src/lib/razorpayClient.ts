// export const startPayment = async ({
//   amount,
//   email,
//   planName,
//   onSuccess
// }: {
//   amount: number;
//   email: string;
//   planName: string;
//   onSuccess: () => void;
// }) => {
//   const res = await fetch("/api/razorpay-order", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ amount, email }),
//   });
//   const data = await res.json();

//   const options = {
//     key: data.key,
//     amount: data.order.amount,
//     currency: "USD",
//     name: planName,
//     order_id: data.order.id,
//     handler: async function (response: any) {
//       const res = await fetch("/api/razorpay-verify", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(response),
//       });

//       const verify = await res.json();
//       if (!verify.success) {
//         alert("Payment failed!");
//         return;
//       }

//       onSuccess();
//     },
//   };

//   const rzp = new (window as any).Razorpay(options);
//   rzp.open();
// };


export const startPayment = async ({
  amount,
  email,
  planName,
  onSuccess
}: {
  amount: number;   // price in dollars (e.g. 29)
  email: string;
  planName: string;
  onSuccess: () => void;
}) => {
  // convert dollars → cents
  const amountInCents = amount; 

  // Create Razorpay order
  const res = await fetch("/api/razorpay-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      amount: amountInCents,
      email,
      currency: "USD" // <-- REQUIRED
    }),
  });

  const data = await res.json();

  if (!data.success) {
    alert("Failed to create Razorpay order");
    return;
  }

  // Razorpay Checkout Options
  const options = {
    key: data.key,
    amount: data.order.amount,
    currency: "USD", // <-- REQUIRED here
    name: planName,
    description: "GroupifyAI Tool Listing Plan",
    order_id: data.order.id,

    handler: async function (response: any) {
      const verifyRes = await fetch("/api/razorpay-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(response),
      });

      const verify = await verifyRes.json();

      if (!verify.success) {
        alert("Payment failed!");
        return;
      }

      // Payment success callback
      onSuccess();
    },
  };

  const rzp = new (window as any).Razorpay(options);
  rzp.open();
};

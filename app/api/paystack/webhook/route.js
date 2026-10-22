import { NextResponse } from "next/server";
import { isValidWebhookSignature } from "@/lib/paystack";
import { confirmPaystackPayment } from "@/lib/orders";

// Paystack calls this server-to-server, even if the buyer closes the tab.
// Set it in Paystack Dashboard -> Settings -> API Keys & Webhooks:
//   https://<your-domain>/api/paystack/webhook
export async function POST(request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-paystack-signature");

  if (!isValidWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  }

  try {
    const event = JSON.parse(rawBody);
    if (event.event === "charge.success" && event.data?.reference) {
      const result = await confirmPaystackPayment(event.data.reference);
      if (!result.ok) console.warn("Paystack webhook:", result.message);
    }
  } catch (error) {
    console.error("Paystack webhook error:", error);
    // Tell Paystack to retry later
    return NextResponse.json({ error: "processing failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

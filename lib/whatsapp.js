import { prisma } from "@/src/db";
import {
  MESSAGE_STATUSES,
  messageParts,
  normalizePhone,
} from "@/lib/customerMessages";

/*
 * Automatic WhatsApp updates to customers via the official
 * WhatsApp Business Cloud API (Meta). Optional — only runs when set up:
 *
 *   WHATSAPP_TOKEN=EAAG...            (permanent System User token)
 *   WHATSAPP_PHONE_NUMBER_ID=1234...  (from WhatsApp > API Setup)
 *
 * Meta only lets businesses start a conversation with an APPROVED
 * template, so create these three (category: Utility, language: English)
 * in WhatsApp Manager > Message templates — wording in the setup guide:
 *   order_processing        {{1}} first name, {{2}} order ref
 *   order_out_for_delivery  {{1}} first name, {{2}} order ref, {{3}} payment note
 *   order_delivered         {{1}} first name, {{2}} order ref
 */

const TEMPLATES = {
  PROCESSING: process.env.WHATSAPP_TEMPLATE_PROCESSING || "order_processing",
  OUT_FOR_DELIVERY:
    process.env.WHATSAPP_TEMPLATE_OUT_FOR_DELIVERY || "order_out_for_delivery",
  DELIVERED: process.env.WHATSAPP_TEMPLATE_DELIVERED || "order_delivered",
};

export const whatsappAutoEnabled = () =>
  Boolean(process.env.WHATSAPP_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID);

/**
 * Send the customer the update for this status.
 * Returns { sent: boolean, reason? } and never throws.
 */
export async function sendCustomerWhatsApp(orderId, status) {
  try {
    if (status === "SHIPPED") status = "OUT_FOR_DELIVERY";
    if (!MESSAGE_STATUSES.includes(status)) return { sent: false, reason: "no message for status" };
    if (!whatsappAutoEnabled()) return { sent: false, reason: "not configured" };

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { address: true },
    });
    const to = normalizePhone(order?.address?.phone);
    if (!to) return { sent: false, reason: "no valid phone number" };

    const p = messageParts(order);
    const params =
      status === "OUT_FOR_DELIVERY"
        ? [p.firstName, p.ref, p.paymentNote]
        : [p.firstName, p.ref];

    const version = process.env.WHATSAPP_API_VERSION || "v21.0";
    const res = await fetch(
      `https://graph.facebook.com/${version}/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to,
          type: "template",
          template: {
            name: TEMPLATES[status],
            language: { code: process.env.WHATSAPP_TEMPLATE_LANG || "en" },
            components: [
              {
                type: "body",
                parameters: params.map((text) => ({ type: "text", text })),
              },
            ],
          },
        }),
      }
    );
    if (!res.ok) {
      const err = await res.text();
      console.error("WhatsApp send failed:", err);
      return { sent: false, reason: "WhatsApp API error" };
    }
    return { sent: true };
  } catch (error) {
    console.error("WhatsApp send error:", error);
    return { sent: false, reason: error.message };
  }
}

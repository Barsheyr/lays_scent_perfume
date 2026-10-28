// Customer WhatsApp messages for each order status.
// Edit the wording here — it's used by both the "Send on WhatsApp" button
// and the automatic sender. Safe to import on the client and the server.

import { siteUrl } from "@/lib/siteUrl";

export const SHOP_NAME = "Layah's Scent";

const naira = (n) =>
  "₦" + Number(n || 0).toLocaleString("en-NG", { maximumFractionDigits: 2 });

// Statuses that send the customer a message
export const MESSAGE_STATUSES = ["PROCESSING", "OUT_FOR_DELIVERY", "DELIVERED"];

// Normalise a Nigerian phone number to WhatsApp format: 2348012345678
export function normalizePhone(raw) {
  if (!raw) return null;
  let d = String(raw).replace(/\D/g, "");
  if (d.startsWith("00")) d = d.slice(2);
  if (d.startsWith("0") && d.length === 11) d = "234" + d.slice(1);
  else if (d.length === 10 && !d.startsWith("234")) d = "234" + d;
  return d.length >= 10 ? d : null;
}

// The pieces each message is built from (also used as WhatsApp template variables)
export function messageParts(order) {
  const fullName = order.address?.name || order.user?.name || "";
  const firstName = fullName.trim().split(/\s+/)[0] || "there";
  const ref = "#" + order.id.slice(-6).toUpperCase();
  const items = (order.orderItems || [])
    .map((i) => `${i.quantity} × ${i.product?.name || "item"}`)
    .join(", ");
  const paymentNote =
    order.paymentMethod === "COD" && !order.isPaid
      ? `Please have ${naira(order.total)} ready to pay on delivery.`
      : "Your payment has been received, so there's nothing to pay on delivery.";
  const site = siteUrl();
  return { firstName, ref, items, total: naira(order.total), paymentNote, site };
}

export function customerMessage(order, status) {
  const p = messageParts(order);

  switch (status) {
    case "PROCESSING":
      return (
        `Hi ${p.firstName} 👋\n\n` +
        `Thank you for shopping with ${SHOP_NAME}! 💐\n\n` +
        `We've received your order ${p.ref}${p.items ? ` (${p.items})` : ""} and we're carefully preparing it for you.\n\n` +
        `We'll message you again as soon as it's on its way. Any questions? Just reply here — we're happy to help.`
      );

    case "OUT_FOR_DELIVERY":
    case "SHIPPED":
      return (
        `Good news, ${p.firstName}! 🚚✨\n\n` +
        `Your ${SHOP_NAME} order ${p.ref} is out for delivery and should get to you within the next 2 days.\n\n` +
        `Our rider will call you before arriving, so please keep your phone close. ${p.paymentNote}\n\n` +
        `We can't wait for you to enjoy your new scent!`
      );

    case "DELIVERED":
      return (
        `Hi ${p.firstName}, your order ${p.ref} has been delivered 🎉\n\n` +
        `Thank you for choosing ${SHOP_NAME} — we hope you love your new fragrance! 💛\n\n` +
        (p.site
          ? `If you have a minute, we'd love a quick review: ${p.site}/orders\n\n`
          : "") +
        `When you're ready for your next signature scent, we'll be right here. See you again soon! ✨`
      );

    default:
      return null;
  }
}

// wa.me link that opens WhatsApp with the message already typed
export function whatsappLink(order, status) {
  const phone = normalizePhone(order.address?.phone);
  const text = customerMessage(order, status);
  if (!phone || !text) return null;
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

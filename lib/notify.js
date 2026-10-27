import { prisma } from "@/src/db";

/*
 * New-order alerts for the shop owner / sellers.
 * Each channel is optional — it only runs if its env vars are set.
 *
 *  Telegram (free, instant on your phone):
 *    TELEGRAM_BOT_TOKEN=123456:ABC...
 *    TELEGRAM_CHAT_IDS=111111111,222222222   (one per person to alert)
 *
 *  Email via Resend (free tier):
 *    RESEND_API_KEY=re_...
 *    NOTIFY_EMAILS=you@gmail.com,seller@gmail.com
 *    NOTIFY_FROM="Layah's Scent <onboarding@resend.dev>"   (optional)
 */

const naira = (n) =>
  "₦" + Number(n || 0).toLocaleString("en-NG", { maximumFractionDigits: 2 });

const list = (v) =>
  (v || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

const esc = (s) =>
  String(s ?? "").replace(/[&<>"]/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]
  );

async function sendTelegram(html) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chats = list(process.env.TELEGRAM_CHAT_IDS);
  if (!token || chats.length === 0) return;
  await Promise.all(
    chats.map(async (chat_id) => {
      const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id,
          text: html,
          parse_mode: "HTML",
          disable_web_page_preview: true,
        }),
      });
      if (!res.ok) console.error("Telegram notify failed:", await res.text());
    })
  );
}

async function sendEmail(subject, html) {
  const key = process.env.RESEND_API_KEY;
  const to = list(process.env.NOTIFY_EMAILS);
  if (!key || to.length === 0) return;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.NOTIFY_FROM || "Layah's Scent <onboarding@resend.dev>",
      to,
      subject,
      html,
    }),
  });
  if (!res.ok) console.error("Email notify failed:", await res.text());
}

/**
 * Tell the owner/sellers about new orders. Never throws — a failed
 * notification must not break checkout.
 */
export async function notifyNewOrders(orderIds) {
  try {
    if (!orderIds?.length) return;
    const orders = await prisma.order.findMany({
      where: { id: { in: orderIds } },
      include: {
        address: true,
        orderItems: { include: { product: { select: { name: true } } } },
      },
    });

    const site = process.env.NEXT_PUBLIC_SITE_URL || "";
    const jobs = [];

    for (const o of orders) {
      const ref = o.id.slice(-6).toUpperCase();
      const pay =
        o.paymentMethod === "PAYSTACK" ? "Paid online (Paystack) ✅" : "Cash on delivery 💵";
      const items = o.orderItems
        .map((i) => `${i.quantity} × ${i.product?.name || "Product"}`)
        .join("\n");
      const a = o.address || {};
      const link = site ? `${site}/admin/orders?open=${o.id}` : "";

      const tg =
        `🛍 <b>New order #${esc(ref)}</b> — ${esc(naira(o.total))}\n` +
        `${esc(pay)}\n\n` +
        `${esc(items)}\n\n` +
        `👤 ${esc(a.name)}\n📞 ${esc(a.phone)}\n📍 ${esc(
          [a.street, a.city, a.state].filter(Boolean).join(", ")
        )}` +
        (link ? `\n\n<a href="${esc(link)}">Open in dashboard →</a>` : "");

      const mail = `
        <div style="font-family:Arial,sans-serif;max-width:520px">
          <h2 style="margin:0 0 4px">New order #${esc(ref)}</h2>
          <p style="margin:0 0 16px;color:#555">${esc(naira(o.total))} · ${esc(pay)}</p>
          <p style="white-space:pre-line">${esc(items)}</p>
          <p><b>${esc(a.name)}</b><br>${esc(a.phone)}<br>${esc(
            [a.street, a.city, a.state].filter(Boolean).join(", ")
          )}</p>
          ${
            link
              ? `<p><a href="${esc(link)}" style="background:#c97b63;color:#fff;padding:10px 18px;border-radius:999px;text-decoration:none">Open order</a></p>`
              : ""
          }
        </div>`;

      jobs.push(sendTelegram(tg));
      jobs.push(sendEmail(`New order #${ref} — ${naira(o.total)}`, mail));
    }

    const results = await Promise.allSettled(jobs);
    results
      .filter((r) => r.status === "rejected")
      .forEach((r) => console.error("Notify error:", r.reason));
  } catch (error) {
    console.error("notifyNewOrders failed:", error);
  }
}

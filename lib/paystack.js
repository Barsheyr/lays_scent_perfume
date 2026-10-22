import crypto from "crypto";

const PAYSTACK_BASE = "https://api.paystack.co";

function secretKey() {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) throw new Error("PAYSTACK_SECRET_KEY is not set");
  return key;
}

// Naira -> kobo (Paystack works in the smallest unit)
export const toKobo = (naira) => Math.round(Number(naira) * 100);

export function newReference() {
  return `LS-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;
}

// Start a payment. Returns { authorization_url, access_code, reference }
export async function initializeTransaction({
  email,
  amount,
  reference,
  callbackUrl,
  metadata,
}) {
  const res = await fetch(`${PAYSTACK_BASE}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      amount: toKobo(amount),
      currency: "NGN",
      reference,
      callback_url: callbackUrl,
      metadata,
    }),
  });
  const json = await res.json();
  if (!res.ok || !json.status) {
    throw new Error(json.message || "Could not start Paystack payment");
  }
  return json.data;
}

// Ask Paystack what really happened to a payment
export async function verifyTransaction(reference) {
  const res = await fetch(
    `${PAYSTACK_BASE}/transaction/verify/${encodeURIComponent(reference)}`,
    { headers: { Authorization: `Bearer ${secretKey()}` } }
  );
  const json = await res.json();
  if (!res.ok || !json.status) {
    throw new Error(json.message || "Could not verify payment");
  }
  return json.data; // data.status === "success" when paid
}

// Confirm a webhook really came from Paystack
export function isValidWebhookSignature(rawBody, signature) {
  if (!signature) return false;
  const hash = crypto
    .createHmac("sha512", secretKey())
    .update(rawBody)
    .digest("hex");
  const a = Buffer.from(hash);
  const b = Buffer.from(signature);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

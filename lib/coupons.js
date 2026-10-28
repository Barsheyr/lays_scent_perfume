import { prisma } from "@/src/db";

// Orders that "use up" a coupon: everything except cancelled orders and
// Paystack checkouts that were never paid.
const COUNTED = { notIn: ["CANCELLED", "PENDING_PAYMENT"] };

export const normalizeCode = (code) =>
  String(code || "").trim().toUpperCase().replace(/\s+/g, "");

export const applyDiscount = (amount, percent) =>
  Math.round(amount * (1 - percent / 100) * 100) / 100;

/**
 * Can this customer use this code right now?
 * Returns { ok: true, coupon } or { ok: false, error }
 */
export async function checkCoupon(rawCode, userId, db = prisma) {
  const code = normalizeCode(rawCode);
  if (!code) return { ok: false, error: "Enter a coupon code" };

  const coupon = await db.coupon.findUnique({ where: { code } });
  if (!coupon || !coupon.isActive) {
    return { ok: false, error: "This coupon code isn't valid" };
  }
  if (new Date(coupon.expiresAt) < new Date()) {
    return { ok: false, error: "This coupon has expired" };
  }

  if (coupon.maxUses != null) {
    const used = await db.order.count({
      where: { couponCode: code, status: COUNTED },
    });
    if (used >= coupon.maxUses) {
      return { ok: false, error: "Sorry, this coupon has been fully claimed" };
    }
  }

  if (userId && coupon.oncePerCustomer) {
    const mine = await db.order.count({
      where: { couponCode: code, userId, status: COUNTED },
    });
    if (mine > 0) {
      return { ok: false, error: "You've already used this coupon" };
    }
  }

  if (userId && coupon.forNewUser) {
    const previous = await db.order.count({
      where: { userId, status: COUNTED },
    });
    if (previous > 0) {
      return { ok: false, error: "This coupon is for first orders only" };
    }
  }

  return { ok: true, coupon };
}

// How many times each code has been used
export async function couponUsage(codes) {
  if (!codes.length) return {};
  const rows = await prisma.order.groupBy({
    by: ["couponCode"],
    where: { couponCode: { in: codes }, status: COUNTED },
    _count: { _all: true },
  });
  return Object.fromEntries(rows.map((r) => [r.couponCode, r._count._all]));
}

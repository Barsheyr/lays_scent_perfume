import { prisma } from "@/src/db";
import { toKobo, verifyTransaction } from "@/lib/paystack";
import { notifyNewOrders } from "@/lib/notify";
import { sendCustomerWhatsApp } from "@/lib/whatsapp";

export const ORDER_STATUSES = [
  "PENDING_PAYMENT",
  "ORDER_PLACED",
  "PROCESSING",
  "SHIPPED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
];

// Statuses the admin can move an order to
export const ADMIN_SETTABLE_STATUSES = [
  "ORDER_PLACED",
  "PROCESSING",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
];

// Take sold bottles out of stock (only for products whose stock is tracked)
async function deductStock(tx, order) {
  for (const item of order.orderItems) {
    const product = await tx.product.findUnique({
      where: { id: item.productId },
    });
    if (!product || !product.trackStock) continue;

    const newStock = product.stock - item.quantity;
    await tx.product.update({
      where: { id: product.id },
      data: { stock: newStock, inStock: newStock > 0 },
    });
    await tx.stockMovement.create({
      data: {
        productId: product.id,
        type: "SALE",
        quantity: -item.quantity,
        unitCost: item.costPrice || product.costPrice,
        orderId: order.id,
        note: `Order ${order.id.slice(-6).toUpperCase()}`,
      },
    });
  }
  await tx.order.update({
    where: { id: order.id },
    data: { stockDeducted: true },
  });
}

// Put bottles back when an order is cancelled
async function restoreStock(tx, order) {
  for (const item of order.orderItems) {
    const product = await tx.product.findUnique({
      where: { id: item.productId },
    });
    if (!product || !product.trackStock) continue;

    const newStock = product.stock + item.quantity;
    await tx.product.update({
      where: { id: product.id },
      data: { stock: newStock, inStock: newStock > 0 },
    });
    await tx.stockMovement.create({
      data: {
        productId: product.id,
        type: "RETURN",
        quantity: item.quantity,
        unitCost: item.costPrice || product.costPrice,
        orderId: order.id,
        note: `Cancelled order ${order.id.slice(-6).toUpperCase()}`,
      },
    });
  }
  await tx.order.update({
    where: { id: order.id },
    data: { stockDeducted: false },
  });
}

// Called right after a COD order is created
export async function commitOrderStock(orderId) {
  return prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: orderId },
      include: { orderItems: true },
    });
    if (order && !order.stockDeducted) await deductStock(tx, order);
  });
}

// Change an order's status and keep stock in sync
export async function changeOrderStatus(orderId, status, { storeId } = {}) {
  if (!ADMIN_SETTABLE_STATUSES.includes(status) && status !== "SHIPPED") {
    throw new Error(`Invalid status: ${status}`);
  }

  let previousStatus;
  const updated = await prisma.$transaction(async (tx) => {
    const order = await tx.order.findFirst({
      where: { id: orderId, ...(storeId ? { storeId } : {}) },
      include: { orderItems: true },
    });
    if (!order) throw new Error("Order not found");
    if (
      order.paymentMethod === "PAYSTACK" &&
      !order.isPaid &&
      status !== "CANCELLED"
    ) {
      throw new Error("This Paystack order has not been paid yet");
    }
    previousStatus = order.status;

    if (status === "CANCELLED" && order.stockDeducted) {
      await restoreStock(tx, order);
    }
    if (
      order.status === "CANCELLED" &&
      status !== "CANCELLED" &&
      !order.stockDeducted
    ) {
      await deductStock(tx, order);
    }

    const data = { status };
    // Cash on delivery is paid when it's delivered
    if (status === "DELIVERED" && order.paymentMethod === "COD") {
      data.isPaid = true;
      data.paidAt = order.paidAt || new Date();
    }

    return tx.order.update({ where: { id: order.id }, data });
  });

  // Message the customer on WhatsApp (only if the status actually changed)
  const whatsapp =
    previousStatus !== status
      ? await sendCustomerWhatsApp(updated.id, status)
      : { sent: false, reason: "status unchanged" };

  return { ...updated, whatsapp };
}

/**
 * Confirm a Paystack payment. Safe to call many times (callback page +
 * webhook both call it) — only the first call does the work.
 * Returns { ok, orderIds, message }
 */
export async function confirmPaystackPayment(reference) {
  const orders = await prisma.order.findMany({
    where: { paymentRef: reference, paymentMethod: "PAYSTACK" },
    include: { orderItems: true },
  });
  if (orders.length === 0) {
    return { ok: false, message: "No order found for this payment" };
  }

  const orderIds = orders.map((o) => o.id);
  if (orders.every((o) => o.isPaid)) {
    return { ok: true, orderIds, message: "Payment already confirmed" };
  }

  const tx = await verifyTransaction(reference);
  if (tx.status !== "success") {
    return { ok: false, orderIds, message: `Payment ${tx.status}` };
  }

  const expected = toKobo(orders.reduce((sum, o) => sum + o.total, 0));
  if (Number(tx.amount) < expected || tx.currency !== "NGN") {
    return { ok: false, orderIds, message: "Amount paid does not match order" };
  }

  const newlyPaid = [];
  await prisma.$transaction(async (db) => {
    for (const order of orders) {
      // Only the request that flips isPaid gets to deduct stock
      const flipped = await db.order.updateMany({
        where: { id: order.id, isPaid: false },
        data: {
          isPaid: true,
          paidAt: new Date(tx.paid_at || Date.now()),
          status: "ORDER_PLACED",
        },
      });
      if (flipped.count === 1) {
        newlyPaid.push(order.id);
        if (!order.stockDeducted) await deductStock(db, order);
      }
    }
    // Empty the buyer's cart now that they've paid
    await db.user.update({
      where: { id: orders[0].userId },
      data: { cart: {} },
    });
  });

  // Alert the shop only once per order (callback + webhook both land here)
  if (newlyPaid.length) await notifyNewOrders(newlyPaid);

  return { ok: true, orderIds, message: "Payment confirmed" };
}

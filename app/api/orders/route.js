import { prisma } from "@/src/db";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { commitOrderStock } from "@/lib/orders";
import { initializeTransaction, newReference } from "@/lib/paystack";

export async function POST(request) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json({ error: "not authorized" }, { status: 401 });
    }

    const body = await request.json();

    const { addressId, items, paymentMethod } = body;

    if (!addressId) {
      return NextResponse.json({ error: "missing addressId" }, { status: 400 });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "missing items or items is not an array" },
        { status: 400 }
      );
    }

    if (!paymentMethod) {
      return NextResponse.json(
        { error: "payment method is required" },
        { status: 400 }
      );
    }

    if (!["COD", "PAYSTACK"].includes(paymentMethod)) {
      return NextResponse.json(
        { error: "payment method must be COD or PAYSTACK" },
        { status: 400 }
      );
    }

    const address = await prisma.address.findFirst({
      where: { id: addressId, userId },
    });

    if (!address) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    const ordersByStore = new Map();

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.id },
      });

      if (!product) {
        return NextResponse.json(
          { error: `Product not found: ${item.id}` },
          { status: 404 }
        );
      }

      const quantity = Number(item.quantity);
      if (!Number.isInteger(quantity) || quantity < 1) {
        return NextResponse.json(
          { error: `Invalid quantity for ${product.name}` },
          { status: 400 }
        );
      }

      if (!product.inStock || (product.trackStock && product.stock < quantity)) {
        return NextResponse.json(
          {
            error: product.trackStock && product.stock > 0
              ? `Only ${product.stock} left of ${product.name}`
              : `${product.name} is out of stock`,
          },
          { status: 400 }
        );
      }

      const storeId = product.storeId;
      if (!ordersByStore.has(storeId)) {
        ordersByStore.set(storeId, []);
      }
      ordersByStore.get(storeId).push({
        id: product.id,
        quantity,
        price: product.price,
        costPrice: product.costPrice,
      });
    }

    const isPaystack = paymentMethod === "PAYSTACK";
    const reference = isPaystack ? newReference() : null;
    const orderIds = [];
    let grandTotal = 0;

    for (const [storeId, sellerItems] of ordersByStore.entries()) {
      const total = sellerItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );

      const orderData = {
        userId,
        storeId,
        addressId,
        total: parseFloat(total.toFixed(2)),
        paymentMethod,
        status: isPaystack ? "PENDING_PAYMENT" : "ORDER_PLACED",
        paymentRef: reference,
        orderItems: {
          create: sellerItems.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
            costPrice: item.costPrice,
          })),
        },
      };

      const order = await prisma.order.create({
        data: orderData,
      });

      orderIds.push(order.id);
      grandTotal += orderData.total;
    }

    // Paystack: send the buyer to Paystack. Stock + cart are handled once
    // payment is confirmed (see lib/orders.js -> confirmPaystackPayment)
    if (isPaystack) {
      const origin =
        process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
      try {
        const payment = await initializeTransaction({
          email: address.email,
          amount: grandTotal,
          reference,
          callbackUrl: `${origin}/payment/verify`,
          metadata: { orderIds, userId },
        });
        return NextResponse.json({
          message: "Redirecting to Paystack",
          orderIds,
          reference,
          authorizationUrl: payment.authorization_url,
        });
      } catch (err) {
        await prisma.order.updateMany({
          where: { id: { in: orderIds } },
          data: { status: "CANCELLED" },
        });
        throw err;
      }
    }

    // Cash on delivery: take the bottles out of stock now
    for (const id of orderIds) await commitOrderStock(id);

    await prisma.user.update({
      where: { id: userId },
      data: { cart: {} },
    });

    return NextResponse.json({
      message: "Order placed successfully",
      orderIds,
    });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to place order" },
      { status: 400 }
    );
  }
}

export async function GET(request) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json({ error: "not authorized" }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: {
        userId,
        status: { not: "PENDING_PAYMENT" },
      },
      include: {
        orderItems: { include: { product: true } },
        address: true,
        store: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch orders" },
      { status: 400 }
    );
  }
}

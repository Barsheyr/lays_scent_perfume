import { prisma } from "@/src/db";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

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

    if (paymentMethod !== "COD") {
      return NextResponse.json(
        { error: "only COD payment method is currently supported" },
        { status: 400 }
      );
    }

    const address = await prisma.address.findUnique({
      where: { id: addressId },
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

      const storeId = product.storeId;
      if (!ordersByStore.has(storeId)) {
        ordersByStore.set(storeId, []);
      }
      ordersByStore.get(storeId).push({ ...item, price: product.price });
    }

    const orderIds = [];

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
        orderItems: {
          create: sellerItems.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      };

      const order = await prisma.order.create({
        data: orderData,
      });

      orderIds.push(order.id);
    }

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

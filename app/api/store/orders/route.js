import authSeller from "@/middleware/authSeller";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/src/db";
import { changeOrderStatus } from "@/lib/orders";

// update seller order
export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    const storeId = await authSeller(userId);

    if (!storeId) {
      return NextResponse.json({ error: "not authorized" }, { status: 401 });
    }

    const { orderId, status } = await request.json();

    await changeOrderStatus(orderId, status, { storeId });

    return NextResponse.json({ message: "Order Status updated" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error.message || "Could not update order status" },
      { status: 400 }
    );
  }
}

// Get all orders for a seller
export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    const storeId = await authSeller(userId);

    if (!storeId) {
      return NextResponse.json({ error: "not authorized" }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: { storeId, status: { not: "PENDING_PAYMENT" } },
      include: {
        user: true,
        address: true,
        orderItems: { include: { product: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error.code || error.message },
      { status: 400 }
    );
  }
}

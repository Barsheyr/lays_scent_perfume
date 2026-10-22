import { prisma } from "@/src/db";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminGuard";
import { changeOrderStatus } from "@/lib/orders";

// All orders, newest first
export async function GET(request) {
  try {
    if (!(await requireAdmin(request))) {
      return NextResponse.json({ error: "not authorized" }, { status: 401 });
    }
    const orders = await prisma.order.findMany({
      include: {
        user: { select: { name: true, email: true } },
        address: true,
        orderItems: {
          include: { product: { select: { name: true, images: true } } },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ orders });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// Move an order along: { orderId, status }
export async function POST(request) {
  try {
    if (!(await requireAdmin(request))) {
      return NextResponse.json({ error: "not authorized" }, { status: 401 });
    }
    const { orderId, status } = await request.json();
    if (!orderId || !status) {
      return NextResponse.json(
        { error: "orderId and status are required" },
        { status: 400 }
      );
    }
    const order = await changeOrderStatus(orderId, status);
    return NextResponse.json({ message: "Order updated", order });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

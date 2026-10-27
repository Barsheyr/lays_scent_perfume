import { prisma } from "@/src/db";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminGuard";

// Lightweight endpoint the admin sidebar polls for new orders
export async function GET(request) {
  try {
    if (!(await requireAdmin(request))) {
      return NextResponse.json({ error: "not authorized" }, { status: 401 });
    }
    const [needsAction, latest] = await Promise.all([
      prisma.order.count({ where: { status: "ORDER_PLACED" } }),
      prisma.order.findMany({
        where: { status: { not: "PENDING_PAYMENT" } },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          createdAt: true,
          total: true,
          paymentMethod: true,
          address: { select: { name: true } },
        },
      }),
    ]);
    return NextResponse.json({ needsAction, latest });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

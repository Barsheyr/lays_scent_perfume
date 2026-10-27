import { prisma } from "@/src/db";
import { NextResponse } from "next/server";
import { requireAdmin, rangeStart } from "@/lib/adminGuard";

const IN_PROGRESS = ["ORDER_PLACED", "PROCESSING"];
const OUT_FOR_DELIVERY = ["SHIPPED", "OUT_FOR_DELIVERY"];

const round = (n) => Math.round(n * 100) / 100;

export async function GET(request) {
  try {
    if (!(await requireAdmin(request))) {
      return NextResponse.json({ error: "not authorized" }, { status: 401 });
    }

    const range = new URL(request.url).searchParams.get("range") || "all";
    const from = rangeStart(range);

    const [orders, expenses, products] = await Promise.all([
      prisma.order.findMany({
        where: from ? { createdAt: { gte: from } } : {},
        include: {
          orderItems: { include: { product: { select: { costPrice: true } } } },
          user: { select: { name: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.expense.findMany({
        where: from ? { date: { gte: from } } : {},
      }),
      prisma.product.findMany({
        select: {
          id: true,
          name: true,
          images: true,
          stock: true,
          costPrice: true,
          price: true,
          trackStock: true,
          lowStockAt: true,
          inStock: true,
        },
      }),
    ]);

    const counts = {
      awaitingPayment: 0,
      inProgress: 0,
      outForDelivery: 0,
      sold: 0,
      cancelled: 0,
    };
    let revenue = 0;
    let costOfGoodsSold = 0;
    let unitsSold = 0;
    let pendingRevenue = 0;

    for (const o of orders) {
      if (o.status === "PENDING_PAYMENT") counts.awaitingPayment++;
      else if (IN_PROGRESS.includes(o.status)) counts.inProgress++;
      else if (OUT_FOR_DELIVERY.includes(o.status)) counts.outForDelivery++;
      else if (o.status === "DELIVERED") counts.sold++;
      else if (o.status === "CANCELLED") counts.cancelled++;

      if (o.status === "DELIVERED") {
        revenue += o.total;
        for (const item of o.orderItems) {
          const unitCost = item.costPrice || item.product?.costPrice || 0;
          costOfGoodsSold += unitCost * item.quantity;
          unitsSold += item.quantity;
        }
      } else if (
        IN_PROGRESS.includes(o.status) ||
        OUT_FOR_DELIVERY.includes(o.status)
      ) {
        pendingRevenue += o.total;
      }
    }

    const spendByCategory = {};
    let totalSpend = 0;
    for (const e of expenses) {
      totalSpend += e.amount;
      spendByCategory[e.category] = (spendByCategory[e.category] || 0) + e.amount;
    }

    // Last 6 months: money in (sold) vs money out (expenses)
    const now = new Date();
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        key: `${d.getFullYear()}-${d.getMonth()}`,
        label: d.toLocaleString("en-NG", { month: "short" }),
        revenue: 0,
        spend: 0,
      });
    }
    const monthOf = (date) => {
      const d = new Date(date);
      return months.find((m) => m.key === `${d.getFullYear()}-${d.getMonth()}`);
    };
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    const [soldForChart, spendForChart] = await Promise.all([
      prisma.order.findMany({
        where: { status: "DELIVERED", updatedAt: { gte: sixMonthsAgo } },
        select: { total: true, updatedAt: true },
      }),
      prisma.expense.findMany({
        where: { date: { gte: sixMonthsAgo } },
        select: { amount: true, date: true },
      }),
    ]);
    soldForChart.forEach((o) => {
      const m = monthOf(o.updatedAt);
      if (m) m.revenue += o.total;
    });
    spendForChart.forEach((e) => {
      const m = monthOf(e.date);
      if (m) m.spend += e.amount;
    });

    const tracked = products.filter((p) => p.trackStock);
    const stockValue = tracked.reduce((s, p) => s + p.stock * p.costPrice, 0);
    const stockUnits = tracked.reduce((s, p) => s + p.stock, 0);
    const lowStock = tracked
      .filter((p) => p.stock <= p.lowStockAt)
      .sort((a, b) => a.stock - b.stock)
      .map((p) => ({ id: p.id, name: p.name, stock: p.stock, image: p.images?.[0] }));

    const recentOrders = orders
      .filter((o) => o.status !== "PENDING_PAYMENT")
      .slice(0, 6)
      .map((o) => ({
        id: o.id,
        customer: o.user?.name || "Customer",
        total: o.total,
        status: o.status,
        paymentMethod: o.paymentMethod,
        isPaid: o.isPaid,
        createdAt: o.createdAt,
      }));

    return NextResponse.json({
      dashboardData: {
        range,
        counts,
        revenue: round(revenue),
        pendingRevenue: round(pendingRevenue),
        costOfGoodsSold: round(costOfGoodsSold),
        grossProfit: round(revenue - costOfGoodsSold),
        totalSpend: round(totalSpend),
        netProfit: round(revenue - totalSpend),
        spendByCategory,
        unitsSold,
        stockValue: round(stockValue),
        stockUnits,
        productCount: products.length,
        untrackedProducts: products.length - tracked.length,
        lowStock,
        recentOrders,
        monthly: months.map(({ key, ...m }) => ({
          ...m,
          revenue: round(m.revenue),
          spend: round(m.spend),
        })),
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error.code || error.message },
      { status: 400 }
    );
  }
}

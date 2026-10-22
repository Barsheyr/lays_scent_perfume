import { prisma } from "@/src/db";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminGuard";

const MOVEMENT_TYPES = ["RESTOCK", "DAMAGED", "RETURN", "ADJUSTMENT"];

// Products with stock levels + the latest goods in/out
export async function GET(request) {
  try {
    if (!(await requireAdmin(request))) {
      return NextResponse.json({ error: "not authorized" }, { status: 401 });
    }
    const [products, movements] = await Promise.all([
      prisma.product.findMany({
        select: {
          id: true,
          name: true,
          category: true,
          images: true,
          price: true,
          mrp: true,
          costPrice: true,
          stock: true,
          trackStock: true,
          lowStockAt: true,
          inStock: true,
        },
        orderBy: { name: "asc" },
      }),
      prisma.stockMovement.findMany({
        take: 200,
        orderBy: { createdAt: "desc" },
        include: { product: { select: { name: true } } },
      }),
    ]);
    return NextResponse.json({ products, movements });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

/**
 * Record goods in / out.
 * { productId, type, quantity, unitCost?, note?, recordExpense? }
 *  - RESTOCK: quantity bottles in; unitCost updates the average cost price
 *  - DAMAGED: quantity bottles out
 *  - RETURN: quantity bottles back in
 *  - ADJUSTMENT: quantity = the correct count you physically have
 */
export async function POST(request) {
  try {
    if (!(await requireAdmin(request))) {
      return NextResponse.json({ error: "not authorized" }, { status: 401 });
    }
    const body = await request.json();
    const { productId, type, note } = body;
    const quantity = parseInt(body.quantity);
    const unitCost = body.unitCost === "" || body.unitCost == null
      ? null
      : Number(body.unitCost);

    if (!productId || !MOVEMENT_TYPES.includes(type)) {
      return NextResponse.json({ error: "invalid movement" }, { status: 400 });
    }
    if (!Number.isInteger(quantity) || quantity < (type === "ADJUSTMENT" ? 0 : 1)) {
      return NextResponse.json({ error: "enter a valid quantity" }, { status: 400 });
    }
    if (unitCost != null && (isNaN(unitCost) || unitCost < 0)) {
      return NextResponse.json({ error: "enter a valid cost" }, { status: 400 });
    }

    const result = await prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({ where: { id: productId } });
      if (!product) throw new Error("Product not found");

      let delta;
      if (type === "RESTOCK" || type === "RETURN") delta = quantity;
      else if (type === "DAMAGED") delta = -quantity;
      else delta = quantity - product.stock; // ADJUSTMENT

      const newStock = product.stock + delta;
      if (newStock < 0) {
        throw new Error(`Only ${product.stock} in stock`);
      }

      const data = { stock: newStock, trackStock: true, inStock: newStock > 0 };

      // Weighted average cost when new bottles come in at a different price
      if (type === "RESTOCK" && unitCost != null) {
        const oldUnits = Math.max(product.stock, 0);
        data.costPrice =
          oldUnits > 0 && product.costPrice > 0
            ? (oldUnits * product.costPrice + quantity * unitCost) /
              (oldUnits + quantity)
            : unitCost;
        data.costPrice = Math.round(data.costPrice * 100) / 100;
      }

      const updated = await tx.product.update({ where: { id: productId }, data });

      const movement = await tx.stockMovement.create({
        data: {
          productId,
          type,
          quantity: delta,
          unitCost: unitCost ?? product.costPrice,
          note: note || null,
        },
      });

      if (type === "RESTOCK" && body.recordExpense && unitCost > 0) {
        await tx.expense.create({
          data: {
            category: "STOCK_PURCHASE",
            amount: unitCost * quantity,
            description: `${quantity} × ${product.name}${note ? ` — ${note}` : ""}`,
            productId,
          },
        });
      }

      return { product: updated, movement };
    });

    return NextResponse.json({ message: "Stock updated", ...result });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// Edit cost price / selling price / low-stock alert: { productId, costPrice?, price?, lowStockAt? }
export async function PATCH(request) {
  try {
    if (!(await requireAdmin(request))) {
      return NextResponse.json({ error: "not authorized" }, { status: 401 });
    }
    const { productId, costPrice, price, lowStockAt } = await request.json();
    const data = {};
    if (costPrice !== undefined && costPrice !== "") data.costPrice = Math.max(0, Number(costPrice));
    if (price !== undefined && price !== "") data.price = Math.max(0, Number(price));
    if (lowStockAt !== undefined && lowStockAt !== "") data.lowStockAt = Math.max(0, parseInt(lowStockAt));
    if (Object.values(data).some((v) => Number.isNaN(v))) {
      return NextResponse.json({ error: "invalid number" }, { status: 400 });
    }
    const product = await prisma.product.update({ where: { id: productId }, data });
    return NextResponse.json({ message: "Product updated", product });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

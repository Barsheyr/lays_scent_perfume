import { prisma } from "@/src/db";
import { NextResponse } from "next/server";
import { requireAdmin, rangeStart } from "@/lib/adminGuard";

const CATEGORIES = ["STOCK_PURCHASE", "DELIVERY", "PACKAGING", "MARKETING", "OTHER"];

export async function GET(request) {
  try {
    if (!(await requireAdmin(request))) {
      return NextResponse.json({ error: "not authorized" }, { status: 401 });
    }
    const from = rangeStart(new URL(request.url).searchParams.get("range"));
    const expenses = await prisma.expense.findMany({
      where: from ? { date: { gte: from } } : {},
      orderBy: { date: "desc" },
    });
    return NextResponse.json({ expenses });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// { category, amount, description, date? }
export async function POST(request) {
  try {
    if (!(await requireAdmin(request))) {
      return NextResponse.json({ error: "not authorized" }, { status: 401 });
    }
    const { category, amount, description, date } = await request.json();
    const value = Number(amount);
    if (!CATEGORIES.includes(category)) {
      return NextResponse.json({ error: "pick a category" }, { status: 400 });
    }
    if (!value || value <= 0) {
      return NextResponse.json({ error: "enter an amount" }, { status: 400 });
    }
    if (!description?.trim()) {
      return NextResponse.json({ error: "add a short description" }, { status: 400 });
    }
    const expense = await prisma.expense.create({
      data: {
        category,
        amount: value,
        description: description.trim(),
        date: date ? new Date(date) : new Date(),
      },
    });
    return NextResponse.json({ message: "Expense recorded", expense });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(request) {
  try {
    if (!(await requireAdmin(request))) {
      return NextResponse.json({ error: "not authorized" }, { status: 401 });
    }
    const id = new URL(request.url).searchParams.get("id");
    if (!id) return NextResponse.json({ error: "missing id" }, { status: 400 });
    await prisma.expense.delete({ where: { id } });
    return NextResponse.json({ message: "Expense deleted" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

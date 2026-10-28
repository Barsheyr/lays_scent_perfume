import { prisma } from "@/src/db";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminGuard";
import { couponUsage, normalizeCode } from "@/lib/coupons";

const deny = () =>
  NextResponse.json({ error: "not authorized" }, { status: 401 });

// List coupons with how many times each was used
export async function GET(request) {
  try {
    if (!(await requireAdmin(request))) return deny();
    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: "desc" },
    });
    const usage = await couponUsage(coupons.map((c) => c.code));
    return NextResponse.json({
      coupons: coupons.map((c) => ({ ...c, used: usage[c.code] || 0 })),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// Create: { code, description, discount, expiresAt, maxUses?, forNewUser?, oncePerCustomer? }
export async function POST(request) {
  try {
    if (!(await requireAdmin(request))) return deny();
    const body = await request.json();
    const code = normalizeCode(body.code);
    const discount = Number(body.discount);
    const maxUses =
      body.maxUses === "" || body.maxUses == null ? null : parseInt(body.maxUses);

    if (!/^[A-Z0-9_-]{3,20}$/.test(code)) {
      return NextResponse.json(
        { error: "Code must be 3–20 letters or numbers (no spaces)" },
        { status: 400 }
      );
    }
    if (!(discount >= 1 && discount <= 90)) {
      return NextResponse.json(
        { error: "Discount must be between 1% and 90%" },
        { status: 400 }
      );
    }
    if (maxUses !== null && !(Number.isInteger(maxUses) && maxUses >= 1)) {
      return NextResponse.json(
        { error: "Usage limit must be a whole number, or left empty" },
        { status: 400 }
      );
    }
    if (!body.expiresAt || isNaN(new Date(body.expiresAt))) {
      return NextResponse.json({ error: "Pick an expiry date" }, { status: 400 });
    }
    // Valid until the end of the chosen day (Lagos time)
    const expiresAt = new Date(`${String(body.expiresAt).slice(0, 10)}T23:59:59+01:00`);
    if (expiresAt < new Date()) {
      return NextResponse.json(
        { error: "Expiry date must be today or later" },
        { status: 400 }
      );
    }

    const exists = await prisma.coupon.findUnique({ where: { code } });
    if (exists) {
      return NextResponse.json(
        { error: `A coupon called ${code} already exists` },
        { status: 400 }
      );
    }

    const coupon = await prisma.coupon.create({
      data: {
        code,
        description: String(body.description || "").trim() || `${discount}% off`,
        discount,
        expiresAt,
        maxUses,
        forNewUser: Boolean(body.forNewUser),
        oncePerCustomer: body.oncePerCustomer !== false,
        forMember: false,
        isPublic: false,
        isActive: true,
      },
    });
    return NextResponse.json({ message: "Coupon created", coupon });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// Pause / resume: { code, isActive }
export async function PATCH(request) {
  try {
    if (!(await requireAdmin(request))) return deny();
    const { code, isActive } = await request.json();
    const coupon = await prisma.coupon.update({
      where: { code: normalizeCode(code) },
      data: { isActive: Boolean(isActive) },
    });
    return NextResponse.json({ message: "Coupon updated", coupon });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// Delete: ?code=FIRST10 (past orders keep their discount)
export async function DELETE(request) {
  try {
    if (!(await requireAdmin(request))) return deny();
    const code = normalizeCode(new URL(request.url).searchParams.get("code"));
    await prisma.coupon.delete({ where: { code } });
    return NextResponse.json({ message: "Coupon deleted" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

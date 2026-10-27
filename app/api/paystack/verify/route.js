import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { prisma } from "@/src/db";
import { confirmPaystackPayment } from "@/lib/orders";

// Called by /payment/verify after Paystack sends the buyer back
export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ error: "not authorized" }, { status: 401 });
    }

    const reference = new URL(request.url).searchParams.get("reference");
    if (!reference) {
      return NextResponse.json({ error: "missing reference" }, { status: 400 });
    }

    const owned = await prisma.order.findFirst({
      where: { paymentRef: reference, userId },
      select: { id: true },
    });
    if (!owned) {
      return NextResponse.json({ error: "order not found" }, { status: 404 });
    }

    const result = await confirmPaystackPayment(reference);
    return NextResponse.json(result, { status: result.ok ? 200 : 402 });
  } catch (error) {
    console.error("Paystack verify error:", error);
    return NextResponse.json(
      { ok: false, error: error.message || "Verification failed" },
      { status: 400 }
    );
  }
}

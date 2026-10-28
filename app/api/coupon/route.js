import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { checkCoupon } from "@/lib/coupons";

// Check a coupon at checkout: { code } -> { coupon: { code, discount, description } }
export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json(
        { error: "Please log in to use a coupon" },
        { status: 401 }
      );
    }
    const { code } = await request.json();
    const result = await checkCoupon(code, userId);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    const { coupon } = result;
    return NextResponse.json({
      coupon: {
        code: coupon.code,
        discount: coupon.discount,
        description: coupon.description,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Couldn't check that coupon, please try again" },
      { status: 400 }
    );
  }
}

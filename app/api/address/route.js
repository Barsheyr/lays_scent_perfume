import { prisma } from "@/src/db";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { userId } = getAuth(request);

    // Check if user is authenticated
    if (!userId) {
      return NextResponse.json(
        { message: "Please login to add an address" },
        { status: 401 }
      );
    }

    const { address } = await request.json();

    address.userId = userId;

    const newAddress = await prisma.address.create({
      data: address,
    });

    return NextResponse.json({
      newAddress,
      message: "Address added successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: error.message || "Failed to add address" },
      { status: 400 }
    );
  }
}

// Get all addresses for a user
export async function GET(request) {
  try {
    const { userId } = getAuth(request);

    // Check if user is authenticated
    if (!userId) {
      return NextResponse.json(
        { message: "Please login to view addresses" },
        { status: 401 }
      );
    }

    const addresses = await prisma.address.findMany({
      where: { userId },
    });

    return NextResponse.json({
      addresses,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: error.message || "Failed to fetch addresses" },
      { status: 400 }
    );
  }
}

import { prisma } from "@/src/db";
import { clerkClient } from "@clerk/nextjs/server";

export async function ensureUser(userId) {
  const existing = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (existing) return existing;

  // ✅ New Clerk v5+ syntax
  const client = await clerkClient();
  const clerkUser = await client.users.getUser(userId);

  const newUser = await prisma.user.create({
    data: {
      id: userId,
      name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim(),
      email: clerkUser.emailAddresses[0]?.emailAddress || "",
      image: clerkUser.imageUrl || "",
    },
  });

  return newUser;
}

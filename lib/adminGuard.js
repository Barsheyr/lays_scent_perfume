import { getAuth } from "@clerk/nextjs/server";
import authAdmin from "@/middleware/authAdmin";

// Returns the Clerk userId if the caller is an admin, otherwise null
export async function requireAdmin(request) {
  const { userId } = getAuth(request);
  return (await authAdmin(userId)) ? userId : null;
}

// ?range=all|30d|month|year  ->  { gte: Date } or undefined
export function rangeStart(range) {
  const now = new Date();
  switch (range) {
    case "30d":
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    case "month":
      return new Date(now.getFullYear(), now.getMonth(), 1);
    case "year":
      return new Date(now.getFullYear(), 0, 1);
    default:
      return undefined;
  }
}

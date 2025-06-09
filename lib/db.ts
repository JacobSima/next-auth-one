import { PrismaClient } from "@prisma/client";

// Use const for the actual value
const prisma = globalThis.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}

export const db = prisma;
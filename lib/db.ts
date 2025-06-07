import { PrismaClient } from "@prisma/client";

declare global { // global variable is not affected by hotreload
  var prisma: PrismaClient | undefined;
}

export const db = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = db;
}
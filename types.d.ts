// If in a separate file (e.g. `types.d.ts`), make sure it's included in your `tsconfig.json`

import { PrismaClient } from "@prisma/client";

declare global {
  // Only for type definition — no var/const/let here!
  var prisma: PrismaClient | undefined;
}

export {};

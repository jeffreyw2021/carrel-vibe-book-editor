import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function normalizeDbUrl(url: string | undefined): string | undefined {
  if (!url) return url;
  // pg v8 treats sslmode=require/prefer/verify-ca as verify-full (with a deprecation warning).
  // Explicitly opt into verify-full now to silence the warning and match actual behavior.
  return url.replace(/sslmode=(prefer|require|verify-ca)/, "sslmode=verify-full");
}

function createPrismaClient() {
  const pool = new Pool({ connectionString: normalizeDbUrl(process.env.DATABASE_URL) });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

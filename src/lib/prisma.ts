import { PrismaClient } from "@/generated/prisma/client";

// Two full connection strings live in .env — DATABASE_URL_LOCALHOST (this
// dev machine reaching the Hostinger DB over its public host) and
// DATABASE_URL_DEPLOYED (the app reaching the same DB over 127.0.0.1 once
// both run on Hostinger). schema.prisma's own env("DATABASE_URL") is only
// read by the Prisma CLI (migrate/generate) — pass DATABASE_URL explicitly
// on those commands, pointed at DATABASE_URL_LOCALHOST when running them
// from this machine. The app itself picks here, at runtime.
function resolveDatabaseUrl(): string {
  const url =
    process.env.NODE_ENV === "production"
      ? process.env.DATABASE_URL_DEPLOYED
      : process.env.DATABASE_URL_LOCALHOST;

  if (!url) {
    throw new Error(
      process.env.NODE_ENV === "production"
        ? "DATABASE_URL_DEPLOYED is not set"
        : "DATABASE_URL_LOCALHOST is not set",
    );
  }
  return url;
}

// Next.js dev hot-reload re-executes this module on every edit — without
// caching the client on `globalThis`, each reload opens a fresh connection
// pool and leaks the old ones until the dev DB's max-connections is hit.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: { db: { url: resolveDatabaseUrl() } },
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

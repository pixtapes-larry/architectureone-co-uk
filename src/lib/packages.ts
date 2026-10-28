// The 3 fixed-price Permitted Development packages — DB-backed (see
// prisma/schema.prisma Package/PackageSettings/PackageService), reused by
// the Permitted Development category page and all 4 of its sub-type pages,
// and by the Package detail page itself.
//
// "What's included" is a selection from the shared Service catalog
// (src/lib/services.ts), each optionally constrained with its own note
// (e.g. "up to 2 rounds of amendments") rather than free-text bullets.
import { prisma } from "./prisma";

// A quantifiable scope item — "count: null" means genuinely not decided
// yet, rendered as an honest "TBC" rather than a guessed number.
export type ExpectationItem = { label: string; count: number | null };

export type IncludedService = {
  title: string;
  constraintNote?: string;
};

export type PackageTier = {
  slug: string;
  name: string;
  price: string;
  featured: boolean;
  includedServices: IncludedService[];
  expectations: ExpectationItem[];
};

const WITH_SERVICES = {
  services: {
    include: { service: true },
    orderBy: { sortOrder: "asc" as const },
  },
};

type PackageRow = {
  slug: string;
  name: string;
  price: string;
  featured: boolean;
  expectations: unknown;
  services: { constraintNote: string | null; service: { title: string } }[];
};

function toTier(row: PackageRow): PackageTier {
  return {
    slug: row.slug,
    name: row.name,
    price: row.price,
    featured: row.featured,
    expectations: row.expectations as ExpectationItem[],
    includedServices: row.services.map((s) => ({
      title: s.service.title,
      constraintNote: s.constraintNote ?? undefined,
    })),
  };
}

export async function getPackageTiers(): Promise<PackageTier[]> {
  const rows = await prisma.package.findMany({
    include: WITH_SERVICES,
    orderBy: { sortOrder: "asc" },
  });
  return rows.map(toTier);
}

export async function findPackageTier(slug: string): Promise<PackageTier | undefined> {
  const row = await prisma.package.findUnique({
    where: { slug },
    include: WITH_SERVICES,
  });
  return row ? toTier(row) : undefined;
}

export async function getPackageNote(): Promise<string> {
  const settings = await prisma.packageSettings.findUnique({ where: { id: 1 } });
  return settings?.note ?? "";
}

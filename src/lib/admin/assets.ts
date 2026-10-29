import { prisma } from "../prisma";

export type AssetFilters = {
  type?: "image" | "pdf" | "video";
  category?: string;
  search?: string;
};

function mimeTypeFilter(type: AssetFilters["type"]) {
  if (type === "image") return { startsWith: "image/" };
  if (type === "video") return { startsWith: "video/" };
  if (type === "pdf") return "application/pdf";
  return undefined;
}

export async function listAssetsAdmin(filters: AssetFilters = {}) {
  const mimeType = mimeTypeFilter(filters.type);
  return prisma.asset.findMany({
    where: {
      ...(mimeType ? { mimeType } : {}),
      ...(filters.category ? { category: filters.category } : {}),
      ...(filters.search
        ? {
            OR: [
              { filename: { contains: filters.search } },
              { label: { contains: filters.search } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function listAssetCategoriesAdmin(): Promise<string[]> {
  const rows = await prisma.asset.findMany({
    where: { category: { not: null } },
    select: { category: true },
    distinct: ["category"],
  });
  return rows.map((r) => r.category!).sort((a, b) => a.localeCompare(b));
}

export async function createAssetAdmin(input: {
  filename: string;
  url: string;
  mimeType: string;
  fileSizeKb: number;
  label: string | null;
  category: string | null;
}) {
  return prisma.asset.create({ data: input });
}

export async function getAssetAdmin(id: number) {
  return prisma.asset.findUnique({ where: { id } });
}

export async function deleteAssetAdmin(id: number) {
  await prisma.asset.delete({ where: { id } });
}

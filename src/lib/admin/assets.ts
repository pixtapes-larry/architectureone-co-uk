import { prisma } from "../prisma";

export async function listAssetsAdmin() {
  return prisma.asset.findMany({ orderBy: { createdAt: "desc" } });
}

export async function createAssetAdmin(input: {
  filename: string;
  url: string;
  mimeType: string;
  fileSizeKb: number;
  label: string | null;
}) {
  return prisma.asset.create({ data: input });
}

export async function getAssetAdmin(id: number) {
  return prisma.asset.findUnique({ where: { id } });
}

export async function deleteAssetAdmin(id: number) {
  await prisma.asset.delete({ where: { id } });
}

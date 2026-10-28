import { prisma } from "../prisma";

export async function listAwardsAdmin() {
  return prisma.award.findMany({
    orderBy: [{ sortOrder: "asc" }, { year: "desc" }],
    include: { project: { select: { id: true, address: true, place: true } } },
  });
}

export async function getAwardAdmin(id: number) {
  return prisma.award.findUnique({ where: { id } });
}

export type AwardAdminInput = {
  name: string;
  year: number;
  projectId: number | null;
};

export async function createAwardAdmin(input: AwardAdminInput) {
  const maxSort = await prisma.award.aggregate({ _max: { sortOrder: true } });
  return prisma.award.create({
    data: { ...input, sortOrder: (maxSort._max.sortOrder ?? -1) + 1 },
  });
}

export async function updateAwardAdmin(id: number, input: AwardAdminInput) {
  return prisma.award.update({ where: { id }, data: input });
}

export async function deleteAwardAdmin(id: number) {
  await prisma.award.delete({ where: { id } });
}

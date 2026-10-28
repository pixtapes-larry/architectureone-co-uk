// Real award wins — DB-backed (see prisma/schema.prisma Award), each
// optionally linked to the project it was won for. Feeds both the
// /awards page and the Home hero's live "X awards won" count.
import { prisma } from "./prisma";

export async function getAllAwards() {
  return prisma.award.findMany({
    orderBy: [{ sortOrder: "asc" }, { year: "desc" }],
    include: { project: { select: { id: true, address: true, place: true, slug: true } } },
  });
}

export async function getAwardCount(): Promise<number> {
  return prisma.award.count();
}

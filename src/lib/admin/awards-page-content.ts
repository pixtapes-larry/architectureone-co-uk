import { prisma } from "../prisma";

export async function getAwardsPageContentAdmin() {
  return prisma.awardsPageContent.findUnique({ where: { id: 1 } });
}

export type AwardsPageContentAdminInput = {
  heading: string;
  introParagraphs: string[];
  metaTitle: string | null;
  metaDescription: string | null;
};

export async function updateAwardsPageContentAdmin(input: AwardsPageContentAdminInput) {
  return prisma.awardsPageContent.upsert({
    where: { id: 1 },
    update: input,
    create: { id: 1, ...input },
  });
}

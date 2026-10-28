import { prisma } from "../prisma";

export async function getPrivacyPageContentAdmin() {
  return prisma.privacyPageContent.findUnique({ where: { id: 1 } });
}

export type PrivacyPageContentAdminInput = {
  heading: string;
  intro: string;
  bodyParagraphs: string[];
  lastUpdatedNote: string;
  metaTitle: string | null;
  metaDescription: string | null;
};

export async function updatePrivacyPageContentAdmin(input: PrivacyPageContentAdminInput) {
  return prisma.privacyPageContent.upsert({
    where: { id: 1 },
    update: input,
    create: { id: 1, ...input },
  });
}

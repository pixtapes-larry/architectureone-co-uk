import { prisma } from "../prisma";

export async function getBookConsultationPageContentAdmin() {
  return prisma.bookConsultationPageContent.findUnique({ where: { id: 1 } });
}

export type BookConsultationPageContentAdminInput = {
  heading: string;
  lead: string;
  includesHeading: string;
  includesList: string[];
  metaTitle: string | null;
  metaDescription: string | null;
};

export async function updateBookConsultationPageContentAdmin(
  input: BookConsultationPageContentAdminInput,
) {
  return prisma.bookConsultationPageContent.upsert({
    where: { id: 1 },
    update: input,
    create: { id: 1, ...input },
  });
}

import { prisma } from "../prisma";

export async function getTestimonialsPageContentAdmin() {
  return prisma.testimonialsPageContent.findUnique({ where: { id: 1 } });
}

export type TestimonialsPageContentAdminInput = {
  heading: string;
  introParagraphs: string[];
  metaTitle: string | null;
  metaDescription: string | null;
};

export async function updateTestimonialsPageContentAdmin(input: TestimonialsPageContentAdminInput) {
  return prisma.testimonialsPageContent.upsert({
    where: { id: 1 },
    update: input,
    create: { id: 1, ...input },
  });
}

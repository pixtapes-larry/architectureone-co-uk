import { prisma } from "../prisma";

export async function getServicesPageContentAdmin() {
  return prisma.servicesPageContent.findUnique({ where: { id: 1 } });
}

export type ServicesPageContentAdminInput = {
  heading: string;
  introParagraphs: string[];
  finalCtaHeading: string;
  finalCtaLead: string;
  metaTitle: string | null;
  metaDescription: string | null;
};

export async function updateServicesPageContentAdmin(input: ServicesPageContentAdminInput) {
  return prisma.servicesPageContent.upsert({
    where: { id: 1 },
    update: input,
    create: { id: 1, ...input },
  });
}

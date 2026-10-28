import { prisma } from "../prisma";

export async function getProjectsMapContentAdmin() {
  return prisma.projectsMapContent.findUnique({ where: { id: 1 } });
}

export type ProjectsMapContentAdminInput = {
  searchHeading: string;
  searchLead: string;
  startingNote: string;
  metaTitle: string | null;
  metaDescription: string | null;
};

export async function updateProjectsMapContentAdmin(input: ProjectsMapContentAdminInput) {
  return prisma.projectsMapContent.upsert({
    where: { id: 1 },
    update: input,
    create: { id: 1, ...input },
  });
}

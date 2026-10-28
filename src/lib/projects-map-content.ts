// DB-backed content for the /projects map page's search card — previously
// hardcoded in ProjectsMapExperience.tsx. See prisma/schema.prisma
// ProjectsMapContent.
import { prisma } from "./prisma";

export async function getProjectsMapContent() {
  return prisma.projectsMapContent.findUniqueOrThrow({ where: { id: 1 } });
}

// DB-backed content for the About page — previously hardcoded in
// src/app/(marketing)/about/page.tsx. See prisma/schema.prisma AboutPageContent.
import { prisma } from "./prisma";

export async function getAboutPageContent() {
  const row = await prisma.aboutPageContent.findUniqueOrThrow({ where: { id: 1 } });
  return {
    ...row,
    storyParagraphs: row.storyParagraphs as string[],
  };
}

export async function getTeamMembers() {
  return prisma.teamMember.findMany({ orderBy: { sortOrder: "asc" } });
}

import { prisma } from "../prisma";

export async function getAboutPageContentAdmin() {
  return prisma.aboutPageContent.findUnique({ where: { id: 1 } });
}

export type AboutPageContentAdminInput = {
  heroTagline: string;
  heroPhotoLabel: string;
  storyParagraphs: string[];
  servicesTeaserLead: string;
  reviewsHeading: string;
  reviewsLead: string;
  reviewsPlaceholderNote: string;
  finalCtaHeading: string;
  finalCtaLead: string;
};

export async function updateAboutPageContentAdmin(input: AboutPageContentAdminInput) {
  return prisma.aboutPageContent.upsert({
    where: { id: 1 },
    update: input,
    create: { id: 1, ...input },
  });
}

export async function listTeamMembersAdmin() {
  return prisma.teamMember.findMany({ orderBy: { sortOrder: "asc" } });
}

export async function getTeamMemberAdmin(id: number) {
  return prisma.teamMember.findUnique({ where: { id } });
}

export type TeamMemberAdminInput = {
  name: string;
  role: string;
  bio: string;
  photoLabel: string;
};

export async function createTeamMemberAdmin(input: TeamMemberAdminInput) {
  const maxSort = await prisma.teamMember.aggregate({ _max: { sortOrder: true } });
  return prisma.teamMember.create({
    data: { ...input, sortOrder: (maxSort._max.sortOrder ?? -1) + 1 },
  });
}

export async function updateTeamMemberAdmin(id: number, input: TeamMemberAdminInput) {
  return prisma.teamMember.update({ where: { id }, data: input });
}

export async function deleteTeamMemberAdmin(id: number) {
  await prisma.teamMember.delete({ where: { id } });
}

export async function moveTeamMemberAdmin(id: number, direction: "up" | "down") {
  const member = await prisma.teamMember.findUniqueOrThrow({ where: { id } });
  const all = await prisma.teamMember.findMany({ orderBy: { sortOrder: "asc" } });
  const index = all.findIndex((m) => m.id === id);
  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (swapIndex < 0 || swapIndex >= all.length) return;

  const other = all[swapIndex];
  await prisma.$transaction([
    prisma.teamMember.update({ where: { id: member.id }, data: { sortOrder: other.sortOrder } }),
    prisma.teamMember.update({ where: { id: other.id }, data: { sortOrder: member.sortOrder } }),
  ]);
}

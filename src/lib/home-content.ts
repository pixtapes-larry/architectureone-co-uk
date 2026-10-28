// DB-backed content for the home page — previously hardcoded in
// src/app/(marketing)/page.tsx. See prisma/schema.prisma HomePageContent.
import { prisma } from "./prisma";

export async function getHomePageContent() {
  const row = await prisma.homePageContent.findUniqueOrThrow({ where: { id: 1 } });
  return {
    ...row,
    awardNames: row.awardNames as string[],
  };
}

// DB-backed content for the /awards page's own intro copy, above the full
// list of awards (src/lib/awards.ts getAllAwards). See
// prisma/schema.prisma AwardsPageContent.
import { prisma } from "./prisma";

export async function getAwardsPageContent() {
  const row = await prisma.awardsPageContent.findUniqueOrThrow({ where: { id: 1 } });
  return {
    ...row,
    introParagraphs: row.introParagraphs as string[],
  };
}

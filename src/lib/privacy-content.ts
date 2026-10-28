// DB-backed content for the Privacy page. See prisma/schema.prisma
// PrivacyPageContent. Placeholder/draft copy — see the on-page note.
import { prisma } from "./prisma";

export async function getPrivacyPageContent() {
  const row = await prisma.privacyPageContent.findUniqueOrThrow({ where: { id: 1 } });
  return {
    ...row,
    bodyParagraphs: row.bodyParagraphs as string[],
  };
}

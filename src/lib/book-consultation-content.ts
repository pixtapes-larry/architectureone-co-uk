// DB-backed content for the /book-a-consultation page's copy. See
// prisma/schema.prisma BookConsultationPageContent.
import { prisma } from "./prisma";

export async function getBookConsultationPageContent() {
  const row = await prisma.bookConsultationPageContent.findUniqueOrThrow({ where: { id: 1 } });
  return {
    ...row,
    includesList: row.includesList as string[],
  };
}

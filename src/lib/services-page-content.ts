// DB-backed content for the /about/services page's own copy (intro +
// closing CTA) — distinct from the Service catalog itself (src/lib/services.ts),
// which is the list of individual offerings this page displays. See
// prisma/schema.prisma ServicesPageContent.
import { prisma } from "./prisma";

export async function getServicesPageContent() {
  const row = await prisma.servicesPageContent.findUniqueOrThrow({ where: { id: 1 } });
  return {
    ...row,
    introParagraphs: row.introParagraphs as string[],
  };
}

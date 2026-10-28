// DB-backed content for the /testimonials page's own intro copy, above the
// full list of testimonials (src/lib/testimonials.ts getAllTestimonials).
// See prisma/schema.prisma TestimonialsPageContent.
import { prisma } from "./prisma";

export async function getTestimonialsPageContent() {
  const row = await prisma.testimonialsPageContent.findUniqueOrThrow({ where: { id: 1 } });
  return {
    ...row,
    introParagraphs: row.introParagraphs as string[],
  };
}

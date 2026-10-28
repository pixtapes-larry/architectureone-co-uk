// Client testimonials — DB-backed (see prisma/schema.prisma Testimonial).
// The home page shows the first featured one (by sortOrder) in its quote
// bubble; the About page lists all of them.
import { prisma } from "./prisma";

export async function getAllTestimonials() {
  return prisma.testimonial.findMany({ orderBy: { sortOrder: "asc" } });
}

export async function getFeaturedTestimonial() {
  return prisma.testimonial.findFirst({
    where: { featured: true },
    orderBy: { sortOrder: "asc" },
  });
}

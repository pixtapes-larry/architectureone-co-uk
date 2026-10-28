// Client testimonials — DB-backed (see prisma/schema.prisma Testimonial).
// The home page shows the first featured one (by sortOrder) in its quote
// bubble; the About page lists all of them.
import { prisma } from "./prisma";

export async function getAllTestimonials() {
  return prisma.testimonial.findMany({
    orderBy: { sortOrder: "asc" },
    include: { project: { select: { id: true, address: true, place: true, slug: true } } },
  });
}

export async function getFeaturedTestimonial() {
  return prisma.testimonial.findFirst({
    where: { featured: true },
    orderBy: { sortOrder: "asc" },
  });
}

// Powers the Home hero's "★ 4.9 (28 reviews)" line — computed live from
// every Testimonial's star rating rather than hand-entered, so it can
// never drift out of sync with what's actually on the Testimonials page.
export async function getReviewStats(): Promise<{ average: number; count: number }> {
  const result = await prisma.testimonial.aggregate({ _avg: { stars: true }, _count: true });
  return { average: result._avg.stars ?? 0, count: result._count };
}

// Used by a project's case-study page to link its "note from the team"
// quote through to that same testimonial's full entry on /testimonials —
// only possible when that quote also exists as a Testimonial row attached
// to this project (via the admin's project picker). Returns null
// otherwise, in which case the note just renders in full with no link.
export async function findTestimonialIdForProject(projectId: number): Promise<number | null> {
  const row = await prisma.testimonial.findFirst({
    where: { projectId },
    select: { id: true },
  });
  return row?.id ?? null;
}

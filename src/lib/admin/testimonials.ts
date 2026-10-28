import { prisma } from "../prisma";

export async function listTestimonialsAdmin() {
  return prisma.testimonial.findMany({
    orderBy: { sortOrder: "asc" },
    include: { project: { select: { id: true, address: true, place: true } } },
  });
}

export async function getTestimonialAdmin(id: number) {
  return prisma.testimonial.findUnique({ where: { id } });
}

// The searchable project picker on the testimonial form needs a lightweight
// list of every project — small enough (currently ~50) to send down whole
// and filter client-side, rather than a server-search endpoint.
export async function listProjectsForTestimonialPicker() {
  return prisma.project.findMany({
    select: { id: true, address: true, place: true, postcode: true },
    orderBy: { address: "asc" },
  });
}

export type TestimonialAdminInput = {
  quote: string;
  authorName: string | null;
  stars: number;
  featured: boolean;
  source: string | null;
  sourceUrl: string | null;
  projectId: number | null;
};

export async function createTestimonialAdmin(input: TestimonialAdminInput) {
  const maxSort = await prisma.testimonial.aggregate({ _max: { sortOrder: true } });
  return prisma.testimonial.create({
    data: { ...input, sortOrder: (maxSort._max.sortOrder ?? -1) + 1 },
  });
}

export async function updateTestimonialAdmin(id: number, input: TestimonialAdminInput) {
  return prisma.testimonial.update({ where: { id }, data: input });
}

export async function deleteTestimonialAdmin(id: number) {
  await prisma.testimonial.delete({ where: { id } });
}

export async function toggleTestimonialFeaturedAdmin(id: number) {
  const row = await prisma.testimonial.findUniqueOrThrow({ where: { id } });
  return prisma.testimonial.update({
    where: { id },
    data: { featured: !row.featured },
  });
}

// Persists a full new ordering from the admin's drag-to-reorder table —
// `orderedIds` is every testimonial id in its new top-to-bottom order.
export async function reorderTestimonialsAdmin(orderedIds: number[]) {
  await prisma.$transaction(
    orderedIds.map((id, index) =>
      prisma.testimonial.update({ where: { id }, data: { sortOrder: index } }),
    ),
  );
}

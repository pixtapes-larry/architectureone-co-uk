import { prisma } from "../prisma";

export async function listServicesAdmin() {
  return prisma.service.findMany({ orderBy: { sortOrder: "asc" } });
}

export async function getServiceAdmin(id: number) {
  return prisma.service.findUnique({ where: { id } });
}

// Existing group names, for the admin form's suggested-dropdown — keeps
// entries consistent (e.g. doesn't let "Building Control" and "Building
// control" quietly become two different groups).
export async function listDistinctServiceGroups(): Promise<string[]> {
  const rows = await prisma.service.findMany({
    distinct: ["group"],
    select: { group: true },
    orderBy: { sortOrder: "asc" },
  });
  return rows.map((r) => r.group);
}

export type ServiceAdminInput = {
  slug: string;
  title: string;
  description: string;
  group: string;
  groupNote?: string;
  sortOrder: number;
};

export async function createServiceAdmin(input: ServiceAdminInput) {
  return prisma.service.create({ data: input });
}

export async function updateServiceAdmin(id: number, input: ServiceAdminInput) {
  return prisma.service.update({ where: { id }, data: input });
}

// Services are referenced by Project/Package links via a restrict-on-delete
// FK, so this throws a Prisma "Foreign key constraint failed" error if the
// service is still in use anywhere — surfaced as a friendly message by the
// calling action rather than a raw DB error.
export async function deleteServiceAdmin(id: number) {
  await prisma.service.delete({ where: { id } });
}

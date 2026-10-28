import { prisma } from "../prisma";
import type { ExpectationItem } from "../packages";

const WITH_SERVICES = {
  services: {
    include: { service: true },
    orderBy: { sortOrder: "asc" as const },
  },
};

export async function listPackagesAdmin() {
  return prisma.package.findMany({ orderBy: { sortOrder: "asc" } });
}

export async function getPackageAdmin(id: number) {
  return prisma.package.findUnique({ where: { id }, include: WITH_SERVICES });
}

export async function getPackageSettingsAdmin() {
  return prisma.packageSettings.findUnique({ where: { id: 1 } });
}

export type PackageAdminInput = {
  slug: string;
  name: string;
  price: string;
  featured: boolean;
  sortOrder: number;
  expectations: ExpectationItem[];
  services: { serviceId: number; constraintNote?: string }[];
  metaTitle: string | null;
  metaDescription: string | null;
};

export async function createPackageAdmin(input: PackageAdminInput) {
  const { services, ...core } = input;
  return prisma.package.create({
    data: {
      ...core,
      services: {
        create: services.map((s, i) => ({
          serviceId: s.serviceId,
          constraintNote: s.constraintNote,
          sortOrder: i,
        })),
      },
    },
  });
}

export async function updatePackageAdmin(id: number, input: PackageAdminInput) {
  const { services, ...core } = input;
  // Services have no natural "identity" worth diffing — simplest correct
  // approach is replace-all inside a transaction (same pattern as Project's
  // Services Delivered list).
  return prisma.$transaction([
    prisma.packageService.deleteMany({ where: { packageId: id } }),
    prisma.package.update({
      where: { id },
      data: {
        ...core,
        services: {
          create: services.map((s, i) => ({
            serviceId: s.serviceId,
            constraintNote: s.constraintNote,
            sortOrder: i,
          })),
        },
      },
    }),
  ]);
}

export async function deletePackageAdmin(id: number) {
  await prisma.package.delete({ where: { id } });
}

export async function updatePackageNoteAdmin(note: string) {
  return prisma.packageSettings.upsert({
    where: { id: 1 },
    update: { note },
    create: { id: 1, note },
  });
}

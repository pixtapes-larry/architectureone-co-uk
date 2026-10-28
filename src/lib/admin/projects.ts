// Full-fidelity CRUD for the admin — unlike src/lib/projects.ts (which
// shapes DB rows into the public ProjectMapSummary view), this exposes
// every column, including the ones only the admin ever needs to see
// (notes, customerName, customerConsent, otherTags).
import { prisma } from "../prisma";
import { deleteProjectImage } from "./upload";
import { geocodeAddress } from "../geocode";
import type { PlanningType, ProjectType } from "@/generated/prisma/enums";

export async function listProjectsAdmin(search?: string) {
  return prisma.project.findMany({
    where: search
      ? {
          OR: [
            { address: { contains: search } },
            { place: { contains: search } },
            { postcode: { contains: search } },
            { localAuthority: { contains: search } },
          ],
        }
      : undefined,
    orderBy: { id: "desc" },
  });
}

// Projects carry their own one-off client testimonial (a genuine quote
// tied to that specific job), separate from the standalone Testimonial
// catalog — surfaced on the admin Testimonials page so there's one place
// to review every quote on the site, even though editing one of these
// means editing the project itself.
export async function listProjectTestimonialsAdmin() {
  return prisma.project.findMany({
    where: { testimonial: { not: null } },
    select: {
      id: true,
      address: true,
      place: true,
      testimonial: true,
      customerName: true,
      customerConsent: true,
    },
    orderBy: { id: "desc" },
  });
}

export async function getProjectAdmin(id: number) {
  return prisma.project.findUnique({
    where: { id },
    include: {
      photos: { orderBy: { sortOrder: "asc" } },
      services: { include: { service: true } },
    },
  });
}

export type ProjectAdminInput = {
  address: string;
  place: string;
  postcode: string;
  localAuthority: string;
  planningType: PlanningType;
  projectType: ProjectType;
  instructionDate: Date;
  description: string;
  notes?: string;
  coverPhotoUrl: string;
  featured: boolean;
  fullDescription?: string;
  constructionCompany?: string;
  floorplanBeforeImage?: string;
  floorplanAfterImage?: string;
  elevationBeforeImage?: string;
  elevationAfterImage?: string;
  year?: number;
  status?: string;
  slug?: string;
  otherTags?: string[];
  awards?: { name: string; year: number }[];
  testimonial?: string;
  customerName?: string;
  customerConsent?: boolean;
  services: number[]; // Service ids
};

export async function createProjectAdmin(input: ProjectAdminInput) {
  const { services, ...projectData } = input;
  const coords = await geocodeAddress(input.address, input.place, input.postcode);
  return prisma.project.create({
    data: {
      ...projectData,
      latitude: coords?.latitude,
      longitude: coords?.longitude,
      services: { create: services.map((serviceId) => ({ serviceId })) },
    },
  });
}

export async function updateProjectAdmin(
  id: number,
  input: ProjectAdminInput,
) {
  const { services, ...projectData } = input;

  const existing = await prisma.project.findUnique({
    where: { id },
    select: { address: true, place: true, postcode: true, latitude: true, longitude: true },
  });

  const addressChanged =
    !existing ||
    existing.address !== input.address ||
    existing.place !== input.place ||
    existing.postcode !== input.postcode;
  const needsGeocode = addressChanged || existing?.latitude == null || existing?.longitude == null;

  const coords = needsGeocode
    ? await geocodeAddress(input.address, input.place, input.postcode)
    : null;

  // Services have no natural "identity" worth diffing — simplest correct
  // approach is replace-all inside a transaction.
  return prisma.$transaction([
    prisma.projectServiceDelivered.deleteMany({ where: { projectId: id } }),
    prisma.project.update({
      where: { id },
      data: {
        ...projectData,
        ...(needsGeocode
          ? { latitude: coords?.latitude, longitude: coords?.longitude }
          : {}),
        services: { create: services.map((serviceId) => ({ serviceId })) },
      },
    }),
  ]);
}

export async function deleteProjectAdmin(id: number) {
  const project = await prisma.project.findUnique({
    where: { id },
    include: { photos: true },
  });
  if (!project) return;

  const imageUrls = [
    project.coverPhotoUrl,
    project.floorplanBeforeImage,
    project.floorplanAfterImage,
    project.elevationBeforeImage,
    project.elevationAfterImage,
    ...project.photos.map((p) => p.url),
  ].filter((url): url is string => Boolean(url));

  await Promise.all(imageUrls.map(deleteProjectImage));
  // ProjectPhoto and ProjectServiceDelivered both cascade on delete.
  await prisma.project.delete({ where: { id } });
}

export async function addProjectPhoto(
  projectId: number,
  data: { url: string; isBefore: boolean; caption?: string },
) {
  const maxSort = await prisma.projectPhoto.aggregate({
    where: { projectId },
    _max: { sortOrder: true },
  });
  return prisma.projectPhoto.create({
    data: {
      projectId,
      url: data.url,
      isBefore: data.isBefore,
      caption: data.caption,
      sortOrder: (maxSort._max.sortOrder ?? -1) + 1,
    },
  });
}

export async function deleteProjectPhoto(photoId: number) {
  const photo = await prisma.projectPhoto.findUnique({ where: { id: photoId } });
  if (!photo) return;
  await deleteProjectImage(photo.url);
  await prisma.projectPhoto.delete({ where: { id: photoId } });
}

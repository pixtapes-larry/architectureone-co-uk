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
  testimonial?: string;
  customerName?: string;
  customerConsent?: boolean;
  metaTitle?: string;
  metaDescription?: string;
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

  // Asset-backed photos share their file with a retained original (and
  // potentially other usages of it) — only a legacy, non-asset-backed
  // image owns its file outright, safe to delete alongside the project.
  const imageUrls = [
    project.coverPhotoAssetId ? null : project.coverPhotoUrl,
    project.floorplanBeforeImage,
    project.floorplanAfterImage,
    project.elevationBeforeImage,
    project.elevationAfterImage,
    ...project.photos.filter((p) => !p.assetId).map((p) => p.url),
  ].filter((url): url is string => Boolean(url));

  await Promise.all(imageUrls.map(deleteProjectImage));
  // ProjectPhoto and ProjectServiceDelivered both cascade on delete.
  await prisma.project.delete({ where: { id } });
}

export async function addProjectPhoto(
  projectId: number,
  data: {
    url: string;
    isBefore: boolean;
    caption?: string;
    // Which retained original (Asset) this photo was cropped from, and the
    // fractional crop rect used — present when added via the asset-backed
    // crop flow, absent for photos added before that existed.
    assetId?: number;
    crop?: { x: number; y: number; width: number; height: number };
  },
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
      assetId: data.assetId,
      crop: data.crop,
      sortOrder: (maxSort._max.sortOrder ?? -1) + 1,
    },
  });
}

// Sets the cover photo along with the provenance of how it was produced
// (which retained original, which crop) — separate from updateProjectAdmin
// since this is called from the instant, no-save-needed cover photo editor,
// not the big form submit.
export async function setCoverPhotoAdmin(
  projectId: number,
  data: {
    coverPhotoUrl: string;
    coverPhotoAssetId: number;
    coverPhotoCrop: { x: number; y: number; width: number; height: number };
  },
) {
  return prisma.project.update({ where: { id: projectId }, data });
}

export async function deleteProjectPhoto(photoId: number) {
  const photo = await prisma.projectPhoto.findUnique({ where: { id: photoId } });
  if (!photo) return;
  // An asset-backed photo's `url` is the shared retained original (the same
  // file a cover photo or another gallery entry may also point at) — never
  // delete that file here. Only a legacy photo (no assetId) owns its file
  // outright, baked just for this one row.
  if (!photo.assetId) await deleteProjectImage(photo.url);
  await prisma.projectPhoto.delete({ where: { id: photoId } });
}

// Same, but looked up by URL rather than id — the asset manager only knows
// the file's URL, not its ProjectPhoto id.
export async function deleteProjectPhotoByUrl(projectId: number, url: string) {
  const photo = await prisma.projectPhoto.findFirst({ where: { projectId, url } });
  if (!photo) return;
  await deleteProjectPhoto(photo.id);
}

const CLEARABLE_IMAGE_FIELDS = [
  "floorplanBeforeImage",
  "floorplanAfterImage",
  "elevationBeforeImage",
  "elevationAfterImage",
] as const;
export type ClearableImageField = (typeof CLEARABLE_IMAGE_FIELDS)[number];

// Clears one floorplan/elevation field and deletes its file — these are the
// only single-image Project fields that are genuinely optional; coverPhoto
// is required, so there's no equivalent "clear" for it, only "replace".
export async function clearProjectImageField(projectId: number, field: ClearableImageField) {
  const project = await prisma.project.findUnique({ where: { id: projectId }, select: { [field]: true } });
  const url = project?.[field] as string | null | undefined;
  if (url) await deleteProjectImage(url);
  await prisma.project.update({ where: { id: projectId }, data: { [field]: null } });
}

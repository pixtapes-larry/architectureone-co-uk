// Real DB-backed reads for Project data, shaped into the same
// ProjectMapSummary every template already expects — so swapping
// MOCK_PROJECTS for these calls needed no changes to the templates
// themselves, only to the Server Components that fetch the data.
import { prisma } from "./prisma";
import type { ProjectMapSummary } from "./mock-projects";
import type { ProjectType } from "@/generated/prisma/enums";
import type { ProjectModel } from "@/generated/prisma/models/Project";
import type { ProjectPhotoModel } from "@/generated/prisma/models/ProjectPhoto";
import type { ProjectServiceDeliveredModel } from "@/generated/prisma/models/ProjectServiceDelivered";
import type { ServiceModel } from "@/generated/prisma/models/Service";

type ProjectWithRelations = ProjectModel & {
  photos: ProjectPhotoModel[];
  services: (ProjectServiceDeliveredModel & { service: ServiceModel })[];
};

const WITH_RELATIONS = {
  photos: { orderBy: { sortOrder: "asc" as const } },
  services: { include: { service: true } },
};

function formatInstructionDate(date: Date): string {
  return date.toLocaleDateString("en-GB", { month: "short", year: "numeric" });
}

function toSummary(p: ProjectWithRelations): ProjectMapSummary {
  return {
    id: p.id,
    slug: p.slug,
    featured: p.featured,
    address: p.address,
    place: p.place,
    postcode: p.postcode,
    localAuthority: p.localAuthority,
    planningType: p.planningType,
    projectType: p.projectType,
    description: p.description,
    // instructionDate stands in for "completed" display until a separate
    // completion date exists on the schema — see projects.ts scoping note.
    completed: formatInstructionDate(p.instructionDate),
    photoUrl: p.coverPhotoUrl,
    // Not geocoded yet for brand-new entries — falls back to (0, 0) rather
    // than crashing map rendering; real geocoding fills these in later.
    latitude: p.latitude ?? 0,
    longitude: p.longitude ?? 0,

    fullDescription: p.fullDescription ?? undefined,
    constructionCompany: p.constructionCompany ?? undefined,
    awards: (p.awards as { name: string; year: number }[] | null) ?? undefined,
    photos: p.photos.map((photo) => ({
      url: photo.url,
      isBefore: photo.isBefore,
      caption: photo.caption ?? undefined,
    })),
    floorplanBeforeImage: p.floorplanBeforeImage ?? undefined,
    floorplanAfterImage: p.floorplanAfterImage ?? undefined,
    elevationBeforeImage: p.elevationBeforeImage ?? undefined,
    elevationAfterImage: p.elevationAfterImage ?? undefined,
    year: p.year ?? undefined,
    status: p.status ?? undefined,
    services: p.services.map((s) => s.service.title),
    teamNote: p.testimonial ?? undefined,
    metaTitle: p.metaTitle ?? undefined,
    metaDescription: p.metaDescription ?? undefined,
  };
}

export async function getAllProjects(): Promise<ProjectMapSummary[]> {
  const projects = await prisma.project.findMany({
    include: WITH_RELATIONS,
    orderBy: { id: "asc" },
  });
  return projects.map(toSummary);
}

export async function getFeaturedProjects(): Promise<ProjectMapSummary[]> {
  const projects = await prisma.project.findMany({
    where: { featured: true },
    include: WITH_RELATIONS,
    orderBy: { id: "asc" },
  });
  return projects.map(toSummary);
}

export async function getProjectBySlug(
  slug: string,
): Promise<ProjectMapSummary | null> {
  const project = await prisma.project.findFirst({
    where: { featured: true, slug },
    include: WITH_RELATIONS,
  });
  return project ? toSummary(project) : null;
}

export async function getFeaturedProjectSlugs(): Promise<string[]> {
  const projects = await prisma.project.findMany({
    where: { featured: true, slug: { not: null } },
    select: { slug: true },
  });
  return projects.map((p) => p.slug as string);
}

export async function getProjectsByLocalAuthority(
  localAuthority: string,
): Promise<ProjectMapSummary[]> {
  const projects = await prisma.project.findMany({
    where: { localAuthority },
    include: WITH_RELATIONS,
    orderBy: { id: "asc" },
  });
  return projects.map(toSummary);
}

export async function getProjectsByType(
  projectType: ProjectType,
  limit: number,
): Promise<ProjectMapSummary[]> {
  const projects = await prisma.project.findMany({
    where: { projectType },
    include: WITH_RELATIONS,
    orderBy: { id: "asc" },
    take: limit,
  });
  return projects.map(toSummary);
}

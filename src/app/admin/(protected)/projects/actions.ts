"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import type { PlanningType, ProjectType } from "@/generated/prisma/enums";
import {
  createProjectAdmin,
  updateProjectAdmin,
  deleteProjectAdmin,
  getProjectAdmin,
  addProjectPhoto,
  deleteProjectPhoto,
  type ProjectAdminInput,
} from "@/lib/admin/projects";
import { saveProjectImage, deleteProjectImage, isUploadableFile, type UploadRole } from "@/lib/admin/upload";

export type ProjectFormState = { error?: string };

function str(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

function optionalStr(formData: FormData, key: string): string | undefined {
  const v = str(formData, key);
  return v.length > 0 ? v : undefined;
}

type CoreFields = Omit<
  ProjectAdminInput,
  | "coverPhotoUrl"
  | "services"
  | "floorplanBeforeImage"
  | "floorplanAfterImage"
  | "elevationBeforeImage"
  | "elevationAfterImage"
> & { services: number[] };

function parseCoreFields(formData: FormData): CoreFields {
  const instructionDateRaw = str(formData, "instructionDate");
  const yearRaw = str(formData, "year");
  const otherTagsRaw = str(formData, "otherTags");

  const awardNames = formData.getAll("award_name").map(String);
  const awardYears = formData.getAll("award_year").map(String);
  const awards = awardNames
    .map((name, i) => ({ name: name.trim(), year: Number(awardYears[i]) }))
    .filter((a) => a.name.length > 0 && !Number.isNaN(a.year));

  return {
    address: str(formData, "address"),
    place: str(formData, "place"),
    postcode: str(formData, "postcode"),
    localAuthority: str(formData, "localAuthority"),
    planningType: str(formData, "planningType") as PlanningType,
    projectType: str(formData, "projectType") as ProjectType,
    instructionDate: new Date(`${instructionDateRaw}T00:00:00Z`),
    description: str(formData, "description"),
    notes: optionalStr(formData, "notes"),
    featured: formData.get("featured") === "on",
    fullDescription: optionalStr(formData, "fullDescription"),
    constructionCompany: optionalStr(formData, "constructionCompany"),
    year: yearRaw ? Number(yearRaw) : undefined,
    status: optionalStr(formData, "status"),
    slug: optionalStr(formData, "slug"),
    otherTags: otherTagsRaw
      ? otherTagsRaw.split(",").map((t) => t.trim()).filter(Boolean)
      : undefined,
    awards: awards.length > 0 ? awards : undefined,
    testimonial: optionalStr(formData, "testimonial"),
    customerName: optionalStr(formData, "customerName"),
    customerConsent: formData.get("customerConsent") === "on",
    metaTitle: optionalStr(formData, "metaTitle"),
    metaDescription: optionalStr(formData, "metaDescription"),
    services: formData.getAll("services").map(Number).filter((n) => !Number.isNaN(n)),
  };
}

// Single-image fields (cover + the 4 plan images) share the same
// upload-if-present, delete-the-old-one-if-replacing pattern. Returns only
// the columns that actually changed.
const SINGLE_IMAGE_FIELDS: {
  formField: string;
  column: "coverPhotoUrl" | "floorplanBeforeImage" | "floorplanAfterImage" | "elevationBeforeImage" | "elevationAfterImage";
  role: UploadRole;
}[] = [
  { formField: "coverPhoto", column: "coverPhotoUrl", role: "cover" },
  { formField: "floorplanBefore", column: "floorplanBeforeImage", role: "floorplan-before" },
  { formField: "floorplanAfter", column: "floorplanAfterImage", role: "floorplan-after" },
  { formField: "elevationBefore", column: "elevationBeforeImage", role: "elevation-before" },
  { formField: "elevationAfter", column: "elevationAfterImage", role: "elevation-after" },
];

async function applySingleImageUploads(
  formData: FormData,
  projectId: number,
  existingUrls: Partial<Record<string, string | null>>,
): Promise<Partial<Record<string, string>>> {
  const updates: Partial<Record<string, string>> = {};
  for (const { formField, column, role } of SINGLE_IMAGE_FIELDS) {
    const file = formData.get(formField);
    if (!isUploadableFile(file)) continue;
    const oldUrl = existingUrls[column];
    if (oldUrl) await deleteProjectImage(oldUrl);
    updates[column] = await saveProjectImage(file, projectId, role);
  }
  return updates;
}

async function applyGalleryUploads(formData: FormData, projectId: number) {
  const before = formData.getAll("galleryBeforePhotos").filter(isUploadableFile);
  for (const file of before) {
    const url = await saveProjectImage(file, projectId, "gallery-before");
    await addProjectPhoto(projectId, { url, isBefore: true });
  }
  const after = formData.getAll("galleryAfterPhotos").filter(isUploadableFile);
  for (const file of after) {
    const url = await saveProjectImage(file, projectId, "gallery-after");
    await addProjectPhoto(projectId, { url, isBefore: false });
  }
}

export async function saveProjectAction(
  _prevState: ProjectFormState,
  formData: FormData,
): Promise<ProjectFormState> {
  const idRaw = str(formData, "id");
  const isEdit = idRaw.length > 0;

  const core = parseCoreFields(formData);
  if (!core.address || !core.place || !core.postcode || !core.localAuthority) {
    return { error: "Address, place, postcode and local authority are required." };
  }
  if (Number.isNaN(core.instructionDate.getTime())) {
    return { error: "Instruction date is required." };
  }

  try {
    let projectId: number;

    if (!isEdit) {
      // Image uploads need a real project id for their folder path, so the
      // row is created first with a placeholder cover photo, then updated
      // once any uploaded files are saved.
      const created = await createProjectAdmin({
        ...core,
        coverPhotoUrl: "/projects/default.jpg",
      });
      projectId = created.id;

      const imageUpdates = await applySingleImageUploads(formData, projectId, {});
      if (Object.keys(imageUpdates).length > 0) {
        await updateProjectAdmin(projectId, {
          ...core,
          coverPhotoUrl: imageUpdates.coverPhotoUrl ?? "/projects/default.jpg",
          floorplanBeforeImage: imageUpdates.floorplanBeforeImage,
          floorplanAfterImage: imageUpdates.floorplanAfterImage,
          elevationBeforeImage: imageUpdates.elevationBeforeImage,
          elevationAfterImage: imageUpdates.elevationAfterImage,
        });
      }
    } else {
      projectId = Number(idRaw);
      const existing = await getProjectAdmin(projectId);
      if (!existing) return { error: "Project not found." };

      const imageUpdates = await applySingleImageUploads(formData, projectId, {
        coverPhotoUrl: existing.coverPhotoUrl,
        floorplanBeforeImage: existing.floorplanBeforeImage,
        floorplanAfterImage: existing.floorplanAfterImage,
        elevationBeforeImage: existing.elevationBeforeImage,
        elevationAfterImage: existing.elevationAfterImage,
      });

      await updateProjectAdmin(projectId, {
        ...core,
        coverPhotoUrl: imageUpdates.coverPhotoUrl ?? existing.coverPhotoUrl,
        floorplanBeforeImage: imageUpdates.floorplanBeforeImage ?? existing.floorplanBeforeImage ?? undefined,
        floorplanAfterImage: imageUpdates.floorplanAfterImage ?? existing.floorplanAfterImage ?? undefined,
        elevationBeforeImage: imageUpdates.elevationBeforeImage ?? existing.elevationBeforeImage ?? undefined,
        elevationAfterImage: imageUpdates.elevationAfterImage ?? existing.elevationAfterImage ?? undefined,
      });

      const deleteIds = formData
        .getAll("deletePhotoIds")
        .map((v) => Number(v))
        .filter((n) => !Number.isNaN(n));
      for (const photoId of deleteIds) {
        await deleteProjectPhoto(photoId);
      }
    }

    await applyGalleryUploads(formData, projectId);

    revalidatePath("/admin/projects");
    revalidatePath(`/admin/projects/${projectId}/edit`);
    redirect(`/admin/projects/${projectId}/edit`);
  } catch (e) {
    if (e instanceof Error && e.message.includes("Unique constraint")) {
      return { error: "That slug is already used by another project." };
    }
    throw e;
  }
}

export async function deleteProjectFormAction(formData: FormData) {
  const id = Number(formData.get("id"));
  if (!Number.isNaN(id)) {
    await deleteProjectAdmin(id);
  }
  revalidatePath("/admin/projects");
  redirect("/admin/projects");
}

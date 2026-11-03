"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createAssetAdmin, deleteAssetAdmin, getAssetAdmin } from "@/lib/admin/assets";
import { saveAsset, deleteAsset, deleteAwardImage, isUploadableFile } from "@/lib/admin/upload";
import { deleteProjectPhotoByUrl, clearProjectImageField, type ClearableImageField } from "@/lib/admin/projects";
import { clearAwardImage } from "@/lib/admin/awards";

export type AssetUploadState = { error?: string };

export async function uploadAssetsAction(
  _prevState: AssetUploadState,
  formData: FormData,
): Promise<AssetUploadState> {
  const files = formData.getAll("files").filter(isUploadableFile);
  if (files.length === 0) {
    return { error: "Choose at least one file." };
  }

  const label = String(formData.get("label") ?? "").trim() || null;
  const category = String(formData.get("category") ?? "").trim() || null;

  for (const file of files) {
    const { url, fileSizeKb, width, height } = await saveAsset(file);
    await createAssetAdmin({
      filename: file.name,
      url,
      mimeType: file.type || "application/octet-stream",
      fileSizeKb,
      width,
      height,
      label,
      category,
    });
  }

  revalidatePath("/admin/assets");
  redirect("/admin/assets");
}

const ROLE_TO_FIELD: Record<string, ClearableImageField> = {
  "floorplan-before": "floorplanBeforeImage",
  "floorplan-after": "floorplanAfterImage",
  "elevation-before": "elevationBeforeImage",
  "elevation-after": "elevationAfterImage",
};

// Deletes an image that's *owned* by a Project or Award directly (not a
// standalone Asset row) — a gallery photo, a floorplan/elevation, or an
// award badge. Called straight from the asset manager, same as the other
// instant actions elsewhere in admin, so there's no "go find it on the
// project page" detour just to remove a file. A cover photo can't be
// deleted this way — it's a required field, only replaceable.
export async function deleteOwnedImageAction(ownerKind: "project" | "award", ownerId: number, role: string, url: string) {
  if (ownerKind === "award") {
    await clearAwardImage(ownerId);
    await deleteAwardImage(url);
  } else if (role.startsWith("gallery")) {
    await deleteProjectPhotoByUrl(ownerId, url);
  } else if (role in ROLE_TO_FIELD) {
    await clearProjectImageField(ownerId, ROLE_TO_FIELD[role]);
  } else {
    throw new Error(`Can't delete an image with role "${role}" from here.`);
  }

  revalidatePath("/admin/assets");
  revalidatePath(ownerKind === "project" ? `/admin/projects/${ownerId}/edit` : `/admin/awards/${ownerId}/edit`);
}

export async function deleteAssetFormAction(formData: FormData) {
  const id = Number(formData.get("id"));
  if (!Number.isNaN(id)) {
    const existing = await getAssetAdmin(id);
    if (existing) await deleteAsset(existing.url);
    await deleteAssetAdmin(id);
  }
  revalidatePath("/admin/assets");
  redirect("/admin/assets");
}

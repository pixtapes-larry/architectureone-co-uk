"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createAssetAdmin, deleteAssetAdmin, getAssetAdmin } from "@/lib/admin/assets";
import { saveAsset, deleteAsset, isUploadableFile } from "@/lib/admin/upload";

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
    const { url, fileSizeKb } = await saveAsset(file);
    await createAssetAdmin({
      filename: file.name,
      url,
      mimeType: file.type || "application/octet-stream",
      fileSizeKb,
      label,
      category,
    });
  }

  revalidatePath("/admin/assets");
  redirect("/admin/assets");
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

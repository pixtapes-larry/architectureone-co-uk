"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  createAwardAdmin,
  updateAwardAdmin,
  deleteAwardAdmin,
  getAwardAdmin,
  type AwardAdminInput,
} from "@/lib/admin/awards";
import { saveAwardImage, deleteAwardImage, isUploadableFile } from "@/lib/admin/upload";

export type AwardFormState = { error?: string };

function str(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

function parseCoreFields(formData: FormData): AwardAdminInput {
  const projectIdRaw = str(formData, "projectId");
  return {
    name: str(formData, "name"),
    year: Number(str(formData, "year") || new Date().getFullYear()),
    sourceUrl: str(formData, "sourceUrl") || null,
    projectId: projectIdRaw ? Number(projectIdRaw) : null,
  };
}

function revalidateAwards() {
  revalidatePath("/admin/awards");
  revalidatePath("/awards");
  revalidatePath("/");
}

export async function saveAwardAction(
  _prevState: AwardFormState,
  formData: FormData,
): Promise<AwardFormState> {
  const idRaw = str(formData, "id");
  const isEdit = idRaw.length > 0;

  const core = parseCoreFields(formData);
  if (!core.name) {
    return { error: "Award name is required." };
  }

  const imageFile = formData.get("image");
  const libraryUrl = str(formData, "imageLibraryUrl");
  let awardId: number;

  if (isEdit) {
    awardId = Number(idRaw);
    await updateAwardAdmin(awardId, core);
  } else {
    const created = await createAwardAdmin(core);
    awardId = created.id;
  }

  if (libraryUrl) {
    await updateAwardAdmin(awardId, { ...core, imageUrl: libraryUrl });
  } else if (isUploadableFile(imageFile)) {
    const existing = isEdit ? await getAwardAdmin(awardId) : null;
    if (existing?.imageUrl) await deleteAwardImage(existing.imageUrl);
    const imageUrl = await saveAwardImage(imageFile, awardId);
    await updateAwardAdmin(awardId, { ...core, imageUrl });
  }

  revalidateAwards();
  redirect("/admin/awards");
}

export async function deleteAwardFormAction(formData: FormData) {
  const id = Number(formData.get("id"));
  if (!Number.isNaN(id)) {
    const existing = await getAwardAdmin(id);
    if (existing?.imageUrl) await deleteAwardImage(existing.imageUrl);
    await deleteAwardAdmin(id);
  }
  revalidateAwards();
  redirect("/admin/awards");
}

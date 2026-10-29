"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  createAwardAdmin,
  updateAwardAdmin,
  deleteAwardAdmin,
  type AwardAdminInput,
} from "@/lib/admin/awards";

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

  if (isEdit) {
    await updateAwardAdmin(Number(idRaw), core);
  } else {
    await createAwardAdmin(core);
  }

  revalidateAwards();
  redirect("/admin/awards");
}

export async function deleteAwardFormAction(formData: FormData) {
  const id = Number(formData.get("id"));
  if (!Number.isNaN(id)) {
    await deleteAwardAdmin(id);
  }
  revalidateAwards();
  redirect("/admin/awards");
}

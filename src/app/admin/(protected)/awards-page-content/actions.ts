"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { updateAwardsPageContentAdmin } from "@/lib/admin/awards-page-content";

function str(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

function list(formData: FormData, key: string): string[] {
  return formData
    .getAll(key)
    .map(String)
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function saveAwardsPageContentAction(formData: FormData) {
  await updateAwardsPageContentAdmin({
    heading: str(formData, "heading"),
    introParagraphs: list(formData, "introParagraph"),
    metaTitle: str(formData, "metaTitle") || null,
    metaDescription: str(formData, "metaDescription") || null,
  });

  revalidatePath("/awards");
  revalidatePath("/admin/awards-page-content");
  redirect("/admin/awards-page-content");
}

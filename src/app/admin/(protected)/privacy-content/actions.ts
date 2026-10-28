"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { updatePrivacyPageContentAdmin } from "@/lib/admin/privacy-content";

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

export async function savePrivacyContentAction(formData: FormData) {
  await updatePrivacyPageContentAdmin({
    heading: str(formData, "heading"),
    intro: str(formData, "intro"),
    bodyParagraphs: list(formData, "bodyParagraph"),
    lastUpdatedNote: str(formData, "lastUpdatedNote"),
  });

  revalidatePath("/privacy");
  revalidatePath("/admin/privacy-content");
  redirect("/admin/privacy-content");
}

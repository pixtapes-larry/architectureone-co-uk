"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { updateBookConsultationPageContentAdmin } from "@/lib/admin/book-consultation-content";

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

export async function saveBookConsultationPageContentAction(formData: FormData) {
  await updateBookConsultationPageContentAdmin({
    heading: str(formData, "heading"),
    lead: str(formData, "lead"),
    includesHeading: str(formData, "includesHeading"),
    includesList: list(formData, "includesItem"),
    metaTitle: str(formData, "metaTitle") || null,
    metaDescription: str(formData, "metaDescription") || null,
  });

  revalidatePath("/book-a-consultation");
  revalidatePath("/admin/book-consultation-content");
  redirect("/admin/book-consultation-content");
}

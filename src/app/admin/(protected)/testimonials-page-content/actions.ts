"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { updateTestimonialsPageContentAdmin } from "@/lib/admin/testimonials-page-content";

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

export async function saveTestimonialsPageContentAction(formData: FormData) {
  await updateTestimonialsPageContentAdmin({
    heading: str(formData, "heading"),
    introParagraphs: list(formData, "introParagraph"),
    metaTitle: str(formData, "metaTitle") || null,
    metaDescription: str(formData, "metaDescription") || null,
  });

  revalidatePath("/testimonials");
  revalidatePath("/admin/testimonials-page-content");
  redirect("/admin/testimonials-page-content");
}

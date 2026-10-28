"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { updateServicesPageContentAdmin } from "@/lib/admin/services-page-content";

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

export async function saveServicesPageContentAction(formData: FormData) {
  await updateServicesPageContentAdmin({
    heading: str(formData, "heading"),
    introParagraphs: list(formData, "introParagraph"),
    finalCtaHeading: str(formData, "finalCtaHeading"),
    finalCtaLead: str(formData, "finalCtaLead"),
    metaTitle: str(formData, "metaTitle") || null,
    metaDescription: str(formData, "metaDescription") || null,
  });

  revalidatePath("/about/services");
  revalidatePath("/admin/services-page-content");
  redirect("/admin/services-page-content");
}

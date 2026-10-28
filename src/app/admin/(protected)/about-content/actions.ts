"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { updateAboutPageContentAdmin } from "@/lib/admin/about-content";

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

export async function saveAboutContentAction(formData: FormData) {
  await updateAboutPageContentAdmin({
    heroTagline: str(formData, "heroTagline"),
    heroPhotoLabel: str(formData, "heroPhotoLabel"),
    storyParagraphs: list(formData, "storyParagraph"),
    servicesTeaserLead: str(formData, "servicesTeaserLead"),
    reviewsHeading: str(formData, "reviewsHeading"),
    reviewsLead: str(formData, "reviewsLead"),
    reviewsPlaceholderNote: str(formData, "reviewsPlaceholderNote"),
    finalCtaHeading: str(formData, "finalCtaHeading"),
    finalCtaLead: str(formData, "finalCtaLead"),
    metaTitle: str(formData, "metaTitle") || null,
    metaDescription: str(formData, "metaDescription") || null,
  });

  revalidatePath("/about");
  revalidatePath("/admin/about-content");
  redirect("/admin/about-content");
}

"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { updateHomePageContentAdmin } from "@/lib/admin/home-content";

function str(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

function num(formData: FormData, key: string): number {
  return Number(str(formData, key) || "0");
}

function list(formData: FormData, key: string): string[] {
  return formData
    .getAll(key)
    .map(String)
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function saveHomeContentAction(formData: FormData) {
  await updateHomePageContentAdmin({
    heroPill: str(formData, "heroPill"),
    heroHeadingAccent: str(formData, "heroHeadingAccent"),
    heroHeadingRest: str(formData, "heroHeadingRest"),
    heroLead: str(formData, "heroLead"),
    heroPhotoLabel: str(formData, "heroPhotoLabel"),

    statsFoundedYear: num(formData, "statsFoundedYear"),
    statsRating: Number(str(formData, "statsRating") || "0"),
    statsReviewCount: num(formData, "statsReviewCount"),
    statsAwardsWon: num(formData, "statsAwardsWon"),

    audienceHeading: str(formData, "audienceHeading"),
    audienceLead: str(formData, "audienceLead"),

    mapTeaserPillText: str(formData, "mapTeaserPillText"),
    mapTeaserTitle: str(formData, "mapTeaserTitle"),
    mapTeaserLead: str(formData, "mapTeaserLead"),

    guideCoverText: str(formData, "guideCoverText"),
    guideTag: str(formData, "guideTag"),
    guideHeading: str(formData, "guideHeading"),
    guideLead: str(formData, "guideLead"),
    guideButtonLabel: str(formData, "guideButtonLabel"),

    featuredHeading: str(formData, "featuredHeading"),
    featuredLead: str(formData, "featuredLead"),

    awardsLabel: str(formData, "awardsLabel"),
    awardNames: list(formData, "awardName"),

    teamTeaserHeading: str(formData, "teamTeaserHeading"),
    teamTeaserLead: str(formData, "teamTeaserLead"),
    teamTeaserButtonLabel: str(formData, "teamTeaserButtonLabel"),

    finalCtaHeading: str(formData, "finalCtaHeading"),
    finalCtaLead: str(formData, "finalCtaLead"),
  });

  revalidatePath("/");
  revalidatePath("/admin/home-content");
  redirect("/admin/home-content");
}

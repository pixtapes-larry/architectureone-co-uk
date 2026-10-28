"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { updateSiteSettingsAdmin } from "@/lib/admin/site-settings";

function str(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

export async function saveSiteSettingsAction(formData: FormData) {
  const promiseBullets = formData
    .getAll("promiseBullet")
    .map(String)
    .map((b) => b.trim())
    .filter(Boolean);

  await updateSiteSettingsAdmin({
    contactEmail: str(formData, "contactEmail"),
    officeLine1: str(formData, "officeLine1"),
    officePlace: str(formData, "officePlace"),
    officePostcode: str(formData, "officePostcode"),
    officePhone: str(formData, "officePhone"),
    officeLatitude: Number(str(formData, "officeLatitude") || "0"),
    officeLongitude: Number(str(formData, "officeLongitude") || "0"),
    promiseBullets,

    contactHeading: str(formData, "contactHeading"),
    contactLead: str(formData, "contactLead"),
    contactSidebarHeading: str(formData, "contactSidebarHeading"),
    contactEmailUnconfirmedNote: str(formData, "contactEmailUnconfirmedNote"),
    contactMetaTitle: str(formData, "metaTitle") || null,
    contactMetaDescription: str(formData, "metaDescription") || null,

    googleReviewsUrl: str(formData, "googleReviewsUrl") || null,
  });

  // Revalidate every page that reads site settings.
  revalidatePath("/", "layout");

  redirect("/admin/settings");
}

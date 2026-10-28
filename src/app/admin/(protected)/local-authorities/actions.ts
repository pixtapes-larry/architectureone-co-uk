"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { updateLocalAuthorityBlurbAdmin } from "@/lib/admin/local-authorities";
import { localAuthoritySlug } from "@/lib/local-authority-slug";

export async function saveLocalAuthorityBlurbAction(formData: FormData) {
  const name = String(formData.get("name") ?? "");
  const blurb = String(formData.get("blurb") ?? "").trim();
  if (!name) return;

  await updateLocalAuthorityBlurbAdmin(name, blurb);

  revalidatePath("/admin/local-authorities");
  revalidatePath(`/local-authority/${localAuthoritySlug(name)}`);
  redirect("/admin/local-authorities");
}

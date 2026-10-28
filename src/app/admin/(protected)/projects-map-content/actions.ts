"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { updateProjectsMapContentAdmin } from "@/lib/admin/projects-map-content";

function str(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

export async function saveProjectsMapContentAction(formData: FormData) {
  await updateProjectsMapContentAdmin({
    searchHeading: str(formData, "searchHeading"),
    searchLead: str(formData, "searchLead"),
    startingNote: str(formData, "startingNote"),
  });

  revalidatePath("/projects");
  revalidatePath("/admin/projects-map-content");
  redirect("/admin/projects-map-content");
}

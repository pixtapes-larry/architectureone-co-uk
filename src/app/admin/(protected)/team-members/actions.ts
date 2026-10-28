"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  createTeamMemberAdmin,
  updateTeamMemberAdmin,
  deleteTeamMemberAdmin,
  moveTeamMemberAdmin,
  type TeamMemberAdminInput,
} from "@/lib/admin/about-content";

export type TeamMemberFormState = { error?: string };

function str(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

function parseCoreFields(formData: FormData): TeamMemberAdminInput {
  return {
    name: str(formData, "name"),
    role: str(formData, "role"),
    bio: str(formData, "bio"),
    photoLabel: str(formData, "photoLabel"),
  };
}

function revalidateAbout() {
  revalidatePath("/admin/team-members");
  revalidatePath("/about");
}

export async function saveTeamMemberAction(
  _prevState: TeamMemberFormState,
  formData: FormData,
): Promise<TeamMemberFormState> {
  const idRaw = str(formData, "id");
  const isEdit = idRaw.length > 0;

  const core = parseCoreFields(formData);
  if (!core.name || !core.role || !core.bio) {
    return { error: "Name, role and bio are required." };
  }

  if (isEdit) {
    await updateTeamMemberAdmin(Number(idRaw), core);
  } else {
    await createTeamMemberAdmin(core);
  }

  revalidateAbout();
  redirect("/admin/team-members");
}

export async function deleteTeamMemberFormAction(formData: FormData) {
  const id = Number(formData.get("id"));
  if (!Number.isNaN(id)) {
    await deleteTeamMemberAdmin(id);
  }
  revalidateAbout();
  redirect("/admin/team-members");
}

export async function moveTeamMemberFormAction(formData: FormData) {
  const id = Number(formData.get("id"));
  const direction = formData.get("direction") === "up" ? "up" : "down";
  if (!Number.isNaN(id)) {
    await moveTeamMemberAdmin(id, direction);
  }
  revalidateAbout();
  redirect("/admin/team-members");
}

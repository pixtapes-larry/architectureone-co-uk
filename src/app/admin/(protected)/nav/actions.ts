"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  createNavItemAdmin,
  updateNavItemAdmin,
  deleteNavItemAdmin,
  toggleNavItemVisibleAdmin,
  moveNavItemAdmin,
  type NavItemAdminInput,
} from "@/lib/admin/nav-items";

export type NavItemFormState = { error?: string };

function str(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

function parseCoreFields(formData: FormData): NavItemAdminInput {
  const parentIdRaw = str(formData, "parentId");
  return {
    label: str(formData, "label"),
    href: str(formData, "href"),
    visible: formData.get("visible") === "on",
    parentId: parentIdRaw ? Number(parentIdRaw) : null,
  };
}

function revalidateNav() {
  revalidatePath("/", "layout");
  revalidatePath("/admin/nav");
}

export async function saveNavItemAction(
  _prevState: NavItemFormState,
  formData: FormData,
): Promise<NavItemFormState> {
  const idRaw = str(formData, "id");
  const isEdit = idRaw.length > 0;

  const core = parseCoreFields(formData);
  if (!core.label || !core.href) {
    return { error: "Label and href are required." };
  }
  if (isEdit && core.parentId === Number(idRaw)) {
    return { error: "A nav item can't be its own parent." };
  }

  if (isEdit) {
    await updateNavItemAdmin(Number(idRaw), core);
  } else {
    await createNavItemAdmin(core);
  }

  revalidateNav();
  redirect("/admin/nav");
}

export async function deleteNavItemFormAction(formData: FormData) {
  const id = Number(formData.get("id"));
  if (!Number.isNaN(id)) {
    await deleteNavItemAdmin(id);
  }
  revalidateNav();
  redirect("/admin/nav");
}

export async function toggleNavItemVisibleFormAction(formData: FormData) {
  const id = Number(formData.get("id"));
  if (!Number.isNaN(id)) {
    await toggleNavItemVisibleAdmin(id);
  }
  revalidateNav();
  redirect("/admin/nav");
}

export async function moveNavItemFormAction(formData: FormData) {
  const id = Number(formData.get("id"));
  const direction = formData.get("direction") === "up" ? "up" : "down";
  if (!Number.isNaN(id)) {
    await moveNavItemAdmin(id, direction);
  }
  revalidateNav();
  redirect("/admin/nav");
}

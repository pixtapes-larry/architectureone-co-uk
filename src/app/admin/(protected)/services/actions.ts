"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  createServiceAdmin,
  updateServiceAdmin,
  deleteServiceAdmin,
  type ServiceAdminInput,
} from "@/lib/admin/services";

export type ServiceFormState = { error?: string };

function str(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

function parseCoreFields(formData: FormData): ServiceAdminInput {
  return {
    slug: str(formData, "slug"),
    title: str(formData, "title"),
    description: str(formData, "description"),
    group: str(formData, "group"),
    groupNote: str(formData, "groupNote") || undefined,
    sortOrder: Number(str(formData, "sortOrder") || "0"),
  };
}

function revalidateAllConsumers() {
  revalidatePath("/admin/services");
  revalidatePath("/about/services");
  revalidatePath("/permitted-development");
  revalidatePath("/permitted-development/[slug]", "page");
  revalidatePath("/packages/[slug]", "page");
}

export async function saveServiceAction(
  _prevState: ServiceFormState,
  formData: FormData,
): Promise<ServiceFormState> {
  const idRaw = str(formData, "id");
  const isEdit = idRaw.length > 0;

  const core = parseCoreFields(formData);
  if (!core.slug || !core.title || !core.description || !core.group) {
    return { error: "Slug, title, description and group are required." };
  }

  try {
    if (isEdit) {
      await updateServiceAdmin(Number(idRaw), core);
    } else {
      await createServiceAdmin(core);
    }
  } catch (e) {
    if (e instanceof Error && e.message.includes("Unique constraint")) {
      return { error: "That slug is already used by another service." };
    }
    throw e;
  }

  revalidateAllConsumers();
  redirect("/admin/services");
}

export async function deleteServiceFormAction(formData: FormData) {
  const id = Number(formData.get("id"));
  if (!Number.isNaN(id)) {
    try {
      await deleteServiceAdmin(id);
    } catch (e) {
      // FK is ON DELETE RESTRICT — thrown when a project or package still
      // references this service.
      if (e instanceof Error && e.message.includes("Foreign key constraint")) {
        redirect("/admin/services?error=in-use");
      }
      throw e;
    }
  }
  revalidateAllConsumers();
  redirect("/admin/services");
}

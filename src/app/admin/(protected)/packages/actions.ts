"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  createPackageAdmin,
  updatePackageAdmin,
  deletePackageAdmin,
  updatePackageNoteAdmin,
  type PackageAdminInput,
} from "@/lib/admin/packages";

export type PackageFormState = { error?: string };

function str(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

function parseCoreFields(formData: FormData): PackageAdminInput {
  const expectLabels = formData.getAll("expect_label").map(String);
  const expectCounts = formData.getAll("expect_count").map(String);
  const expectations = expectLabels
    .map((label, i) => {
      const countRaw = expectCounts[i]?.trim() ?? "";
      return {
        label: label.trim(),
        count: countRaw.length > 0 ? Number(countRaw) : null,
      };
    })
    .filter((e) => e.label.length > 0);

  const includedIds = formData
    .getAll("service_included")
    .map((v) => Number(v))
    .filter((n) => !Number.isNaN(n));
  const services = includedIds.map((serviceId) => ({
    serviceId,
    constraintNote: str(formData, `constraint_${serviceId}`) || undefined,
  }));

  return {
    slug: str(formData, "slug"),
    name: str(formData, "name"),
    price: str(formData, "price"),
    featured: formData.get("featured") === "on",
    sortOrder: Number(str(formData, "sortOrder") || "0"),
    expectations,
    services,
    metaTitle: str(formData, "metaTitle") || null,
    metaDescription: str(formData, "metaDescription") || null,
  };
}

export async function savePackageAction(
  _prevState: PackageFormState,
  formData: FormData,
): Promise<PackageFormState> {
  const idRaw = str(formData, "id");
  const isEdit = idRaw.length > 0;

  const core = parseCoreFields(formData);
  if (!core.slug || !core.name || !core.price) {
    return { error: "Slug, name and price are required." };
  }

  try {
    if (isEdit) {
      await updatePackageAdmin(Number(idRaw), core);
    } else {
      await createPackageAdmin(core);
    }
  } catch (e) {
    if (e instanceof Error && e.message.includes("Unique constraint")) {
      return { error: "That slug is already used by another package." };
    }
    throw e;
  }

  revalidatePath("/admin/packages");
  revalidatePath("/packages/[slug]", "page");
  redirect("/admin/packages");
}

export async function deletePackageFormAction(formData: FormData) {
  const id = Number(formData.get("id"));
  if (!Number.isNaN(id)) {
    await deletePackageAdmin(id);
  }
  revalidatePath("/admin/packages");
  redirect("/admin/packages");
}

export async function saveNoteAction(formData: FormData) {
  const note = str(formData, "note");
  await updatePackageNoteAdmin(note);
  revalidatePath("/admin/packages");
  revalidatePath("/packages/[slug]", "page");
  redirect("/admin/packages");
}

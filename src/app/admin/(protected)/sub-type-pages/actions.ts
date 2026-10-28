"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { updateSubTypePageAdmin, type SubTypePageAdminInput } from "@/lib/admin/sub-type-pages";
import { subTypeCategoryHref, type SubTypePageConfig } from "@/lib/sub-type-pages";
import type { ProjectType } from "@/generated/prisma/enums";

export type SubTypePageFormState = { error?: string };

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

function pairs(formData: FormData, keyA: string, keyB: string): { a: string; b: string }[] {
  const as = formData.getAll(keyA).map(String);
  const bs = formData.getAll(keyB).map(String);
  return as
    .map((a, i) => ({ a: a.trim(), b: (bs[i] ?? "").trim() }))
    .filter((p) => p.a.length > 0);
}

function triples(
  formData: FormData,
  keyA: string,
  keyB: string,
  keyC: string,
): { a: string; b: string; c: string }[] {
  const as = formData.getAll(keyA).map(String);
  const bs = formData.getAll(keyB).map(String);
  const cs = formData.getAll(keyC).map(String);
  return as
    .map((a, i) => ({ a: a.trim(), b: (bs[i] ?? "").trim(), c: (cs[i] ?? "").trim() }))
    .filter((p) => p.a.length > 0);
}

function parseCoreFields(formData: FormData): SubTypePageAdminInput {
  const planningCardTriples = pairs(formData, "planningCard_title", "planningCard_description");
  const stepTriples = pairs(formData, "step_title", "step_description");
  const typeItemTriples = triples(
    formData,
    "typeItem_title",
    "typeItem_photoLabel",
    "typeItem_description",
  );

  return {
    heroTitle: str(formData, "heroTitle"),
    heroTagline: str(formData, "heroTagline"),
    heroPhotoLabel: str(formData, "heroPhotoLabel"),
    aboutParagraphs: list(formData, "aboutParagraph"),

    typesSectionHeading: str(formData, "typesSectionHeading"),
    typesSectionLead: str(formData, "typesSectionLead"),
    typesSectionItems: typeItemTriples.map((t) => ({
      title: t.a,
      photoLabel: t.b,
      description: t.c,
    })),

    planningHeading: str(formData, "planningHeading"),
    planningCards: planningCardTriples.map((p) => ({ title: p.a, description: p.b })),
    steps: stepTriples.map((p) => ({ title: p.a, description: p.b })),

    pricingKind: str(formData, "pricingKind") as "packages" | "quote",
    pricingQuoteLead: str(formData, "pricingQuoteLead"),

    ctaQuestion: str(formData, "ctaQuestion"),

    metaTitle: str(formData, "metaTitle"),
    metaDescription: str(formData, "metaDescription"),
  };
}

export async function saveSubTypePageAction(
  _prevState: SubTypePageFormState,
  formData: FormData,
): Promise<SubTypePageFormState> {
  const id = Number(str(formData, "id"));
  const projectType = str(formData, "projectType") as ProjectType;
  const core = parseCoreFields(formData);

  if (!core.heroTitle || !core.planningHeading || !core.ctaQuestion) {
    return { error: "Hero title, planning heading and CTA question are required." };
  }

  await updateSubTypePageAdmin(id, core);

  revalidatePath("/admin/sub-type-pages");
  revalidatePath(subTypeCategoryHref({ projectType } as SubTypePageConfig));
  redirect("/admin/sub-type-pages");
}

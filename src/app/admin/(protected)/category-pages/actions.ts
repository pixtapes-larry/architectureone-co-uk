"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { updateCategoryPageAdmin, type CategoryPageAdminInput } from "@/lib/admin/category-pages";
import type { ProjectType } from "@/generated/prisma/enums";

export type CategoryPageFormState = { error?: string };

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

// Parallel arrays aligned by index (same convention as Package
// bullets/expectations) — e.g. consideration_title[] + consideration_description[].
function pairs(
  formData: FormData,
  keyA: string,
  keyB: string,
): { a: string; b: string }[] {
  const as = formData.getAll(keyA).map(String);
  const bs = formData.getAll(keyB).map(String);
  return as
    .map((a, i) => ({ a: a.trim(), b: (bs[i] ?? "").trim() }))
    .filter((p) => p.a.length > 0);
}

function parseSubTypeCards(formData: FormData): CategoryPageAdminInput["subTypeCards"] {
  const count = Number(str(formData, "cardCount") || "0");
  const cards: CategoryPageAdminInput["subTypeCards"] = [];
  for (let i = 0; i < count; i++) {
    const title = str(formData, `card_${i}_title`);
    if (!title) continue;
    cards.push({
      projectType: str(formData, `card_${i}_projectType`) as ProjectType,
      title,
      photoLabel: str(formData, `card_${i}_photoLabel`),
      routeTag: str(formData, `card_${i}_routeTag`) || undefined,
      bullets: list(formData, `card_${i}_bullet`),
    });
  }
  return cards;
}

function parsePlanningRouteItems(formData: FormData): CategoryPageAdminInput["planningRouteItems"] {
  const titles = formData.getAll("planningRouteItem_title").map(String);
  const descriptions = formData.getAll("planningRouteItem_description").map(String);
  const hrefs = formData.getAll("planningRouteItem_href").map(String);
  return titles
    .map((title, i) => ({
      title: title.trim(),
      description: (descriptions[i] ?? "").trim(),
      href: (hrefs[i] ?? "").trim() || undefined,
    }))
    .filter((item) => item.title.length > 0);
}

function parseCoreFields(formData: FormData): CategoryPageAdminInput {
  const planningRouteKind = str(formData, "planningRouteKind") as "" | "text" | "grid";
  const considerationPairs = pairs(formData, "consideration_title", "consideration_description");
  const feesRowPairs = pairs(formData, "feesRow_label", "feesRow_amount");
  const closingItemTitles = formData.getAll("closingItem_label").map(String);
  const closingItemHrefs = formData.getAll("closingItem_href").map(String);
  const closingItemDescriptions = formData.getAll("closingItem_description").map(String);
  const closingItems = closingItemTitles
    .map((label, i) => ({
      label: label.trim(),
      href: (closingItemHrefs[i] ?? "").trim(),
      description: (closingItemDescriptions[i] ?? "").trim(),
    }))
    .filter((c) => c.label.length > 0);

  return {
    category: str(formData, "category") as CategoryPageAdminInput["category"],
    crumbLabel: str(formData, "crumbLabel"),
    heroTitle: str(formData, "heroTitle"),
    heroTagline: str(formData, "heroTagline"),
    heroPhotoLabel: str(formData, "heroPhotoLabel"),
    introHeading: str(formData, "introHeading"),
    introParagraphs: list(formData, "introParagraph"),
    subTypesHeading: str(formData, "subTypesHeading"),
    subTypesFooterNote: str(formData, "subTypesFooterNote"),

    planningRouteKind,
    planningRouteParagraphs: list(formData, "planningRouteParagraph"),
    planningRouteLead: str(formData, "planningRouteLead"),
    planningRouteItems: parsePlanningRouteItems(formData),

    pricingKind: str(formData, "pricingKind") as "packages" | "quote",
    pricingQuoteLead: str(formData, "pricingQuoteLead"),

    feesHeading: str(formData, "feesHeading"),
    feesIntro: str(formData, "feesIntro"),
    feesRows: feesRowPairs.map((p) => ({ label: p.a, amount: p.b })),
    feesNote: str(formData, "feesNote"),

    considerationsHeading: str(formData, "considerationsHeading"),
    considerations: considerationPairs.map((p) => ({ title: p.a, description: p.b })),

    closingKind: str(formData, "closingKind") as "trust-and-services" | "more-than-drawings",
    closingItems,

    homeTeaserTitle: str(formData, "homeTeaserTitle"),
    homeTeaserTag: str(formData, "homeTeaserTag"),
    homeTeaserBlurb: str(formData, "homeTeaserBlurb"),
    homeTeaserLinkLabel: str(formData, "homeTeaserLinkLabel"),
    homeTeaserPhotoLabel: str(formData, "homeTeaserPhotoLabel"),

    subTypeCards: parseSubTypeCards(formData),
  };
}

export async function saveCategoryPageAction(
  _prevState: CategoryPageFormState,
  formData: FormData,
): Promise<CategoryPageFormState> {
  const id = Number(str(formData, "id"));
  const core = parseCoreFields(formData);

  if (!core.heroTitle || !core.introHeading || !core.considerationsHeading) {
    return { error: "Hero title, intro heading and considerations heading are required." };
  }

  await updateCategoryPageAdmin(id, core);

  revalidatePath("/admin/category-pages");
  revalidatePath(`/${core.category}`);
  revalidatePath("/");
  redirect("/admin/category-pages");
}

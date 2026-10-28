// DB-backed content for Project Type ("sub-type") pages — the pages one
// level below a category (e.g. Permitted Development → Outbuildings). One
// SubTypePageTemplate renders all of them — only the config differs, same
// pattern as CategoryPageTemplate/category-pages.ts. Previously hardcoded
// objects here; now read from SubTypePage/SubTypePageTypeItem (see
// prisma/schema.prisma) via prisma/seed-category-subtype-pages.ts.

import { prisma } from "./prisma";
import type { ProjectType } from "@/generated/prisma/enums";
import type { PricingSection } from "./category-pages";
import { CATEGORY_LABELS, PROJECT_TYPE_CATEGORY } from "./project-labels";

export type ProcessStep = { title: string; description: string };

export type TypesSection = {
  heading: string;
  lead: string;
  items: { title: string; photoLabel: string; description: string }[];
};

export type SubTypePageConfig = {
  projectType: ProjectType;
  heroTitle: string;
  heroTagline: string;
  heroPhotoLabel: string;
  aboutParagraphs: string[];
  // An extra, optional sub-variety breakdown between the Examples gallery
  // and the planning-rules cards — only Loft Conversions uses this so far
  // (pitched/dormer/hip-to-gable/box), since lofts carry more genuine
  // technical variety than the other project types.
  typesSection?: TypesSection;
  planningHeading: string;
  planningCards: { title: string; description: string }[];
  steps: ProcessStep[];
  pricing: PricingSection;
  ctaQuestion: string;
  metaTitle: string | null;
  metaDescription: string | null;
};

// Every sub-type page closes the same way — a simple "more than just
// drawings" Tendering Process note — so it isn't repeated per config.
// Generic boilerplate, not page-specific narrative, so kept as a plain
// shared constant rather than making it 10x-admin-editable.
export const SUB_TYPE_CLOSING = {
  heading: "More than just drawings",
  lead: "We support you well beyond the design stage — here's what else is included along the way.",
  items: [
    {
      label: "Tendering Process",
      description: "helping you find the right builder for your project",
    },
  ],
};

export function subTypeCategoryLabel(config: SubTypePageConfig) {
  return CATEGORY_LABELS[PROJECT_TYPE_CATEGORY[config.projectType]];
}

export function subTypeCategoryHref(config: SubTypePageConfig) {
  const category = PROJECT_TYPE_CATEGORY[config.projectType];
  return category === "permitted-development"
    ? "/permitted-development"
    : category === "large-extensions"
      ? "/large-extensions"
      : "/new-builds-developments";
}

export async function getSubTypePageConfig(
  projectType: ProjectType,
): Promise<SubTypePageConfig> {
  const row = await prisma.subTypePage.findUniqueOrThrow({
    where: { projectType },
    include: { typesSectionItems: { orderBy: { sortOrder: "asc" } } },
  });

  const pricing: PricingSection =
    row.pricingKind === "quote"
      ? { kind: "quote", lead: row.pricingQuoteLead ?? "" }
      : { kind: "packages" };

  return {
    projectType: row.projectType,
    heroTitle: row.heroTitle,
    heroTagline: row.heroTagline,
    heroPhotoLabel: row.heroPhotoLabel,
    aboutParagraphs: row.aboutParagraphs as string[],
    typesSection: row.typesSectionHeading
      ? {
          heading: row.typesSectionHeading,
          lead: row.typesSectionLead ?? "",
          items: row.typesSectionItems.map((item) => ({
            title: item.title,
            photoLabel: item.photoLabel,
            description: item.description,
          })),
        }
      : undefined,
    planningHeading: row.planningHeading,
    planningCards: row.planningCards as { title: string; description: string }[],
    steps: row.steps as ProcessStep[],
    pricing,
    ctaQuestion: row.ctaQuestion,
    metaTitle: row.metaTitle,
    metaDescription: row.metaDescription,
  };
}

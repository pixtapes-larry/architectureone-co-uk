import { prisma } from "../prisma";
import type { ProjectType } from "@/generated/prisma/enums";
import type { ProcessStep } from "../sub-type-pages";

const WITH_ITEMS = {
  typesSectionItems: { orderBy: { sortOrder: "asc" as const } },
};

export async function listSubTypePagesAdmin() {
  return prisma.subTypePage.findMany({ orderBy: { projectType: "asc" } });
}

export async function getSubTypePageAdmin(projectType: ProjectType) {
  return prisma.subTypePage.findUnique({
    where: { projectType },
    include: WITH_ITEMS,
  });
}

export type TypeSectionItemInput = {
  title: string;
  photoLabel: string;
  description: string;
};

export type SubTypePageAdminInput = {
  heroTitle: string;
  heroTagline: string;
  heroPhotoLabel: string;
  aboutParagraphs: string[];

  typesSectionHeading: string;
  typesSectionLead: string;
  typesSectionItems: TypeSectionItemInput[];

  planningHeading: string;
  planningCards: { title: string; description: string }[];
  steps: ProcessStep[];

  pricingKind: "packages" | "quote";
  pricingQuoteLead: string;

  ctaQuestion: string;

  metaTitle: string;
  metaDescription: string;
};

function toCoreData(input: SubTypePageAdminInput) {
  const hasTypesSection = input.typesSectionHeading.trim().length > 0;
  return {
    heroTitle: input.heroTitle,
    heroTagline: input.heroTagline,
    heroPhotoLabel: input.heroPhotoLabel,
    aboutParagraphs: input.aboutParagraphs,

    typesSectionHeading: hasTypesSection ? input.typesSectionHeading : null,
    typesSectionLead: hasTypesSection ? input.typesSectionLead : null,

    planningHeading: input.planningHeading,
    planningCards: input.planningCards,
    steps: input.steps,

    pricingKind: input.pricingKind,
    pricingQuoteLead: input.pricingKind === "quote" ? input.pricingQuoteLead : undefined,

    ctaQuestion: input.ctaQuestion,

    metaTitle: input.metaTitle || null,
    metaDescription: input.metaDescription || null,
  };
}

// Sub-type pages are a fixed set of 10 (created once via the original
// migration seed) — only update is needed, not create.
export async function updateSubTypePageAdmin(
  id: number,
  input: SubTypePageAdminInput,
) {
  const hasTypesSection = input.typesSectionHeading.trim().length > 0;
  return prisma.$transaction([
    prisma.subTypePageTypeItem.deleteMany({ where: { subTypePageId: id } }),
    prisma.subTypePage.update({
      where: { id },
      data: {
        ...toCoreData(input),
        typesSectionItems: hasTypesSection
          ? {
              create: input.typesSectionItems.map((item, i) => ({
                title: item.title,
                photoLabel: item.photoLabel,
                description: item.description,
                sortOrder: i,
              })),
            }
          : undefined,
      },
    }),
  ]);
}

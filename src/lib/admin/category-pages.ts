import { prisma } from "../prisma";
import type { ProjectType } from "@/generated/prisma/enums";
import type { Category } from "../project-labels";
import type { ConsiderationItem, PlanningRouteGridItem } from "../category-pages";

const WITH_CARDS = {
  subTypeCards: { orderBy: { sortOrder: "asc" as const } },
};

export async function listCategoryPagesAdmin() {
  return prisma.categoryPage.findMany({ orderBy: { category: "asc" } });
}

export async function getCategoryPageAdmin(category: string) {
  return prisma.categoryPage.findUnique({
    where: { category },
    include: WITH_CARDS,
  });
}

export type CategorySubTypeCardInput = {
  projectType: ProjectType;
  title: string;
  photoLabel: string;
  routeTag?: string;
  bullets: string[];
};

export type CategoryPageAdminInput = {
  category: Category;
  crumbLabel: string;
  heroTitle: string;
  heroTagline: string;
  heroPhotoLabel: string;
  introHeading: string;
  introParagraphs: string[];
  subTypesHeading: string;
  subTypesFooterNote: string;

  planningRouteKind: "" | "text" | "grid";
  planningRouteParagraphs: string[];
  planningRouteLead: string;
  planningRouteItems: PlanningRouteGridItem[];

  pricingKind: "packages" | "quote";
  pricingQuoteLead: string;

  feesHeading: string;
  feesIntro: string;
  feesRows: { label: string; amount: string }[];
  feesNote: string;

  considerationsHeading: string;
  considerations: ConsiderationItem[];

  closingKind: "trust-and-services" | "more-than-drawings";
  closingItems: { label: string; href: string; description: string }[];

  // The "Which project sounds like yours?" teaser card for this category
  // on the home page — leave all blank to omit the card entirely.
  homeTeaserTitle: string;
  homeTeaserTag: string;
  homeTeaserBlurb: string;
  homeTeaserLinkLabel: string;
  homeTeaserPhotoLabel: string;

  subTypeCards: CategorySubTypeCardInput[];

  metaTitle: string;
  metaDescription: string;
};

function toCoreData(input: CategoryPageAdminInput) {
  const hasFees = input.feesHeading.trim().length > 0;
  return {
    category: input.category,
    crumbLabel: input.crumbLabel,
    heroTitle: input.heroTitle,
    heroTagline: input.heroTagline,
    heroPhotoLabel: input.heroPhotoLabel,
    introHeading: input.introHeading,
    introParagraphs: input.introParagraphs,
    subTypesHeading: input.subTypesHeading,
    subTypesFooterNote: input.subTypesFooterNote,

    planningRouteKind: input.planningRouteKind || null,
    planningRouteParagraphs:
      input.planningRouteKind === "text" ? input.planningRouteParagraphs : undefined,
    planningRouteLead: input.planningRouteKind === "grid" ? input.planningRouteLead : undefined,
    planningRouteItems: input.planningRouteKind === "grid" ? input.planningRouteItems : undefined,

    pricingKind: input.pricingKind,
    pricingQuoteLead: input.pricingKind === "quote" ? input.pricingQuoteLead : undefined,

    feesHeading: hasFees ? input.feesHeading : null,
    feesIntro: hasFees ? input.feesIntro : null,
    feesRows: hasFees ? input.feesRows : undefined,
    feesNote: hasFees ? input.feesNote : null,

    considerationsHeading: input.considerationsHeading,
    considerations: input.considerations,

    closingKind: input.closingKind,
    closingItems: input.closingKind === "more-than-drawings" ? input.closingItems : undefined,

    homeTeaserTitle: input.homeTeaserTitle || null,
    homeTeaserTag: input.homeTeaserTag || null,
    homeTeaserBlurb: input.homeTeaserBlurb || null,
    homeTeaserLinkLabel: input.homeTeaserLinkLabel || null,
    homeTeaserPhotoLabel: input.homeTeaserPhotoLabel || null,

    metaTitle: input.metaTitle || null,
    metaDescription: input.metaDescription || null,
  };
}

// Category pages are a fixed set of 3 (created once via the original
// migration seed) — only update is needed, not create, but this mirrors
// the Project/Package pattern for consistency.
export async function updateCategoryPageAdmin(
  id: number,
  input: CategoryPageAdminInput,
) {
  return prisma.$transaction([
    prisma.categorySubTypeCard.deleteMany({ where: { categoryPageId: id } }),
    prisma.categoryPage.update({
      where: { id },
      data: {
        ...toCoreData(input),
        subTypeCards: {
          create: input.subTypeCards.map((card, i) => ({
            projectType: card.projectType,
            title: card.title,
            photoLabel: card.photoLabel,
            routeTag: card.routeTag || null,
            bullets: card.bullets,
            sortOrder: i,
          })),
        },
      },
    }),
  ]);
}

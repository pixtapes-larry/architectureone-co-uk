// DB-backed content for the 3 category pages (Permitted Development,
// Large Extensions, New Builds & Developments). One CategoryPageTemplate
// renders all 3 — only the config differs. Previously hardcoded objects
// here; now read from CategoryPage/CategorySubTypeCard (see
// prisma/schema.prisma) via prisma/seed-category-subtype-pages.ts.

import { prisma } from "./prisma";
import { PROJECT_TYPE_ROUTES, type Category } from "./project-labels";

export type SubTypeCard = {
  title: string;
  photoLabel: string;
  routeTag?: string; // e.g. "OFTEN PD", "CLASS Q" — New Builds page only
  bullets: string[];
  href: string;
  learnLabel: string;
};

export type ConsiderationItem = { title: string; description: string };

// Same shape as ConsiderationItem, plus an optional link through to the
// sub-type page the item is describing (e.g. "Barn Conversions" → its
// own page) — only the "grid" planning-route variant uses this.
export type PlanningRouteGridItem = ConsiderationItem & { href?: string };

export type PricingSection =
  // Tiers/note are fetched live from the DB (src/lib/packages.ts) and
  // passed into CategoryPageTemplate as a separate prop — not stored here.
  | { kind: "packages" }
  | { kind: "quote"; lead: string };

export type PlanningRouteSection =
  | { kind: "text"; paragraphs: string[] }
  | { kind: "grid"; lead: string; items: PlanningRouteGridItem[] };

export type ClosingSection =
  | { kind: "trust-and-services" }
  | {
      kind: "more-than-drawings";
      items: { label: string; href: string; description: string }[];
    };

export type CategoryPageConfig = {
  category: Category;
  crumbLabel: string;
  heroTitle: string;
  heroTagline: string;
  heroPhotoLabel: string;
  introHeading: string;
  introParagraphs: string[];
  subTypesHeading: string;
  subTypes: SubTypeCard[];
  subTypesFooterNote: string;
  planningRoute?: PlanningRouteSection;
  pricing: PricingSection;
  fees?: {
    heading: string;
    intro: string;
    rows: { label: string; amount: string }[];
    note: string;
  };
  considerationsHeading: string;
  considerations: ConsiderationItem[];
  closing: ClosingSection;
  metaTitle: string | null;
  metaDescription: string | null;
};

export type HomeCategoryTeaser = {
  category: Category;
  title: string;
  tag: string;
  blurb: string;
  linkLabel: string;
  photoLabel: string;
};

// The 3 "Which project sounds like yours?" cards on the home page — each
// maps 1:1 to a real CategoryPage row, so this reads a few extra fields
// off that same table rather than duplicating a card system. Title is its
// own field, not heroTitle — they can genuinely differ (e.g. "Loft
// Conversions & Large Extensions" here vs. "Large Extensions" as the hero).
export async function getHomeCategoryTeasers(): Promise<HomeCategoryTeaser[]> {
  const rows = await prisma.categoryPage.findMany({
    orderBy: { category: "asc" },
    select: {
      category: true,
      heroTitle: true,
      homeTeaserTitle: true,
      homeTeaserTag: true,
      homeTeaserBlurb: true,
      homeTeaserLinkLabel: true,
      homeTeaserPhotoLabel: true,
    },
  });
  // Fixed display order (not alphabetical) — matches the original hardcoded
  // card sequence on the home page.
  const order: Category[] = ["permitted-development", "large-extensions", "new-builds-developments"];
  return order
    .map((category) => rows.find((r) => r.category === category))
    .filter((r): r is NonNullable<typeof r> => Boolean(r))
    .map((r) => ({
      category: r.category as Category,
      title: r.homeTeaserTitle ?? r.heroTitle,
      tag: r.homeTeaserTag ?? "",
      blurb: r.homeTeaserBlurb ?? "",
      linkLabel: r.homeTeaserLinkLabel ?? "",
      photoLabel: r.homeTeaserPhotoLabel ?? "",
    }));
}

export async function getCategoryPageConfig(category: Category): Promise<CategoryPageConfig> {
  const row = await prisma.categoryPage.findUniqueOrThrow({
    where: { category },
    include: { subTypeCards: { orderBy: { sortOrder: "asc" } } },
  });

  let planningRoute: PlanningRouteSection | undefined;
  if (row.planningRouteKind === "text") {
    planningRoute = {
      kind: "text",
      paragraphs: row.planningRouteParagraphs as string[],
    };
  } else if (row.planningRouteKind === "grid") {
    planningRoute = {
      kind: "grid",
      lead: row.planningRouteLead ?? "",
      items: row.planningRouteItems as PlanningRouteGridItem[],
    };
  }

  const pricing: PricingSection =
    row.pricingKind === "quote"
      ? { kind: "quote", lead: row.pricingQuoteLead ?? "" }
      : { kind: "packages" };

  const closing: ClosingSection =
    row.closingKind === "more-than-drawings"
      ? {
          kind: "more-than-drawings",
          items: row.closingItems as { label: string; href: string; description: string }[],
        }
      : { kind: "trust-and-services" };

  return {
    category: row.category as Category,
    crumbLabel: row.crumbLabel,
    heroTitle: row.heroTitle,
    heroTagline: row.heroTagline,
    heroPhotoLabel: row.heroPhotoLabel,
    introHeading: row.introHeading,
    introParagraphs: row.introParagraphs as string[],
    subTypesHeading: row.subTypesHeading,
    subTypes: row.subTypeCards.map((card) => ({
      title: card.title,
      photoLabel: card.photoLabel,
      routeTag: card.routeTag ?? undefined,
      bullets: card.bullets as string[],
      href: PROJECT_TYPE_ROUTES[card.projectType],
      learnLabel: `Explore ${card.title} →`,
    })),
    subTypesFooterNote: row.subTypesFooterNote,
    planningRoute,
    pricing,
    fees: row.feesHeading
      ? {
          heading: row.feesHeading,
          intro: row.feesIntro ?? "",
          rows: row.feesRows as { label: string; amount: string }[],
          note: row.feesNote ?? "",
        }
      : undefined,
    considerationsHeading: row.considerationsHeading,
    considerations: row.considerations as ConsiderationItem[],
    closing,
    metaTitle: row.metaTitle,
    metaDescription: row.metaDescription,
  };
}

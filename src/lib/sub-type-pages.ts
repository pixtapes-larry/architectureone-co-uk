// Config-driven content for Project Type ("sub-type") pages — the pages
// one level below a category (e.g. Permitted Development → Outbuildings).
// One SubTypePageTemplate renders all of them — only the config differs,
// same pattern as CategoryPageTemplate/category-pages.ts.

import { ProjectType } from "@/generated/prisma/enums";
import type { ConsiderationItem, PricingSection } from "./category-pages";
import { CATEGORY_LABELS, PROJECT_TYPE_CATEGORY } from "./project-labels";

export type ProcessStep = { title: string; description: string };

export type SubTypePageConfig = {
  projectType: ProjectType;
  heroTitle: string;
  heroTagline: string;
  heroPhotoLabel: string;
  aboutParagraphs: string[];
  planningHeading: string;
  planningCards: ConsiderationItem[];
  steps: ProcessStep[];
  pricing: PricingSection;
  ctaQuestion: string;
};

// Every sub-type page closes the same way — a simple "more than just
// drawings" Tendering Process note — so it isn't repeated per config.
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

// TODO: package tier scope bullets are placeholders, same caveat as the
// Permitted Development category page — not yet locked with Luke.
const PD_PACKAGE_TIERS = [
  {
    name: "Starter",
    price: "£1,199",
    bullets: ["Scope to be confirmed", "Scope to be confirmed", "Scope to be confirmed"],
  },
  {
    name: "Standard",
    price: "£1,799",
    featured: true,
    bullets: ["Scope to be confirmed", "Scope to be confirmed", "Scope to be confirmed"],
  },
  {
    name: "Extended",
    price: "£2,499",
    bullets: ["Scope to be confirmed", "Scope to be confirmed", "Scope to be confirmed"],
  },
];

export const outbuildingsConfig: SubTypePageConfig = {
  projectType: ProjectType.OUTBUILDINGS,
  heroTitle: "Outbuildings",
  heroTagline:
    "A whole new room, right in your garden — without touching the house itself.",
  heroPhotoLabel: "[Hero photo — a finished garden room or outbuilding]",
  aboutParagraphs: [
    "A garden room, studio, home office, gym or garage can be one of the quickest ways to add genuinely useful space — and it often doesn't touch your home's footprint at all.",
    "Architecture ONE can help you realise your vision for a new and enhanced way of living — whether that's a quiet space to work from home, a studio for a hobby, or simply more storage done properly.",
  ],
  planningHeading: "What's achievable within Permitted Development",
  planningCards: [
    {
      title: "Height & position",
      description:
        "Up to 2.5m high within 2m of a boundary, 4m elsewhere with a dual-pitched roof (3m for other roof types). Single storey, and nothing forward of the front of your house.",
    },
    {
      title: "The garden coverage rule",
      description:
        "All outbuildings and extensions together can't cover more than half your garden — existing sheds and garages count against this, so it's worth checking early what's left.",
    },
    {
      title: "Worth knowing",
      description:
        "A space intended for sleeping always needs planning permission, whatever the size. Not available within the grounds of a listed building, or beside the house on designated land.",
    },
  ],
  steps: [
    {
      title: "Initial conversation",
      description:
        "We talk through how you'd like to use the space, and get an early feel for what fits your garden.",
    },
    {
      title: "Measured survey & design",
      description:
        "We survey the plot and check the remaining garden-coverage allowance before finalising a design.",
    },
    {
      title: "Lawful Development Certificate (if applicable)",
      description:
        "Where the project qualifies as Permitted Development, we recommend applying for this — it protects the work and confirms it's within the rules.",
    },
    {
      title: "Building Regulations",
      description:
        "Needed once a building passes a certain size or is used habitably — we'll tell you plainly if this applies to your project.",
    },
    {
      title: "Ready to build",
      description:
        "You're left with a complete, buildable set of drawings to hand to your builder.",
    },
  ],
  pricing: {
    kind: "packages",
    tiers: PD_PACKAGE_TIERS,
    note: "All exclude planning/structural/other third-party fees. Working guide prices only — not yet locked.",
  },
  ctaQuestion: "Think your project could work this way?",
};

export const largeOutbuildingsConfig: SubTypePageConfig = {
  projectType: ProjectType.LARGE_OUTBUILDINGS,
  heroTitle: "Large Outbuildings",
  heroTagline:
    "An annexe, a granny annexe, or a garden building that goes beyond Permitted Development.",
  heroPhotoLabel: "[Hero photo — a finished annexe or large garden building]",
  aboutParagraphs: [
    "Once a garden building is meant for someone to live in independently — a granny annexe for a parent, a self-contained space for a grown-up child — or is simply bigger than Permitted Development allows, it needs full planning permission rather than the simpler PD route. That means more design freedom, not less.",
    "Architecture ONE can help you realise your vision for a new and enhanced way of living, whatever the reason for wanting separate space on your plot.",
  ],
  planningHeading: "What to expect with full planning",
  planningCards: [
    {
      title: "Separate living accommodation",
      description:
        "An annexe intended for someone to live in independently always needs full planning permission, whatever its size.",
    },
    {
      title: "Size beyond PD limits",
      description:
        "Garden buildings over Permitted Development's height/coverage limits (2.5m/4m, or more than half your garden) fall into this category too.",
    },
    {
      title: "Worth knowing",
      description:
        "Councils often attach a condition tying an annexe's use to the main house (an \"ancillary use\" condition) — we'll talk you through what that means in practice.",
    },
  ],
  steps: [
    {
      title: "Initial conversation",
      description:
        "We talk through who the space is for, how it needs to work, and get an early feel for what's achievable on your plot.",
    },
    {
      title: "Measured survey & design",
      description:
        "We survey the plot and put together a design that works for the site and for planning.",
    },
    {
      title: "Full planning application",
      description:
        "We prepare and submit the application, and manage any queries from the planning officer along the way.",
    },
    {
      title: "Building Regulations",
      description:
        "We prepare the drawings needed for Building Regulations approval once the design is settled.",
    },
    {
      title: "Ready to build",
      description:
        "You're left with a complete, buildable set of drawings to hand to your builder.",
    },
  ],
  pricing: {
    kind: "quote",
    lead: "Projects at this scale are quoted individually rather than through fixed packages — annexes and larger garden buildings vary too much in size and specification for a fixed-tier price to make sense.",
  },
  ctaQuestion: "Think your project could work this way?",
};

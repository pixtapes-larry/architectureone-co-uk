// Config-driven content for Project Type ("sub-type") pages — the pages
// one level below a category (e.g. Permitted Development → Outbuildings).
// One SubTypePageTemplate renders all of them — only the config differs,
// same pattern as CategoryPageTemplate/category-pages.ts.

import { ProjectType } from "@/generated/prisma/enums";
import type { ConsiderationItem, PricingSection } from "./category-pages";
import { CATEGORY_LABELS, PROJECT_TYPE_CATEGORY } from "./project-labels";
import { PD_PACKAGE_TIERS, PD_PACKAGE_NOTE } from "./packages";

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
    note: PD_PACKAGE_NOTE,
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

export const smallWrapAroundExtensionsConfig: SubTypePageConfig = {
  projectType: ProjectType.SMALL_WRAP_AROUND_EXTENSIONS,
  heroTitle: "Small & Wrap Around Extensions",
  heroTagline:
    "The kind of space that transforms how a home actually lives.",
  heroPhotoLabel: "[Hero photo — a finished small or wraparound extension]",
  aboutParagraphs: [
    "Small & wraparound extensions typically fall within Permitted Development, and can be a great way to create a large kitchen diner or open living space, add a downstairs bedroom or wet room, or add a home office, cinema room or garden room.",
    "Architecture ONE can help you realise your vision for a new and enhanced way of living — helping you get the most out of your home, and potentially add value to your property.",
  ],
  planningHeading: "What's achievable within Permitted Development",
  planningCards: [
    {
      title: "Rear extensions",
      description:
        "Up to 4m beyond the original rear wall for a detached home, 3m for other house types — a popular way to open up a kitchen or living space onto the garden.",
    },
    {
      title: "Side extensions",
      description:
        "Up to half the width of your original house — often used to add a utility room, home office, or wider hallway.",
    },
    {
      title: "Wraparound designs",
      description:
        "Rear and side combined into one continuous space, single storey throughout, keeping the design straightforward.",
    },
  ],
  steps: [
    {
      title: "Initial conversation",
      description:
        "We talk through your home, your goals, and get an early feel for what's achievable.",
    },
    {
      title: "Measured survey & design",
      description:
        "We survey the property and put together a design that fits your space and your budget.",
    },
    {
      title: "Lawful Development Certificate (if applicable)",
      description:
        "Where the project qualifies as Permitted Development, we recommend applying for this — it protects the work and confirms it's within the rules.",
    },
    {
      title: "Building Regulations",
      description:
        "We prepare the drawings needed for Building Regulations approval, regardless of the planning route.",
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
    note: PD_PACKAGE_NOTE,
  },
  ctaQuestion: "Think your project could work this way?",
};

export const garageConversionsConfig: SubTypePageConfig = {
  projectType: ProjectType.GARAGE_CONVERSIONS,
  heroTitle: "Garage Conversions",
  heroTagline: "Space you already have, put to better use.",
  heroPhotoLabel: "[Hero photo — a finished garage conversion]",
  aboutParagraphs: [
    "Garage conversions typically fall within Permitted Development, and can be a great way to add a playroom, home gym, snug or teenager's den, a home office, or an extra bedroom — all without extending your home's footprint at all.",
    "Architecture ONE can help you realise your vision for a new and enhanced way of living — helping you get the most out of space you already have, and potentially add value to your property.",
  ],
  planningHeading: "What's achievable within Permitted Development",
  planningCards: [
    {
      title: "Integral & attached garages",
      description:
        "Converting the space is usually treated as an internal alteration — Building Regs only, no planning application. A popular way to add a home office, gym or extra reception room.",
    },
    {
      title: "Detached garages",
      description:
        "Straightforward where the building stays ancillary to the house. New windows or doors facing a highway are worth checking with us first.",
    },
    {
      title: "Keep the parking, gain the space",
      description:
        "Many designs replace the garage door with a window or wall while finding space for parking elsewhere — you don't have to choose one over the other.",
    },
  ],
  steps: [
    {
      title: "Initial conversation",
      description:
        "We talk through your garage, your goals for the space, and get an early feel for what's achievable.",
    },
    {
      title: "Measured survey & design",
      description:
        "We survey the space and put together a design that fits how you want to use it, and your budget.",
    },
    {
      title: "Lawful Development Certificate (if applicable)",
      description:
        "Where the project qualifies as Permitted Development, we recommend applying for this — it protects the work and confirms it's within the rules.",
    },
    {
      title: "Building Regulations",
      description:
        "We prepare the drawings needed for Building Regulations approval — insulation, fire safety and damp-proofing all matter here.",
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
    note: PD_PACKAGE_NOTE,
  },
  ctaQuestion: "Think your project could work this way?",
};

export const loftConversionsConfig: SubTypePageConfig = {
  projectType: ProjectType.LOFT_CONVERSIONS,
  heroTitle: "Loft Conversions",
  heroTagline:
    "A whole extra room, without changing your home's footprint.",
  heroPhotoLabel: "[Hero photo — a finished loft conversion]",
  aboutParagraphs: [
    "Loft conversions typically fall within Permitted Development, and can be a great way to add a main bedroom with en-suite, a home office, a playroom or a media room — all without changing your home's footprint.",
    "Architecture ONE can help you realise your vision for a new and enhanced way of living — helping you get the most out of your home, and potentially add value to your property.",
  ],
  typesSection: {
    heading: "Loft conversion types",
    lead: "Which type suits your home depends on your roof shape and how much extra space you need — here's a plain-English guide to the main four.",
    items: [
      {
        title: "Pitched Roof Conversion",
        photoLabel: "[Pitched roof diagram]",
        description:
          "Follows the line of your existing roof to create a room within it — the simplest option, and often the most straightforward to build.",
      },
      {
        title: "Flat-Roofed Dormer",
        photoLabel: "[Flat dormer diagram]",
        description:
          "Part of the rear-facing roof is replaced with a flat-roofed projection, adding valuable extra headroom and floor space.",
      },
      {
        title: "Hip-to-Gable",
        photoLabel: "[Hip-to-gable diagram]",
        description:
          "Turns a sloped \"hip\" end wall into a vertical gable — a common way to add significant space on detached and semi-detached homes.",
      },
      {
        title: "Box Dormer",
        photoLabel: "[Box dormer diagram]",
        description:
          "A larger dormer spanning most or all of the roof width — maximises usable space and headroom where the roof allows it.",
      },
    ],
  },
  planningHeading: "What's achievable within Permitted Development",
  planningCards: [
    {
      title: "Volume allowance",
      description:
        "Up to 50m³ of extra roof space (detached/semi-detached), 40m³ for terraced homes. Any previous roof additions count towards this, even ones you didn't build.",
    },
    {
      title: "Roofline & height",
      description:
        "Stays within the existing ridge height — no need to go higher than the house next door. Can't project beyond the front-facing roof slope.",
    },
    {
      title: "Windows & dormers",
      description:
        "Side-facing windows are obscure-glazed for privacy. Dormers sit back at least 200mm from the original eaves.",
    },
  ],
  steps: [
    {
      title: "Initial conversation",
      description:
        "We talk through how you'd like to use the space — a bedroom, office, or something else — and get an early feel for what's achievable.",
    },
    {
      title: "Measured survey, design & structural check",
      description:
        "We survey the roof and put together a design, including an early look at what the existing floor and roof structure can support.",
    },
    {
      title: "Lawful Development Certificate (if applicable)",
      description:
        "Where the project qualifies as Permitted Development, we recommend applying for this — it protects the work and confirms it's within the rules.",
    },
    {
      title: "Structural engineering & Building Regulations",
      description:
        "Lofts almost always need a structural engineer for floor strengthening — we coordinate this alongside the Building Regulations drawings.",
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
    note: PD_PACKAGE_NOTE,
  },
  ctaQuestion: "Think your project could work this way?",
};

export const largeSingleStoreyExtensionsConfig: SubTypePageConfig = {
  projectType: ProjectType.LARGE_SINGLE_STOREY_EXTENSIONS,
  heroTitle: "Large Single Storey Extensions",
  heroTagline: "Real transformation, more room to design freely.",
  heroPhotoLabel: "[Hero photo — a finished large single-storey extension]",
  aboutParagraphs: [
    "Once a single-storey extension goes beyond the small-scale Permitted Development limits, it opens up real design freedom — more space, more flexibility in layout, and the chance to properly reshape how a home works.",
    "Architecture ONE can help you realise your vision for a new and enhanced way of living — whether that's a wraparound ground floor that transforms your whole living space, a large open-plan kitchen diner, or a garden room that finally makes the most of your plot.",
  ],
  planningHeading: "What's achievable",
  planningCards: [
    {
      title: "The Larger Home Extension route",
      description:
        "Up to 8m beyond the original rear wall (detached) or 6m (other houses) — still without full planning, via prior approval and neighbour consultation. Not available on designated land or Sites of Special Scientific Interest.",
    },
    {
      title: "Full planning permission",
      description:
        "No fixed depth limit — designed to properly suit your plot and your plans. Opens up side extensions beyond the half-width limit, and more ambitious wraparound designs.",
    },
    {
      title: "Reworking the ground floor",
      description:
        "A large extension is often the moment to reconfigure the whole ground floor, not just add to it. Open-plan kitchen diners and garden rooms are some of our most requested projects.",
    },
  ],
  steps: [
    {
      title: "Initial conversation",
      description:
        "We talk through your home, your goals, and get an early feel for what's achievable and which route fits best.",
    },
    {
      title: "Measured survey & design",
      description:
        "We survey the property and put together a design that fits your space and your budget.",
    },
    {
      title: "Prior approval or planning application",
      description:
        "We manage whichever route your project needs — neighbour consultation for the Larger Home Extension scheme, or a full planning application.",
    },
    {
      title: "Structural engineering & Building Regulations",
      description:
        "We coordinate structural input and prepare the drawings needed for Building Regulations approval.",
    },
    {
      title: "Ready to build",
      description:
        "You're left with a complete, buildable set of drawings to hand to your builder.",
    },
  ],
  pricing: {
    kind: "quote",
    lead: "Projects at this scale are quoted individually rather than through fixed packages — every large extension is different, and the design possibilities are wider than a small-scale project allows for.",
  },
  ctaQuestion: "Think your project could work this way?",
};

export const largeTwoStoreyExtensionsConfig: SubTypePageConfig = {
  projectType: ProjectType.LARGE_TWO_STOREY_EXTENSIONS,
  heroTitle: "Large Two Storey Extensions",
  heroTagline: "A full extra storey of real, lasting space.",
  heroPhotoLabel: "[Hero photo — a finished large two-storey extension]",
  aboutParagraphs: [
    "A two-storey extension is often the single most cost-effective way to add real, lasting space to a home — the foundations and roof are already accounted for, so you're getting two floors of new room for close to the cost of one.",
    "Architecture ONE can help you realise your vision for a new and enhanced way of living — whether that's an extra bedroom and bathroom upstairs with a bigger kitchen diner below, or a complete reshaping of how your home works across both floors.",
  ],
  planningHeading: "What's achievable",
  planningCards: [
    {
      title: "The Permitted Development exception",
      description:
        "A two-storey rear extension can still qualify as Permitted Development — up to 3m beyond the original rear wall, and at least 7m from the boundary opposite. Side extensions can't be more than one storey under this route.",
    },
    {
      title: "Full planning permission",
      description:
        "Opens up two-storey side extensions, and rear extensions beyond the 3m/7m limits. Not available at all on designated land for multi-storey rear work — we'll tell you plainly which route applies.",
    },
    {
      title: "A genuine two-for-one",
      description:
        "Bedrooms, en-suites and living space added in a single project — often the most efficient way to add significant square footage to a home.",
    },
  ],
  steps: [
    {
      title: "Initial conversation",
      description:
        "We talk through your home, your goals, and get an early feel for what's achievable and which route fits best.",
    },
    {
      title: "Measured survey & design",
      description:
        "We survey the property and put together a design that fits your space and your budget, across both floors.",
    },
    {
      title: "Planning route & Party Wall matters",
      description:
        "We manage the planning application, and — since two-storey work is almost always close to a shared wall — any Party Wall Agreement your neighbours need.",
    },
    {
      title: "Structural engineering & Building Regulations",
      description:
        "We coordinate structural input and prepare the drawings needed for Building Regulations approval.",
    },
    {
      title: "Ready to build",
      description:
        "You're left with a complete, buildable set of drawings to hand to your builder.",
    },
  ],
  pricing: {
    kind: "quote",
    lead: "Projects at this scale are quoted individually rather than through fixed packages — every two-storey extension is different, and the design possibilities are wider than a small-scale project allows for.",
  },
  ctaQuestion: "Think your project could work this way?",
};

export const barnConversionsConfig: SubTypePageConfig = {
  projectType: ProjectType.BARN_CONVERSIONS,
  heroTitle: "Barn Conversions",
  heroTagline: "Real character, turned into a real home.",
  heroPhotoLabel: "[Hero photo — a finished barn conversion]",
  aboutParagraphs: [
    "Converting a redundant agricultural building is one of the most rewarding projects we take on — the chance to turn genuine rural character into a home that still feels like the building it always was.",
    "Architecture ONE can help you realise your vision for a new and enhanced way of living — our team includes a specialist in the niche legislation, ecology and biodiversity requirements this kind of project brings.",
  ],
  planningHeading: "What's achievable under Class Q",
  planningCards: [
    {
      title: "Scale",
      description:
        "Up to 465m² of agricultural building, converted into up to 5 homes (no more than 3 over 100m² each) — decided through prior approval, not a full planning application.",
    },
    {
      title: "Eligibility",
      description:
        "The building must have been used solely for agriculture, as part of an established agricultural unit. Can't go ahead where an agricultural tenancy still stands in the way.",
    },
    {
      title: "Worth knowing early",
      description:
        "Barns are a common bat roost — a protected species survey is often needed before work can start. The works must be reasonably necessary for conversion, not effectively a rebuild.",
    },
  ],
  steps: [
    {
      title: "Initial conversation & eligibility check",
      description:
        "We establish the building's agricultural history and tenancy status before anything else — it decides which route is even available.",
    },
    {
      title: "Ecology & survey work",
      description:
        "A bat survey and other ecology checks are arranged early, since they can affect timing and design.",
    },
    {
      title: "Measured survey & design",
      description:
        "We survey the structure and design around what the building can genuinely support, keeping new work to what's reasonably necessary.",
    },
    {
      title: "Prior approval application",
      description:
        "We submit and manage the Class Q prior approval application — the council has 56 days to decide.",
    },
    {
      title: "Building Regulations & ready to build",
      description:
        "We prepare the Building Regulations drawings, and you're left with a complete, buildable set for your builder.",
    },
  ],
  pricing: {
    kind: "quote",
    lead: "Projects at this scale are quoted individually rather than through fixed packages — every barn and every conversion is different.",
  },
  ctaQuestion: "Think your project could work this way?",
};

export const newBuildsConfig: SubTypePageConfig = {
  projectType: ProjectType.NEW_BUILDS,
  heroTitle: "New Builds",
  heroTagline: "A blank sheet of paper, designed entirely around you.",
  heroPhotoLabel: "[Hero photo — a finished new build home]",
  aboutParagraphs: [
    "A new build is the project with the fewest constraints and the most possibility — no existing walls to work around, no original footprint to respect, just a plot and a brief.",
    "Architecture ONE can help you realise your vision for a new and enhanced way of living — from the very first feasibility sketch through to a home that's entirely, genuinely yours.",
  ],
  planningHeading: "What's involved",
  planningCards: [
    {
      title: "Full planning permission",
      description:
        "A new dwelling always goes through a full planning application — there's no Permitted Development route for this. That means complete design freedom, shaped entirely around your brief and the site.",
    },
    {
      title: "Site & feasibility",
      description:
        "We assess access, services, levels and context before design begins, so the brief is grounded in what the plot can actually support.",
    },
    {
      title: "Sustainability & energy",
      description:
        "New dwellings must meet Part L energy requirements — a good opportunity to build in genuinely low-running-cost design from day one.",
    },
  ],
  steps: [
    {
      title: "Initial conversation & feasibility",
      description:
        "We talk through your brief and assess the site — access, levels, services, and what the plot can realistically support.",
    },
    {
      title: "Pre-application advice",
      description:
        "Where it's useful, we take the emerging design to the council for informal feedback before a full application.",
    },
    {
      title: "Design & planning application",
      description:
        "We develop the design and submit the full planning application, including the Design & Access Statement it needs.",
    },
    {
      title: "Technical design & Building Regulations",
      description:
        "We coordinate structural, energy (SAP/Part L) and other specialist input, and prepare the Building Regulations drawings.",
    },
    {
      title: "Ready to build",
      description:
        "You're left with a complete, buildable set of drawings to hand to your builder.",
    },
  ],
  pricing: {
    kind: "quote",
    lead: "Projects at this scale are quoted individually rather than through fixed packages — every plot, brief and budget is different.",
  },
  ctaQuestion: "Think your project could work this way?",
};

export const developmentConfig: SubTypePageConfig = {
  projectType: ProjectType.DEVELOPMENT,
  heroTitle: "Development",
  heroTagline: "Unlocking a site's full potential.",
  heroPhotoLabel: "[Hero photo — a small development of new homes]",
  aboutParagraphs: [
    "A site that can support more than one home is a genuine opportunity — whether that's splitting a large garden plot, redeveloping a single site, or delivering a small scheme of several homes together.",
    "Architecture ONE can help you realise your vision for a new and enhanced way of living, at whatever scale the site allows — and we give a two-home scheme exactly the same thoroughness as a larger one.",
  ],
  planningHeading: "What's involved",
  planningCards: [
    {
      title: "Site capacity",
      description:
        "We assess how many homes a site can genuinely support — access, parking, overlooking and amenity space all factor in.",
    },
    {
      title: "Full planning permission",
      description:
        "Always a full application for this scale of work, often supported by pre-application advice from the council first.",
    },
    {
      title: "Wider contributions",
      description:
        "Larger schemes can involve S106 agreements or affordable housing policy — we'll tell you plainly if this applies to your site.",
    },
  ],
  steps: [
    {
      title: "Initial conversation & capacity study",
      description:
        "We assess what your site can realistically support, and talk through the options that make sense for it.",
    },
    {
      title: "Pre-application advice",
      description:
        "We take the emerging scheme to the council for informal feedback before committing to a full application.",
    },
    {
      title: "Design & masterplanning",
      description:
        "We design the scheme as a whole — layout, access, landscaping — before detailing each individual home.",
    },
    {
      title: "Full planning application",
      description:
        "We submit and manage the application, including any specialist reports the site requires.",
    },
    {
      title: "Building Regulations & delivery",
      description:
        "We prepare the Building Regulations drawings and support you through to a buildable scheme, ready for your builder.",
    },
  ],
  pricing: {
    kind: "quote",
    lead: "Projects at this scale are quoted individually rather than through fixed packages — every site and every scheme is different.",
  },
  ctaQuestion: "Think your project could work this way?",
};

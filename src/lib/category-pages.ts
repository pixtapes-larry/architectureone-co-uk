// Config-driven content for the 3 category pages (Permitted Development,
// Large Extensions, New Builds & Developments). One CategoryPageTemplate
// renders all 3 — only the config differs. When the admin CMS exists,
// these objects get replaced by a database read of the same shape.

import { PROJECT_TYPE_ROUTES, type Category } from "./project-labels";
import { ABOUT_SERVICES_HREF } from "./nav";
import { PD_PACKAGE_TIERS, PD_PACKAGE_NOTE } from "./packages";

export type SubTypeCard = {
  title: string;
  photoLabel: string;
  routeTag?: string; // e.g. "OFTEN PD", "CLASS Q" — New Builds page only
  bullets: string[];
  href: string;
  learnLabel: string;
};

export type ConsiderationItem = { title: string; description: string };

export type PricingSection =
  | {
      kind: "packages";
      tiers: {
        slug?: string; // links "Learn more" to /packages/[slug] when set
        name: string;
        price: string;
        featured?: boolean;
        bullets: string[];
      }[];
      note: string;
    }
  | { kind: "quote"; lead: string };

export type PlanningRouteSection =
  | { kind: "text"; paragraphs: string[] }
  | { kind: "grid"; lead: string; items: ConsiderationItem[] };

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
};

// TODO: package tier scope bullets are placeholders — Luke wants these
// war-gamed against real project experience before they go public (see
// the project brief). Prices are working guide figures, not locked.
export const permittedDevelopmentConfig: CategoryPageConfig = {
  category: "permitted-development",
  crumbLabel: "Small Extensions & Permitted Development",
  heroTitle: "Small Extensions & Permitted Development",
  heroTagline:
    "Extend, convert or develop your loft — often without a full planning application.",
  heroPhotoLabel: "[Hero photo — a representative finished project]",
  introHeading: "What is Permitted Development?",
  introParagraphs: [
    "Permitted Development can make enhancing your home more accessible than people expect. It's a set of national rules that let you extend, convert your garage, or develop your loft without going through a full planning application — often meaning a quicker start and a simpler process from idea to build.",
    "Architecture ONE guides you through it from the very first conversation. We'll help you understand what's achievable for your home, talk through the options, and shape a plan that works for your space and your budget.",
  ],
  subTypesHeading: "Typical Permitted Development projects",
  subTypes: [
    {
      title: "Small & Wrap Around Extensions",
      photoLabel: "[Small / wrap around extension photo]",
      bullets: [
        "Extend to the rear by up to 4m (detached homes) or 3m (other house types)",
        "Side extensions can add up to half the width of your original house",
        "Single-storey designs keep things simple — height stays within everyday limits",
        "Rear and side can often be combined into one wraparound design",
      ],
      href: PROJECT_TYPE_ROUTES.SMALL_WRAP_AROUND_EXTENSIONS,
      learnLabel: "Explore Small & Wrap Around Extensions →",
    },
    {
      title: "Garage Conversions",
      photoLabel: "[Garage conversion photo]",
      bullets: [
        "Turning an integral garage into living space counts as an internal change",
        "No new footprint — you're making the most of space you already have",
        "A straightforward route through Building Regulations once the design is set",
        "Garden and driveway stay exactly as they are",
      ],
      href: PROJECT_TYPE_ROUTES.GARAGE_CONVERSIONS,
      learnLabel: "Explore Garage Conversions →",
    },
    {
      title: "Loft Conversions",
      photoLabel: "[Loft conversion photo]",
      bullets: [
        "Up to 50m³ of extra roof space to work with (detached/semi-detached), 40m³ for terraced homes",
        "Roofline stays consistent with the house next door — no need to go above the ridge",
        "A rear-facing dormer is a popular, simple way to add headroom and light",
        "A full extra room, with no change to your home's footprint",
      ],
      href: PROJECT_TYPE_ROUTES.LOFT_CONVERSIONS,
      learnLabel: "Explore Loft Conversions →",
    },
    {
      title: "Outbuildings",
      photoLabel: "[Garden room / studio photo]",
      bullets: [
        "Garden rooms, garden offices and studios — often built without needing planning permission at all",
        "Single storey, with height capped at 2.5m within 2m of a boundary, 4m elsewhere",
        "Kept within 50% of your garden's total coverage, alongside any other outbuildings",
        "A flexible extra space — a home office, a studio, a gym — without touching the house itself",
      ],
      href: PROJECT_TYPE_ROUTES.OUTBUILDINGS,
      learnLabel: "Explore Outbuildings →",
    },
  ],
  subTypesFooterNote:
    "Considering another type of project under Permitted Development? We can help with this too — from porches to home gyms and beyond.",
  pricing: {
    kind: "packages",
    tiers: PD_PACKAGE_TIERS,
    note: PD_PACKAGE_NOTE,
  },
  fees: {
    heading: "Potential Professional Fees",
    intro:
      "Sometimes there are additional or recommended costs alongside our fee — payments to the Local Authority, or specialist input required as part of the planning or Building Regulations process.",
    rows: [
      {
        label:
          "Householder planning application fee — only applies if a full planning application is actually needed, not for genuine PD projects",
        amount: "£528*",
      },
      {
        label:
          "Lawful Development Certificate — optional for PD projects, but recommended; proves it later, roughly half the planning fee",
        amount: "£265*",
      },
      {
        label:
          "Building Regulations fee — set by the local authority, varies by project size and route (Full Plans or Building Notice)",
        amount: "quoted per project",
      },
      {
        label: "Structural engineer (survey, calculations, site visits)",
        amount: "from £575*",
      },
      {
        label: "Party Wall Agreement (semi-detached / shared walls)",
        amount: "~£1,250*",
      },
    ],
    note: "*Working figures — re-verify against the live council/Planning Portal rate before publishing; fees are reviewed periodically.",
  },
  considerationsHeading: "Additional considerations",
  considerations: [
    {
      title: "Lawful Development",
      description:
        "Genuine PD doesn't need a planning application, but an optional Lawful Development Certificate protects your work and confirms it qualifies.",
    },
    {
      title: "Original House Rule",
      description:
        "PD allowances are based on your house as originally built — any extension added by a previous owner already counts against it.",
    },
    {
      title: "Conservation Areas & AONBs",
      description:
        "Conservation Areas and AONBs still allow PD in most cases, though the rules tighten — side extensions usually need a full application instead.",
    },
    {
      title: "Listed Buildings",
      description:
        "Needs Listed Building Consent rather than Permitted Development — not a barrier, just a different route we know well.",
    },
    {
      title: "Article 4 Directions",
      description:
        "Some streets have had PD rights removed by the council via an Article 4 direction — easy to check, easy to miss.",
    },
    {
      title: "Trees & TPOs",
      description:
        "Protected trees follow their own rules, separate from planning — we factor this in early so it's never a late surprise.",
    },
  ],
  closing: { kind: "trust-and-services" },
};

export const largeExtensionsConfig: CategoryPageConfig = {
  category: "large-extensions",
  crumbLabel: "Large Single Storey Extensions & Large Two Storey Extensions",
  heroTitle: "Large Extensions",
  heroTagline:
    "More space, more freedom to reshape how your home works.",
  heroPhotoLabel: "[Hero photo — a finished large or two-storey extension]",
  introHeading: "Bigger projects, more design freedom",
  introParagraphs: [
    "Once a project goes beyond what Permitted Development allows, it opens up real design freedom — more space, more flexibility in layout, and the chance to properly reshape how a home works. It's less constrained than a small extension, and we help you make the most of that.",
    "Architecture ONE can help you realise your vision for a new and enhanced way of living — whether that's a wraparound ground floor that transforms your whole living space, or an extra storey that changes the home for good.",
  ],
  subTypesHeading: "Two ways this typically happens",
  subTypes: [
    {
      title: "Large Single Storey Extensions",
      photoLabel: "[Large extension photo]",
      bullets: [
        "Bigger single-storey rear, side or wraparound extensions beyond the Permitted Development limits of 4m at the rear",
        "Room to reconfigure how the ground floor works, not just add to it",
      ],
      href: PROJECT_TYPE_ROUTES.LARGE_SINGLE_STOREY_EXTENSIONS,
      learnLabel: "Explore Large Single Storey Extensions →",
    },
    {
      title: "Large Two Storey Extensions",
      photoLabel: "[Two storey extension photo]",
      bullets: [
        "Adds a full extra storey's worth of space — often the most cost-effective way to gain significant room",
        "A genuine opportunity to add bedrooms and living space in one project",
        "Covers rear and side extensions — a two-storey side extension typically goes through full planning permission",
      ],
      href: PROJECT_TYPE_ROUTES.LARGE_TWO_STOREY_EXTENSIONS,
      learnLabel: "Explore Large Two Storey Extensions →",
    },
  ],
  subTypesFooterNote:
    "Considering something that doesn't quite fit either? We can help with this too.",
  planningRoute: {
    kind: "text",
    paragraphs: [
      "Most projects at this scale go through full planning permission — and that's a good thing, not a hurdle. It means more scope to design exactly what suits your home, rather than working within fixed Permitted Development limits.",
      "Some two-storey rear extensions can still qualify as Permitted Development, provided they don't extend more than 3m beyond the original rear wall and stay at least 7m from the boundary opposite. We'll tell you plainly which route your project falls under, and manage the application either way.",
    ],
  },
  pricing: {
    kind: "quote",
    lead: "Projects at this scale are quoted individually rather than through fixed packages — every large or two-storey extension is different, and the design possibilities are wider than the small-scale packages allow for.",
  },
  considerationsHeading: "Additional considerations",
  considerations: [
    {
      title: "Party Wall Agreements",
      description:
        "Two-storey work close to a shared wall almost always needs a Party Wall Agreement with your neighbour — we factor this in from the start.",
    },
    {
      title: "Neighbour Consultation Scheme",
      description:
        "Larger single-storey extensions using the Permitted Development route involve notifying neighbouring properties — a straightforward process we manage for you.",
    },
    {
      title: "Conservation Areas & AONBs",
      description:
        "Still achievable in most cases, though the design approach and consultation process can look a little different — worth talking through early.",
    },
  ],
  closing: {
    kind: "more-than-drawings",
    items: [
      {
        label: "Tendering Process",
        href: ABOUT_SERVICES_HREF,
        description: "helping you find the right builder for your project",
      },
    ],
  },
};

export const newBuildsDevelopmentsConfig: CategoryPageConfig = {
  category: "new-builds-developments",
  crumbLabel: "New Builds & Developments",
  heroTitle: "New Builds & Developments",
  heroTagline: "From a granny annexe to a brand new home.",
  heroPhotoLabel: "[Hero photo — a finished new build or barn conversion]",
  introHeading: "The widest range of what we do",
  introParagraphs: [
    "This category covers the broadest spread of any on the site — from an annexe for an elderly parent or a grown-up child, through to converting a redundant barn into a home, right up to a brand new house or a small development of several.",
    "Architecture ONE can help you realise your vision for a new and enhanced way of living, whatever scale that starts at.",
  ],
  subTypesHeading: "Four ways this typically happens",
  subTypes: [
    {
      title: "Large Outbuildings",
      photoLabel: "[Annexe / large outbuilding photo]",
      routeTag: "FULL PLANNING",
      bullets: [
        "Annexes, granny annexes and garden buildings beyond what Permitted Development allows",
        "Intended for separate living accommodation, rather than just a home office or studio",
        "Needs full planning permission once it's a genuine extra home on the plot",
      ],
      href: PROJECT_TYPE_ROUTES.LARGE_OUTBUILDINGS,
      learnLabel: "Explore Large Outbuildings →",
    },
    {
      title: "Barn Conversions",
      photoLabel: "[Barn conversion photo]",
      routeTag: "CLASS Q",
      bullets: [
        "Converting a redundant agricultural building into one or more homes, via prior approval",
      ],
      href: PROJECT_TYPE_ROUTES.BARN_CONVERSIONS,
      learnLabel: "Explore Barn Conversions →",
    },
    {
      title: "New Builds",
      photoLabel: "[New build photo]",
      routeTag: "FULL PLANNING",
      bullets: ["A brand new home, designed from a blank sheet of paper"],
      href: PROJECT_TYPE_ROUTES.NEW_BUILDS,
      learnLabel: "Explore New Builds →",
    },
    {
      title: "Development",
      photoLabel: "[Development photo]",
      routeTag: "FULL PLANNING",
      bullets: ["Small-scale developments of several homes on one site"],
      href: PROJECT_TYPE_ROUTES.DEVELOPMENT,
      learnLabel: "Explore Development →",
    },
  ],
  subTypesFooterNote:
    "Considering something that doesn't quite fit any of these? We can help with this too.",
  planningRoute: {
    kind: "grid",
    lead: "This category genuinely spans every route there is — which route applies depends entirely on what you're starting with.",
    items: [
      {
        title: "Large Outbuildings",
        description:
          "Once an outbuilding goes beyond Permitted Development limits, or is intended as separate living accommodation — an annexe for a relative, say — it needs full planning permission rather than sitting under the simpler PD route.",
      },
      {
        title: "Barn Conversions",
        description:
          "Class Q allows up to 465m² of agricultural building, and up to 5 homes, to be converted via prior approval rather than a full application — provided the site was solely agricultural, with no current tenancy in the way.",
      },
      {
        title: "New Builds & Development",
        description:
          "A genuinely new dwelling always needs full planning permission — which also means complete design freedom, shaped entirely around your brief.",
      },
    ],
  },
  pricing: {
    kind: "quote",
    lead: "Projects at this scale are quoted individually rather than through fixed packages — every outbuilding, conversion, new build and development is different, and so is the right fee for it.",
  },
  considerationsHeading: "Additional considerations",
  considerations: [
    {
      title: "Agricultural use & tenancy history",
      description:
        "A Class Q conversion depends on the building having been solely agricultural, with no active tenancy standing in the way — we help establish this early.",
    },
    {
      title: "Green Belt & designated land",
      description:
        "New builds and outbuildings both face tighter rules on Green Belt and designated land — still achievable in many cases, worth talking through from the outset.",
    },
    {
      title: "Biodiversity Net Gain",
      description:
        "Most new builds and developments now need a Biodiversity Net Gain assessment — one of the specialist reports we coordinate on your behalf.",
    },
  ],
  closing: {
    kind: "more-than-drawings",
    items: [
      {
        label: "Tendering Process",
        href: ABOUT_SERVICES_HREF,
        description: "helping you find the right builder for your project",
      },
    ],
  },
};

// Config-driven content for the 3 category pages (Permitted Development,
// Large Extensions, New Builds & Developments). One CategoryPageTemplate
// renders all 3 — only the config differs. When the admin CMS exists,
// these objects get replaced by a database read of the same shape.

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

export type PricingSection =
  | {
      kind: "packages";
      tiers: {
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
  ],
  subTypesFooterNote:
    "Considering another type of project under Permitted Development? We can help with this too — from porches to outbuildings and beyond.",
  pricing: {
    kind: "packages",
    tiers: [
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
    ],
    note: "All exclude planning/structural/other third-party fees (see below). Working guide prices only — not yet locked.",
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

// Real project data ported from the localtest/ Leaflet prototype (10
// properties, geocoded via postcodes.io). Shaped to match the Prisma
// Project model field names, so swapping this for a real
// `prisma.project.findMany(...)` call later is a one-line change.
// Delete this file once the real harvested data (tomorrow's visit +
// ongoing) is imported.
//
// localAuthority values below are inferred from the town/outcode, NOT
// confirmed against real records yet — flag for the harvesting pass.

import { ProjectType, PlanningType } from "@/generated/prisma/enums";

export type ProjectMapSummary = {
  slug: string | null; // null for non-featured pins — nothing to link to
  featured: boolean;
  address: string;
  place: string;
  postcode: string; // outcode only for now (e.g. "IP7") — full postcode TBC
  localAuthority: string;
  planningType: PlanningType;
  projectType: ProjectType;
  description: string;
  completed: string; // "—" where not yet known
  photoUrl: string; // always set — "default.jpg" stands in where no real photo exists yet
  latitude: number;
  longitude: number;

  // --- Case-study fields, Featured only — all optional because none of
  // these 10 demo properties have real harvested case-study content yet.
  // Matches the real Project model's Featured-only fields exactly (see
  // prisma/schema.prisma) so a real DB record slots in with no reshaping.
  fullDescription?: string;
  constructionCompany?: string; // "Builder"
  awards?: { name: string; year: number }[];
  // additional gallery photos beyond photoUrl — isBefore matches the real
  // ProjectPhoto.isBefore column, so grouping into Before/After at render
  // time works the same way a real query result would.
  photos?: { url: string; isBefore: boolean; caption?: string }[];
  floorplanBeforeImage?: string;
  floorplanAfterImage?: string;
  elevationBeforeImage?: string;
  elevationAfterImage?: string;
  year?: number;
  status?: string;
  services?: string[]; // service titles — e.g. "Measured Survey"
  teamNote?: string; // "A note from the team" — only ever real, never fabricated
};

export const MOCK_PROJECTS: ProjectMapSummary[] = [
  {
    slug: null,
    featured: false,
    address: "99 George Street",
    place: "Hadleigh, Suffolk",
    postcode: "IP7",
    localAuthority: "Babergh",
    planningType: PlanningType.PERMITTED_DEVELOPMENT,
    projectType: ProjectType.SMALL_WRAP_AROUND_EXTENSIONS,
    description: "Project details to be added.",
    completed: "—",
    photoUrl: "/projects/default.jpg",
    latitude: 52.045584,
    longitude: 0.959212,
  },
  {
    slug: "co10-groton-black-pheasant-barn",
    featured: true,
    address: "Black Pheasant Barn",
    place: "Castlings Heath, Groton, Suffolk",
    postcode: "CO10",
    localAuthority: "Babergh",
    planningType: PlanningType.PRIOR_APPROVAL,
    projectType: ProjectType.BARN_CONVERSIONS,
    description:
      "LABC award-winning barn conversion to a 4/5 bed family home, using original barn materials in new features.",
    completed: "Mar 2023",
    photoUrl: "/projects/p2-pheasant-barn.jpg",
    latitude: 52.048605,
    longitude: 0.875409,
    awards: [{ name: "LABC Regional Winner", year: 2023 }],
    // Flagship demo content — stock photos/drawings standing in so the
    // Featured Project template can be seen fully populated. Not real
    // archive material; swap for the real thing once harvested. No new
    // facts invented beyond what's already in `description` above (the
    // award, the 4/5 bed brief, retaining original barn materials,
    // Class Q prior approval). Deliberately no `teamNote` — that field
    // is reserved for an actually-real quote, never a fabricated one.
    fullDescription:
      "The brief was to bring a redundant agricultural barn back into use as a 4/5 bed family home, without losing the character that made the building worth converting in the first place. We worked within Class Q, securing prior approval for the change of use while keeping the works to what the existing structure could genuinely support.\n\nOriginal barn materials — timber framing, cladding, roof structure — were retained and worked into the new design wherever possible, rather than stripped out and replaced. The result reads as a barn that's been lived into, not a new house wearing a barn's shell.\n\nCompleted in March 2023, the project went on to win an LABC Regional Award, recognising both the technical handling of the conversion and the quality of the finished home.",
    photos: [
      { url: "/projects/pheasant-barn-before-1.jpg", isBefore: true },
      { url: "/projects/pheasant-barn-before-2.jpg", isBefore: true },
      { url: "/projects/pheasant-barn-after-1.jpg", isBefore: false },
      { url: "/projects/pheasant-barn-after-2.jpg", isBefore: false },
    ],
    floorplanBeforeImage: "/projects/pheasant-barn-floorplan-before.jpg",
    floorplanAfterImage: "/projects/pheasant-barn-floorplan-after.jpg",
    elevationBeforeImage: "/projects/pheasant-barn-elevation-before.jpg",
    elevationAfterImage: "/projects/pheasant-barn-elevation-after.jpg",
    // Plausible for a Class Q barn conversion, not yet verified against
    // this specific project's real records — flag for the harvesting pass.
    services: [
      "Prior Approval Applications (Class Q / Larger Home Extension)",
      "Measured Survey",
      "Site & Location Plans",
      "Elevations & Floor Plans",
      "Structural Surveys & Calculations",
      "Ecology Surveys (e.g. bat surveys)",
      "Building Regulations Drawings",
      "Building Regulations Application / Building Notice",
      "Tendering Process",
      "Quality Control",
      "On Site Support",
    ],
  },
  {
    slug: null,
    featured: false,
    address: "Mill House",
    place: "Mill Road, Felsted, Essex",
    postcode: "CM6",
    localAuthority: "Braintree Borough Council",
    planningType: PlanningType.PERMITTED_DEVELOPMENT,
    projectType: ProjectType.SMALL_WRAP_AROUND_EXTENSIONS,
    description: "Project details to be added.",
    completed: "—",
    photoUrl: "/projects/default.jpg",
    latitude: 51.854423,
    longitude: 0.428746,
  },
  {
    slug: "ip8-hintlesham-tintagel",
    featured: true,
    address: "Tintagel",
    place: "Hintlesham, Suffolk",
    postcode: "IP8",
    localAuthority: "Babergh",
    planningType: PlanningType.PERMITTED_DEVELOPMENT,
    projectType: ProjectType.SMALL_WRAP_AROUND_EXTENSIONS,
    description:
      "New front entrance and single-storey rear extension with double roof lanterns and large sliding doors to the garden.",
    completed: "Aug 2025",
    photoUrl: "/projects/p11-tintagel.jpg",
    latitude: 52.058624,
    longitude: 1.063034,
  },
  {
    slug: "co9-sible-hedingham-harrow-cross",
    featured: true,
    address: "Harrow Cross House",
    place: "Harrow Cross Road, Sible Hedingham, Essex",
    postcode: "CO9",
    localAuthority: "Braintree Borough Council",
    planningType: PlanningType.FULL_PLANNING,
    projectType: ProjectType.LARGE_TWO_STOREY_EXTENSIONS,
    description:
      "Second-storey extension adding two bedrooms, a new side entrance and a cart lodge, with full garden landscaping.",
    completed: "Aug 2025",
    photoUrl: "/projects/p12-harrowcross.jpg",
    latitude: 51.971118,
    longitude: 0.579913,
  },
  {
    slug: "ip1-ipswich-oaklands",
    featured: true,
    address: "Oaklands",
    place: "Constitution Hill, Ipswich, Suffolk",
    postcode: "IP1",
    localAuthority: "Ipswich Borough",
    planningType: PlanningType.FULL_PLANNING,
    projectType: ProjectType.LOFT_CONVERSIONS,
    description:
      "Central roof lift and full internal reorganisation of a 1960s bungalow, with dormers and ridge glazing to the front elevation.",
    completed: "Oct 2024",
    photoUrl: "/projects/p13-oaklands.jpg",
    latitude: 52.066531,
    longitude: 1.145561,
  },
  {
    slug: null,
    featured: false,
    address: "Hunters, 120 High Street",
    place: "Hadleigh, Suffolk",
    postcode: "IP7",
    localAuthority: "Babergh",
    planningType: PlanningType.PERMITTED_DEVELOPMENT,
    projectType: ProjectType.SMALL_WRAP_AROUND_EXTENSIONS,
    description: "Project details to be added.",
    completed: "—",
    photoUrl: "/projects/default.jpg",
    latitude: 52.046062,
    longitude: 0.952374,
  },
  {
    slug: "co10-boxford-orchard-house",
    featured: true,
    address: "Orchard House",
    place: "Sand Hill, Boxford, Suffolk",
    postcode: "CO10",
    localAuthority: "Babergh",
    planningType: PlanningType.FULL_PLANNING,
    projectType: ProjectType.NEW_BUILDS,
    description:
      "New-build 3 bed, 3 bath home with double garage, built into the side garden of a larger plot.",
    completed: "Jul 2022",
    photoUrl: "/projects/p8-orchard.jpg",
    latitude: 52.025629,
    longitude: 0.8694,
  },
  {
    slug: "ip7-bildeston-squirrells-mill",
    featured: true,
    address: "2 Squirrells Mill Road",
    place: "Bildeston, Suffolk",
    postcode: "IP7",
    localAuthority: "Babergh",
    planningType: PlanningType.PERMITTED_DEVELOPMENT,
    projectType: ProjectType.SMALL_WRAP_AROUND_EXTENSIONS,
    description:
      "Single-storey kitchen extension with corner accordion glazing and a 'door and a half' entrance, opening the house to the garden.",
    completed: "Jul 2021",
    photoUrl: "/projects/p14-squirrellsmill.jpg",
    latitude: 52.108343,
    longitude: 0.90642,
  },
  {
    slug: "cm3-bicknacre-elm-house",
    featured: true,
    address: "Elm House",
    place: "Bicknacre, Essex",
    postcode: "CM3",
    localAuthority: "Chelmsford City Council",
    planningType: PlanningType.PERMITTED_DEVELOPMENT,
    projectType: ProjectType.LOFT_CONVERSIONS,
    description:
      "Structural roof lift to a low attic room, creating additional usable headroom and floor space.",
    completed: "Aug 2017",
    photoUrl: "/projects/p10-elmhouse.jpg",
    latitude: 51.696132,
    longitude: 0.595031,
  },
];

export const MOCK_FEATURED_PROJECTS = MOCK_PROJECTS.filter((p) => p.featured);

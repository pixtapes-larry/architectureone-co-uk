// Single source of truth for how enum values display and link — avoids
// the same label/route maps being re-written slightly differently on
// every page that touches project data.

import { ProjectType, PlanningType, ServiceDelivered } from "@/generated/prisma/enums";

export const PROJECT_TYPE_LABELS: Record<ProjectType, string> = {
  SMALL_WRAP_AROUND_EXTENSIONS: "Small & Wrap Around Extensions",
  GARAGE_CONVERSIONS: "Garage Conversions",
  LOFT_CONVERSIONS: "Loft Conversions",
  LARGE_SINGLE_STOREY_EXTENSIONS: "Large Single Storey Extensions",
  LARGE_TWO_STOREY_EXTENSIONS: "Large Two Storey Extensions",
  OUTBUILDINGS: "Outbuildings",
  LARGE_OUTBUILDINGS: "Large Outbuildings",
  BARN_CONVERSIONS: "Barn Conversions",
  NEW_BUILDS: "New Builds",
  DEVELOPMENT: "Development",
  PLANNING_RESOLUTION: "Planning Resolution",
  STRUCTURAL_ALTERATIONS: "Structural Alterations",
  LANDSCAPING_DESIGN: "Landscaping Design",
  OTHER_PLANNING: "Other Planning",
};

// Route each project type resolves to — drives "View case study" /
// "Explore →" links wherever a Project record is rendered.
export const PROJECT_TYPE_ROUTES: Record<ProjectType, string> = {
  SMALL_WRAP_AROUND_EXTENSIONS: "/permitted-development/small-wrap-around-extensions",
  GARAGE_CONVERSIONS: "/permitted-development/garage-conversions",
  LOFT_CONVERSIONS: "/permitted-development/loft-conversions",
  LARGE_SINGLE_STOREY_EXTENSIONS: "/large-extensions/large-single-storey-extensions",
  LARGE_TWO_STOREY_EXTENSIONS: "/large-extensions/large-two-storey-extensions",
  OUTBUILDINGS: "/permitted-development/outbuildings",
  LARGE_OUTBUILDINGS: "/new-builds-developments/large-outbuildings",
  BARN_CONVERSIONS: "/new-builds-developments/barn-conversions",
  NEW_BUILDS: "/new-builds-developments/new-builds",
  DEVELOPMENT: "/new-builds-developments/development",
  PLANNING_RESOLUTION: "/planning-resolution-support",
  // No dedicated sub-type page yet for these 3 — surfaced by real archive
  // jobs during harvesting, uncommon enough that they route to their
  // parent category page rather than a 404 until volume justifies one.
  STRUCTURAL_ALTERATIONS: "/permitted-development",
  LANDSCAPING_DESIGN: "/new-builds-developments",
  OTHER_PLANNING: "/new-builds-developments",
};

export const PLANNING_TYPE_LABELS: Record<PlanningType, string> = {
  PERMITTED_DEVELOPMENT: "Permitted Development",
  FULL_PLANNING: "Full Planning",
  PRIOR_APPROVAL: "Prior Approval",
};

// Exact wording from the Services page / Project Data Schema — used
// wherever a project's Services Delivered list is rendered, so it never
// drifts into ad-hoc title-casing of the enum value.
export const SERVICE_DELIVERED_LABELS: Record<ServiceDelivered, string> = {
  PRE_APPLICATION_PLANNING_ADVICE: "Pre-Application Planning Advice",
  DESIGN_ACCESS_STATEMENT: "Design & Access Statements",
  LAWFUL_DEVELOPMENT_CERTIFICATE_APPLICATION:
    "Lawful Development Certificate Applications",
  PLANNING_APPLICATION: "Planning Applications",
  PRIOR_APPROVAL_APPLICATION:
    "Prior Approval Applications (Class Q / Larger Home Extension)",
  BUILDING_REGULATIONS_DRAWINGS: "Building Regulations Drawings",
  BUILDING_REGULATIONS_APPLICATION:
    "Building Regulations Application / Building Notice",
  SITE_LOCATION_PLANS: "Site & Location Plans",
  ELEVATIONS_FLOOR_PLANS: "Elevations & Floor Plans",
  WINDOW_DOOR_SCHEDULES: "Window & Door Schedules",
  FOUL_WASTE_WASTEWATER_PLANS: "Foul Waste & Wastewater Plans",
  SURFACE_WATER_DRAINAGE_PLANS: "Surface Water Drainage Plans",
  ELECTRICAL_LIGHTING_LAYOUTS: "Electrical & Lighting Layouts",
  MATERIALS_SPECIFICATIONS: "Materials Specifications",
  THREE_D_VISUALISATIONS: "3D Visualisations",
  MEASURED_SURVEY: "Measured Survey",
  STRUCTURAL_SURVEYS_CALCULATIONS: "Structural Surveys & Calculations",
  TOPOGRAPHICAL_SURVEYS: "Topographical Surveys",
  ECOLOGY_SURVEYS: "Ecology Surveys (e.g. bat surveys)",
  FLOOD_RISK_ASSESSMENTS: "Flood Risk Assessments",
  SAP_PART_L_CALCULATIONS: "SAP / Part L Energy Calculations",
  BIODIVERSITY_NET_GAIN_REPORT: "Biodiversity Net Gain Reports",
  LANDSCAPING_PLANTING_DESIGN: "Landscaping & Planting Design",
  TENDERING_PROCESS: "Tendering Process",
  PARTY_WALL_AGREEMENT_COORDINATION: "Party Wall Agreement Coordination",
  QUALITY_CONTROL: "Quality Control",
  ON_SITE_SUPPORT: "On Site Support",
};

export type ServiceGroup = {
  heading: string;
  note?: string;
  services: ServiceDelivered[];
};

// The 5 groups shown on the Services page — single source of truth for
// both that page and anywhere a project's services are grouped.
export const SERVICE_GROUPS: ServiceGroup[] = [
  {
    heading: "Planning & Permissions",
    services: [
      ServiceDelivered.PRE_APPLICATION_PLANNING_ADVICE,
      ServiceDelivered.DESIGN_ACCESS_STATEMENT,
      ServiceDelivered.LAWFUL_DEVELOPMENT_CERTIFICATE_APPLICATION,
      ServiceDelivered.PLANNING_APPLICATION,
      ServiceDelivered.PRIOR_APPROVAL_APPLICATION,
    ],
  },
  {
    heading: "Building Control",
    services: [
      ServiceDelivered.BUILDING_REGULATIONS_DRAWINGS,
      ServiceDelivered.BUILDING_REGULATIONS_APPLICATION,
    ],
  },
  {
    heading: "Drawings & Technical Information",
    services: [
      ServiceDelivered.SITE_LOCATION_PLANS,
      ServiceDelivered.ELEVATIONS_FLOOR_PLANS,
      ServiceDelivered.WINDOW_DOOR_SCHEDULES,
      ServiceDelivered.FOUL_WASTE_WASTEWATER_PLANS,
      ServiceDelivered.SURFACE_WATER_DRAINAGE_PLANS,
      ServiceDelivered.ELECTRICAL_LIGHTING_LAYOUTS,
      ServiceDelivered.MATERIALS_SPECIFICATIONS,
      ServiceDelivered.THREE_D_VISUALISATIONS,
    ],
  },
  {
    heading: "Specialist Reports & Surveys",
    note: "Coordinated on your behalf via trusted partners.",
    services: [
      ServiceDelivered.MEASURED_SURVEY,
      ServiceDelivered.STRUCTURAL_SURVEYS_CALCULATIONS,
      ServiceDelivered.TOPOGRAPHICAL_SURVEYS,
      ServiceDelivered.ECOLOGY_SURVEYS,
      ServiceDelivered.FLOOD_RISK_ASSESSMENTS,
      ServiceDelivered.SAP_PART_L_CALCULATIONS,
      ServiceDelivered.BIODIVERSITY_NET_GAIN_REPORT,
      ServiceDelivered.LANDSCAPING_PLANTING_DESIGN,
    ],
  },
  {
    heading: "Build Stage",
    services: [
      ServiceDelivered.TENDERING_PROCESS,
      ServiceDelivered.PARTY_WALL_AGREEMENT_COORDINATION,
      ServiceDelivered.QUALITY_CONTROL,
      ServiceDelivered.ON_SITE_SUPPORT,
    ],
  },
];

// The 3 nav categories, derived from the 14 project types — used to drive
// the map's filter chips without duplicating the grouping logic anywhere.
export const CATEGORIES = [
  "permitted-development",
  "large-extensions",
  "new-builds-developments",
] as const;
export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_LABELS: Record<Category, string> = {
  "permitted-development": "Permitted Development",
  "large-extensions": "Large Extensions",
  "new-builds-developments": "New Builds & Developments",
};

export const PROJECT_TYPE_CATEGORY: Record<ProjectType, Category> = {
  SMALL_WRAP_AROUND_EXTENSIONS: "permitted-development",
  GARAGE_CONVERSIONS: "permitted-development",
  LOFT_CONVERSIONS: "permitted-development",
  LARGE_SINGLE_STOREY_EXTENSIONS: "large-extensions",
  LARGE_TWO_STOREY_EXTENSIONS: "large-extensions",
  OUTBUILDINGS: "permitted-development",
  LARGE_OUTBUILDINGS: "new-builds-developments",
  BARN_CONVERSIONS: "new-builds-developments",
  NEW_BUILDS: "new-builds-developments",
  DEVELOPMENT: "new-builds-developments",
  // Planning Resolution sits outside all 3 nav categories — see the
  // Project Data Schema's note on this. Filters treat it as uncategorised.
  PLANNING_RESOLUTION: "new-builds-developments",
  // Same deal for these 3 — real archive jobs that don't fit any nav
  // category. Forced into a category here only so map filters still work.
  STRUCTURAL_ALTERATIONS: "permitted-development",
  LANDSCAPING_DESIGN: "new-builds-developments",
  OTHER_PLANNING: "new-builds-developments",
};

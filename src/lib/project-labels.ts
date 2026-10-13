// Single source of truth for how enum values display and link — avoids
// the same label/route maps being re-written slightly differently on
// every page that touches project data.

import { ProjectType, PlanningType } from "@/generated/prisma/enums";

export const PROJECT_TYPE_LABELS: Record<ProjectType, string> = {
  SMALL_WRAP_AROUND_EXTENSIONS: "Small & Wrap Around Extensions",
  GARAGE_CONVERSIONS: "Garage Conversions",
  LOFT_CONVERSIONS: "Loft Conversions",
  LARGE_SINGLE_STOREY_EXTENSIONS: "Large Single Storey Extensions",
  LARGE_TWO_STOREY_EXTENSIONS: "Large Two Storey Extensions",
  OUTBUILDINGS: "Outbuildings",
  BARN_CONVERSIONS: "Barn Conversions",
  NEW_BUILDS: "New Builds",
  DEVELOPMENT: "Development",
  PLANNING_RESOLUTION: "Planning Resolution",
};

// Route each project type resolves to — drives "View case study" /
// "Explore →" links wherever a Project record is rendered.
export const PROJECT_TYPE_ROUTES: Record<ProjectType, string> = {
  SMALL_WRAP_AROUND_EXTENSIONS: "/permitted-development/small-wrap-around-extensions",
  GARAGE_CONVERSIONS: "/permitted-development/garage-conversions",
  LOFT_CONVERSIONS: "/permitted-development/loft-conversions",
  LARGE_SINGLE_STOREY_EXTENSIONS: "/large-extensions/large-single-storey-extensions",
  LARGE_TWO_STOREY_EXTENSIONS: "/large-extensions/large-two-storey-extensions",
  OUTBUILDINGS: "/new-builds-developments/outbuildings",
  BARN_CONVERSIONS: "/new-builds-developments/barn-conversions",
  NEW_BUILDS: "/new-builds-developments/new-builds",
  DEVELOPMENT: "/new-builds-developments/development",
  PLANNING_RESOLUTION: "/planning-resolution-support",
};

export const PLANNING_TYPE_LABELS: Record<PlanningType, string> = {
  PERMITTED_DEVELOPMENT: "Permitted Development",
  FULL_PLANNING: "Full Planning",
  PRIOR_APPROVAL: "Prior Approval",
};

// The 3 nav categories, derived from the 10 project types — used to drive
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
  OUTBUILDINGS: "new-builds-developments",
  BARN_CONVERSIONS: "new-builds-developments",
  NEW_BUILDS: "new-builds-developments",
  DEVELOPMENT: "new-builds-developments",
  // Planning Resolution sits outside all 3 nav categories — see the
  // Project Data Schema's note on this. Filters treat it as uncategorised.
  PLANNING_RESOLUTION: "new-builds-developments",
};

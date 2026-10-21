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

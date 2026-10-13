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

// Placeholder project data, shaped to match the Prisma Project model field
// names exactly, so swapping this for a real `prisma.project.findMany(...)`
// call later is a one-line change, not a rewrite of every component that
// consumes it. Delete this file once the real harvested data is imported.

import { ProjectType, PlanningType } from "@/generated/prisma/enums";

export type FeaturedProjectSummary = {
  slug: string;
  address: string;
  postcode: string;
  localAuthority: string;
  planningType: PlanningType;
  projectType: ProjectType;
  description: string;
  photoUrl: string | null; // null renders a styled placeholder block
};

export const MOCK_FEATURED_PROJECTS: FeaturedProjectSummary[] = [
  {
    slug: "ip7-hadleigh-loft-conversion",
    address: "Pheasant Barn, Hadleigh",
    postcode: "IP7 5AP",
    localAuthority: "Babergh",
    planningType: PlanningType.PERMITTED_DEVELOPMENT,
    projectType: ProjectType.LOFT_CONVERSIONS,
    description:
      "A hip-to-gable loft conversion adding a main bedroom with en-suite.",
    photoUrl: null,
  },
  {
    slug: "ip1-ipswich-new-build",
    address: "Orchard Plot, Ipswich",
    postcode: "IP1 4PQ",
    localAuthority: "Ipswich Borough",
    planningType: PlanningType.FULL_PLANNING,
    projectType: ProjectType.NEW_BUILDS,
    description: "A new-build family home on a self-contained infill plot.",
    photoUrl: null,
  },
  {
    slug: "co10-sudbury-extension",
    address: "Christchurch Lane, Sudbury",
    postcode: "CO10 1AB",
    localAuthority: "Babergh",
    planningType: PlanningType.PERMITTED_DEVELOPMENT,
    projectType: ProjectType.SMALL_WRAP_AROUND_EXTENSIONS,
    description:
      "A wraparound extension opening the kitchen onto the garden.",
    photoUrl: null,
  },
];

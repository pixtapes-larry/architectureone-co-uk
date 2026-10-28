// One-off: migrates the 27 ServiceDelivered enum values (and their labels
// + group structure from src/lib/project-labels.ts) into the new Service
// table. Run with: npx tsx -r dotenv/config prisma/seed-services.ts
import { prisma } from "../src/lib/prisma";
import { enumNameToSlug } from "./service-slug";

const PLACEHOLDER_DESCRIPTION =
  "Description to be confirmed — written up properly once the service copy is war-gamed against real project experience.";

type SeedService = { enumName: string; title: string; group: string; groupNote?: string };

const SPECIALIST_NOTE = "Coordinated on your behalf via trusted partners.";

const SERVICES: SeedService[] = [
  // Planning & Permissions
  { enumName: "PRE_APPLICATION_PLANNING_ADVICE", title: "Pre-Application Planning Advice", group: "Planning & Permissions" },
  { enumName: "DESIGN_ACCESS_STATEMENT", title: "Design & Access Statements", group: "Planning & Permissions" },
  { enumName: "LAWFUL_DEVELOPMENT_CERTIFICATE_APPLICATION", title: "Lawful Development Certificate Applications", group: "Planning & Permissions" },
  { enumName: "PLANNING_APPLICATION", title: "Planning Applications", group: "Planning & Permissions" },
  { enumName: "PRIOR_APPROVAL_APPLICATION", title: "Prior Approval Applications (Class Q / Larger Home Extension)", group: "Planning & Permissions" },

  // Building Control
  { enumName: "BUILDING_REGULATIONS_DRAWINGS", title: "Building Regulations Drawings", group: "Building Control" },
  { enumName: "BUILDING_REGULATIONS_APPLICATION", title: "Building Regulations Application / Building Notice", group: "Building Control" },

  // Drawings & Technical Information
  { enumName: "SITE_LOCATION_PLANS", title: "Site & Location Plans", group: "Drawings & Technical Information" },
  { enumName: "ELEVATIONS_FLOOR_PLANS", title: "Elevations & Floor Plans", group: "Drawings & Technical Information" },
  { enumName: "WINDOW_DOOR_SCHEDULES", title: "Window & Door Schedules", group: "Drawings & Technical Information" },
  { enumName: "FOUL_WASTE_WASTEWATER_PLANS", title: "Foul Waste & Wastewater Plans", group: "Drawings & Technical Information" },
  { enumName: "SURFACE_WATER_DRAINAGE_PLANS", title: "Surface Water Drainage Plans", group: "Drawings & Technical Information" },
  { enumName: "ELECTRICAL_LIGHTING_LAYOUTS", title: "Electrical & Lighting Layouts", group: "Drawings & Technical Information" },
  { enumName: "MATERIALS_SPECIFICATIONS", title: "Materials Specifications", group: "Drawings & Technical Information" },
  { enumName: "THREE_D_VISUALISATIONS", title: "3D Visualisations", group: "Drawings & Technical Information" },

  // Specialist Reports & Surveys
  { enumName: "MEASURED_SURVEY", title: "Measured Survey", group: "Specialist Reports & Surveys", groupNote: SPECIALIST_NOTE },
  { enumName: "STRUCTURAL_SURVEYS_CALCULATIONS", title: "Structural Surveys & Calculations", group: "Specialist Reports & Surveys", groupNote: SPECIALIST_NOTE },
  { enumName: "TOPOGRAPHICAL_SURVEYS", title: "Topographical Surveys", group: "Specialist Reports & Surveys", groupNote: SPECIALIST_NOTE },
  { enumName: "ECOLOGY_SURVEYS", title: "Ecology Surveys (e.g. bat surveys)", group: "Specialist Reports & Surveys", groupNote: SPECIALIST_NOTE },
  { enumName: "FLOOD_RISK_ASSESSMENTS", title: "Flood Risk Assessments", group: "Specialist Reports & Surveys", groupNote: SPECIALIST_NOTE },
  { enumName: "SAP_PART_L_CALCULATIONS", title: "SAP / Part L Energy Calculations", group: "Specialist Reports & Surveys", groupNote: SPECIALIST_NOTE },
  { enumName: "BIODIVERSITY_NET_GAIN_REPORT", title: "Biodiversity Net Gain Reports", group: "Specialist Reports & Surveys", groupNote: SPECIALIST_NOTE },
  { enumName: "LANDSCAPING_PLANTING_DESIGN", title: "Landscaping & Planting Design", group: "Specialist Reports & Surveys", groupNote: SPECIALIST_NOTE },

  // Build Stage
  { enumName: "TENDERING_PROCESS", title: "Tendering Process", group: "Build Stage" },
  { enumName: "PARTY_WALL_AGREEMENT_COORDINATION", title: "Party Wall Agreement Coordination", group: "Build Stage" },
  { enumName: "QUALITY_CONTROL", title: "Quality Control", group: "Build Stage" },
  { enumName: "ON_SITE_SUPPORT", title: "On Site Support", group: "Build Stage" },
];

async function main() {
  for (const [i, s] of SERVICES.entries()) {
    await prisma.service.upsert({
      where: { slug: enumNameToSlug(s.enumName) },
      update: {},
      create: {
        slug: enumNameToSlug(s.enumName),
        title: s.title,
        description: PLACEHOLDER_DESCRIPTION,
        group: s.group,
        groupNote: s.groupNote,
        sortOrder: i,
      },
    });
    console.log(`  [OK] ${s.title}`);
  }
  console.log(`\nDone. ${SERVICES.length} services seeded.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());

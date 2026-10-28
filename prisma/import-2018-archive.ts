// One-off import of the 2018 project archive JSON files (projects/*.json)
// into the real DB, additive to the existing MOCK_PROJECTS seed — see
// chat for the full review notes. No photos are hosted yet, so every
// record gets the same placeholder coverPhotoUrl as non-featured mock
// entries, and none are marked featured. Safe to re-run: it only inserts
// projects whose address isn't already in the DB.
import fs from "node:fs";
import path from "node:path";
import { PrismaClient } from "../src/generated/prisma/client";
import type { PlanningType, ProjectType } from "../src/generated/prisma/enums";

const prisma = new PrismaClient();

const PROJECTS_DIR = path.join(__dirname, "..", "projects");

// Raw localAuthority strings in the archive → the display name convention
// already established by MOCK_PROJECTS / local-authorities.ts (plain ONS
// name, except the 3 authorities mock already shows with a fuller title).
// The two "Babergh / Mid Suffolk ..." combined entries are resolved to a
// single authority using the project's own postcode (Hintlesham and
// Thorpe Morieux are both within Babergh, not Mid Suffolk).
const AUTHORITY_NORMALIZE: Record<string, string> = {
  "Colchester Borough Council": "Colchester",
  "Chelmsford City Council": "Chelmsford City Council",
  "London Borough of Enfield": "London Borough of Enfield",
  "Ipswich Borough Council": "Ipswich Borough",
  "Babergh District Council": "Babergh",
  "East Suffolk Council (Suffolk Coastal District Council at time of decision)":
    "East Suffolk",
  "Castle Point Borough Council": "Castle Point",
  "Braintree District Council": "Braintree Borough Council",
  "Rochford District Council": "Rochford",
  "Tendring District Council": "Tendring",
  "Mid Suffolk District Council": "Mid Suffolk",
  "Babergh / Mid Suffolk District Councils (Building Notice route)":
    "Babergh",
  "East Hertfordshire District Council": "East Hertfordshire",
  "East Suffolk Council": "East Suffolk",
  "West Suffolk Council": "West Suffolk",
  "Babergh / Mid Suffolk District Councils": "Babergh",
};

const COUNTY_BY_AUTHORITY: Record<string, string> = {
  Colchester: "Essex",
  "Chelmsford City Council": "Essex",
  "London Borough of Enfield": "Greater London",
  "Ipswich Borough": "Suffolk",
  Babergh: "Suffolk",
  "East Suffolk": "Suffolk",
  "Castle Point": "Essex",
  "Braintree Borough Council": "Essex",
  Rochford: "Essex",
  Tendring: "Essex",
  "Mid Suffolk": "Suffolk",
  "East Hertfordshire": "Hertfordshire",
  "West Suffolk": "Suffolk",
};

type ArchiveCaseStudyBlock = { heading: string; text: string };

type ArchiveProject = {
  status?: "dropped";
  reason?: string;
  folder?: string;
  address?: string;
  postcode?: string;
  localAuthority?: string;
  planningType?: string;
  projectType?: string;
  instructionDate?: string;
  description?: string;
  note?: string;
  otherTags?: string[];
  caseStudy?: ArchiveCaseStudyBlock[];
  photos?: string[];
  planImages?: string[];
  sourceRef?: string;
};

function parseInstructionDate(raw: string): Date | null {
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return new Date(`${raw}T00:00:00Z`);
  if (/^\d{4}-\d{2}$/.test(raw)) return new Date(`${raw}-01T00:00:00Z`);
  if (/^\d{4}$/.test(raw)) return new Date(`${raw}-01-01T00:00:00Z`);
  return null;
}

// Archive `address` is one full comma-joined line (street, village, town,
// postcode) — our schema wants separate address / place / postcode
// fields. Strips the already-known postcode off the end, keeps the first
// segment as the street line, and turns the rest into "place", adding the
// county when it isn't already spelled out in what's left.
function splitAddress(
  fullAddress: string,
  postcode: string,
  county: string,
): { address: string; place: string } {
  let remainder = fullAddress;
  const postcodeIndex = remainder.toLowerCase().lastIndexOf(postcode.toLowerCase());
  if (postcodeIndex !== -1) {
    remainder = remainder.slice(0, postcodeIndex);
  }
  const segments = remainder
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const streetLine = segments[0] ?? fullAddress;
  const placeSegments = segments.slice(1);
  const placeRaw = placeSegments.join(", ");
  const hasCounty = placeRaw.toLowerCase().includes(county.toLowerCase());
  const place = hasCounty
    ? placeRaw
    : placeRaw
      ? `${placeRaw}, ${county}`
      : county;

  return { address: streetLine, place };
}

function buildFullDescription(caseStudy?: ArchiveCaseStudyBlock[]): string | undefined {
  if (!caseStudy || caseStudy.length === 0) return undefined;
  return caseStudy.map((b) => `${b.heading} — ${b.text}`).join("\n\n");
}

function buildNotes(p: ArchiveProject): string {
  const parts: string[] = [
    `Imported from 2018 archive JSON (folder: ${p.folder ?? "?"}; source: ${p.sourceRef ?? "?"}). No photos hosted yet.`,
  ];
  if (p.note) parts.push(p.note);
  const fileRefs = [...(p.photos ?? []), ...(p.planImages ?? [])];
  if (fileRefs.length > 0) {
    parts.push(`Original local file references (not yet uploaded):\n${fileRefs.join("\n")}`);
  }
  return parts.join("\n\n");
}

async function main() {
  const files = fs
    .readdirSync(PROJECTS_DIR)
    .filter((f) => f.endsWith(".json"))
    .sort();

  let imported = 0;
  let skippedDropped = 0;
  let skippedTbc: string[] = [];
  let skippedExisting: string[] = [];
  let skippedBadDate: string[] = [];

  for (const file of files) {
    const raw = fs.readFileSync(path.join(PROJECTS_DIR, file), "utf-8");
    // Strip a UTF-8 BOM if present, same fix as the chat's survey script.
    const cleaned = raw.replace(/^﻿/, "");
    const p: ArchiveProject = JSON.parse(cleaned);

    if (p.status === "dropped") {
      skippedDropped++;
      continue;
    }
    if (p.planningType === "TBC") {
      skippedTbc.push(file);
      continue;
    }

    const existing = await prisma.project.findFirst({
      where: { address: { contains: p.address!.split(",")[0].trim() } },
    });
    if (existing) {
      skippedExisting.push(file);
      continue;
    }

    const instructionDate = parseInstructionDate(p.instructionDate ?? "");
    if (!instructionDate) {
      skippedBadDate.push(file);
      continue;
    }

    const normalizedAuthority =
      AUTHORITY_NORMALIZE[p.localAuthority ?? ""] ?? p.localAuthority ?? "Unknown";
    const county = COUNTY_BY_AUTHORITY[normalizedAuthority] ?? "Suffolk";
    const { address, place } = splitAddress(p.address!, p.postcode!, county);

    await prisma.project.create({
      data: {
        address,
        place,
        postcode: p.postcode!,
        localAuthority: normalizedAuthority,
        planningType: p.planningType as PlanningType,
        projectType: p.projectType as ProjectType,
        instructionDate,
        description: p.description ?? "Project details to be added.",
        notes: buildNotes(p),
        coverPhotoUrl: "/projects/default.jpg",
        featured: false,
        fullDescription: buildFullDescription(p.caseStudy),
        otherTags: p.otherTags ?? undefined,
      },
    });
    imported++;
  }

  console.log(`Imported: ${imported}`);
  console.log(`Skipped (already marked dropped): ${skippedDropped}`);
  console.log(`Skipped (planningType TBC — needs manual review): ${skippedTbc.length}`, skippedTbc);
  console.log(`Skipped (address already in DB): ${skippedExisting.length}`, skippedExisting);
  console.log(`Skipped (unparseable instructionDate): ${skippedBadDate.length}`, skippedBadDate);

  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});

import fs from "node:fs";
import path from "node:path";
import { prisma } from "../prisma";
import { localAuthoritySlug, localAuthorityBoundarySlug } from "../local-authority-slug";

// There is no separate "create a local authority" step — a showcase page
// at /local-authority/<slug> exists automatically for every distinct
// `localAuthority` value used on a Project (see src/lib/local-authorities.ts
// allLocalAuthorityNames). To add a new one, give a project that exact
// local authority name; its page appears the moment that project is saved.
// What this admin screen adds on top: the page's slug, whether a geo
// boundary file exists for the map overlay, and how many projects feed it
// — none of which was visible before.

function listBoundaryFileSlugs(): Set<string> {
  const dir = path.join(process.cwd(), "public", "boundaries", "by-la");
  try {
    return new Set(
      fs
        .readdirSync(dir)
        .filter((f) => f.endsWith(".geojson"))
        .map((f) => f.replace(/\.geojson$/, "")),
    );
  } catch {
    return new Set();
  }
}

export type LocalAuthorityAdminRow = {
  name: string;
  slug: string;
  boundarySlug: string;
  hasBoundary: boolean;
  projectCount: number;
  blurb: string | null;
};

// One row per local authority actually referenced by a project — every
// one of these already has a live public page.
export async function listLocalAuthoritiesAdmin(): Promise<LocalAuthorityAdminRow[]> {
  const [counts, infos] = await Promise.all([
    prisma.project.groupBy({ by: ["localAuthority"], _count: { _all: true } }),
    prisma.localAuthorityInfo.findMany(),
  ]);
  const boundarySlugs = listBoundaryFileSlugs();
  const blurbByName = new Map(infos.map((i) => [i.localAuthority, i.blurb]));

  return counts
    .map((row) => {
      const name = row.localAuthority;
      const boundarySlug = localAuthorityBoundarySlug(name);
      return {
        name,
        slug: localAuthoritySlug(name),
        boundarySlug,
        hasBoundary: boundarySlugs.has(boundarySlug),
        projectCount: row._count._all,
        blurb: blurbByName.get(name) ?? null,
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

// Boundary files sitting in public/boundaries/by-la with no project
// currently using that authority — i.e. map data that isn't linked to any
// live page yet (not wrong, just unused for now).
export async function listUnusedBoundarySlugsAdmin(): Promise<string[]> {
  const [names] = await Promise.all([
    prisma.project.findMany({ distinct: ["localAuthority"], select: { localAuthority: true } }),
  ]);
  const usedSlugs = new Set(names.map((n) => localAuthorityBoundarySlug(n.localAuthority)));
  return Array.from(listBoundaryFileSlugs())
    .filter((s) => !usedSlugs.has(s))
    .sort();
}

export async function getLocalAuthorityBlurbAdmin(name: string) {
  return prisma.localAuthorityInfo.findUnique({ where: { localAuthority: name } });
}

export type LocalAuthorityBlurbInput = {
  blurb: string;
  metaTitle: string;
  metaDescription: string;
};

export async function updateLocalAuthorityBlurbAdmin(name: string, input: LocalAuthorityBlurbInput) {
  const data = {
    blurb: input.blurb || null,
    metaTitle: input.metaTitle || null,
    metaDescription: input.metaDescription || null,
  };
  return prisma.localAuthorityInfo.upsert({
    where: { localAuthority: name },
    update: data,
    create: { localAuthority: name, ...data },
  });
}

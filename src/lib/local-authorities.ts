// Local Authority Showcase — one page per planning authority, built from
// real project records in the DB. No relationship copy is invented per
// authority beyond what's already established site-wide (Home's "named
// relationships" line) — everything shown here is a genuine count derived
// from the project data itself.

import { prisma } from "./prisma";
import type { ProjectMapSummary } from "./mock-projects";
import { getProjectsByLocalAuthority } from "./projects";
import { PROJECT_TYPE_LABELS } from "./project-labels";

// Convenience re-export for server-side callers already importing from
// this file. This module itself imports Prisma, so a CLIENT component
// must import localAuthoritySlug/localAuthorityBoundarySlug directly from
// local-authority-slug.ts instead — re-exporting here doesn't avoid that
// module's code (and its Prisma import) being pulled into a client bundle.
export { localAuthoritySlug, localAuthorityBoundarySlug } from "./local-authority-slug";
import { localAuthoritySlug } from "./local-authority-slug";

export async function allLocalAuthorityNames(): Promise<string[]> {
  const rows = await prisma.project.findMany({
    distinct: ["localAuthority"],
    select: { localAuthority: true },
  });
  return rows.map((r) => r.localAuthority);
}

export async function allLocalAuthoritySlugs(): Promise<string[]> {
  const names = await allLocalAuthorityNames();
  return names.map(localAuthoritySlug);
}

export async function findLocalAuthorityBySlug(
  slug: string,
): Promise<string | undefined> {
  const names = await allLocalAuthorityNames();
  return names.find((name) => localAuthoritySlug(name) === slug);
}

export type LocalAuthorityStats = {
  name: string;
  total: number;
  featuredCount: number;
  byCategory: { label: string; count: number }[];
  projects: ProjectMapSummary[];
  featuredProjects: ProjectMapSummary[];
  blurb?: string;
};

export async function localAuthorityStats(
  name: string,
): Promise<LocalAuthorityStats> {
  const [projects, info] = await Promise.all([
    getProjectsByLocalAuthority(name),
    prisma.localAuthorityInfo.findUnique({ where: { localAuthority: name } }),
  ]);
  const featuredProjects = projects.filter((p) => p.featured);

  const counts = new Map<string, number>();
  for (const p of projects) {
    const label = PROJECT_TYPE_LABELS[p.projectType];
    counts.set(label, (counts.get(label) ?? 0) + 1);
  }

  return {
    name,
    total: projects.length,
    featuredCount: featuredProjects.length,
    byCategory: Array.from(counts, ([label, count]) => ({ label, count })),
    projects,
    featuredProjects,
    blurb: info?.blurb ?? undefined,
  };
}

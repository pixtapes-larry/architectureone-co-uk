// Local Authority Showcase — one page per planning authority, built from
// real project records (currently the 10 mock entries; a one-line swap to
// a real `prisma.project.groupBy` once harvested data exists). No
// relationship copy is invented per authority beyond what's already
// established site-wide (Home's "named relationships" line) — everything
// shown here is a genuine count derived from the project data itself.

import { MOCK_PROJECTS, type ProjectMapSummary } from "./mock-projects";
import { PROJECT_TYPE_LABELS } from "./project-labels";

export function localAuthoritySlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function allLocalAuthorityNames(): string[] {
  return Array.from(new Set(MOCK_PROJECTS.map((p) => p.localAuthority)));
}

export function allLocalAuthoritySlugs(): string[] {
  return allLocalAuthorityNames().map(localAuthoritySlug);
}

export function findLocalAuthorityBySlug(slug: string): string | undefined {
  return allLocalAuthorityNames().find(
    (name) => localAuthoritySlug(name) === slug,
  );
}

export type LocalAuthorityStats = {
  name: string;
  total: number;
  featuredCount: number;
  byCategory: { label: string; count: number }[];
  projects: ProjectMapSummary[];
  featuredProjects: ProjectMapSummary[];
};

export function localAuthorityStats(name: string): LocalAuthorityStats {
  const projects = MOCK_PROJECTS.filter((p) => p.localAuthority === name);
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
  };
}

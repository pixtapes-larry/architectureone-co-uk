// The shared Service catalog — DB-backed (see prisma/schema.prisma Service),
// single source of truth for a Project's "Services Delivered" checklist,
// what a Package includes, and the public /about/services page. Replaces
// the old ServiceDelivered enum.
import { prisma } from "./prisma";

export type ServiceSummary = {
  id: number;
  slug: string;
  title: string;
  description: string;
};

export type ServiceGroup = {
  heading: string;
  note?: string;
  services: ServiceSummary[];
};

export async function getAllServices(): Promise<ServiceSummary[]> {
  const rows = await prisma.service.findMany({ orderBy: { sortOrder: "asc" } });
  return rows.map((r) => ({ id: r.id, slug: r.slug, title: r.title, description: r.description }));
}

// Groups services by their `group` field, in the order each group first
// appears (i.e. by its lowest-sortOrder member) — no hardcoded group list,
// so a new group entered via the admin just works.
export async function getServiceGroups(): Promise<ServiceGroup[]> {
  const rows = await prisma.service.findMany({ orderBy: { sortOrder: "asc" } });

  const groups = new Map<string, ServiceGroup>();
  for (const row of rows) {
    let group = groups.get(row.group);
    if (!group) {
      group = { heading: row.group, note: row.groupNote ?? undefined, services: [] };
      groups.set(row.group, group);
    }
    if (!group.note && row.groupNote) group.note = row.groupNote;
    group.services.push({ id: row.id, slug: row.slug, title: row.title, description: row.description });
  }
  return Array.from(groups.values());
}

// The site header's main nav — DB-backed (see prisma/schema.prisma
// NavItem), previously the hardcoded NAV_LINKS array in lib/nav.ts plus
// SiteHeader's hardcoded About/Services/Explore Projects links.
import { prisma } from "./prisma";

export type NavItemSummary = {
  id: number;
  label: string;
  href: string;
  children: { id: number; label: string; href: string }[];
};

export async function getVisibleNavItems(): Promise<NavItemSummary[]> {
  const rows = await prisma.navItem.findMany({
    where: { visible: true, parentId: null },
    orderBy: { sortOrder: "asc" },
    include: {
      children: {
        where: { visible: true },
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  return rows.map((row) => ({
    id: row.id,
    label: row.label,
    href: row.href,
    children: row.children.map((c) => ({ id: c.id, label: c.label, href: c.href })),
  }));
}

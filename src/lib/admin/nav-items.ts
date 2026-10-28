import { prisma } from "../prisma";

export async function listNavItemsAdmin() {
  const items = await prisma.navItem.findMany({
    orderBy: [{ parentId: "asc" }, { sortOrder: "asc" }],
  });
  // Top-level items first (each followed immediately by its own children),
  // rather than the flat parentId-then-sortOrder DB order — reads naturally
  // as a tree in the admin table.
  const topLevel = items.filter((i) => i.parentId === null);
  const byParent = new Map<number, typeof items>();
  for (const item of items) {
    if (item.parentId === null) continue;
    const siblings = byParent.get(item.parentId) ?? [];
    siblings.push(item);
    byParent.set(item.parentId, siblings);
  }

  const ordered: (typeof items[number] & { depth: number })[] = [];
  for (const top of topLevel) {
    ordered.push({ ...top, depth: 0 });
    for (const child of byParent.get(top.id) ?? []) {
      ordered.push({ ...child, depth: 1 });
    }
  }
  return ordered;
}

export async function getNavItemAdmin(id: number) {
  return prisma.navItem.findUnique({ where: { id } });
}

// For the "parent" dropdown in the form — only top-level items can be a
// parent (one level of nesting only, matching the real header).
export async function listTopLevelNavItemsAdmin() {
  return prisma.navItem.findMany({
    where: { parentId: null },
    orderBy: { sortOrder: "asc" },
  });
}

export type NavItemAdminInput = {
  label: string;
  href: string;
  visible: boolean;
  parentId: number | null;
};

export async function createNavItemAdmin(input: NavItemAdminInput) {
  const maxSort = await prisma.navItem.aggregate({
    where: { parentId: input.parentId },
    _max: { sortOrder: true },
  });
  return prisma.navItem.create({
    data: { ...input, sortOrder: (maxSort._max.sortOrder ?? -1) + 1 },
  });
}

export async function updateNavItemAdmin(id: number, input: NavItemAdminInput) {
  return prisma.navItem.update({ where: { id }, data: input });
}

export async function deleteNavItemAdmin(id: number) {
  await prisma.navItem.delete({ where: { id } });
}

export async function toggleNavItemVisibleAdmin(id: number) {
  const item = await prisma.navItem.findUniqueOrThrow({ where: { id } });
  return prisma.navItem.update({
    where: { id },
    data: { visible: !item.visible },
  });
}

// Swaps sortOrder with the adjacent sibling (same parentId) in the given
// direction — the simplest correct way to reorder without a drag library.
export async function moveNavItemAdmin(id: number, direction: "up" | "down") {
  const item = await prisma.navItem.findUniqueOrThrow({ where: { id } });
  const siblings = await prisma.navItem.findMany({
    where: { parentId: item.parentId },
    orderBy: { sortOrder: "asc" },
  });
  const index = siblings.findIndex((s) => s.id === id);
  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (swapIndex < 0 || swapIndex >= siblings.length) return;

  const other = siblings[swapIndex];
  await prisma.$transaction([
    prisma.navItem.update({ where: { id: item.id }, data: { sortOrder: other.sortOrder } }),
    prisma.navItem.update({ where: { id: other.id }, data: { sortOrder: item.sortOrder } }),
  ]);
}

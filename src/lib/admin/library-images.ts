"use server";

// Combines standalone Asset rows with the images already owned by a
// Project/Award into one flat, image-only list — what the "choose from
// library" picker searches. Called directly from client components (it's
// a server action, not an API route) since it needs Prisma + filesystem
// access that can't run in the browser.
import { listAssetsAdmin } from "./assets";
import { scanOwnedImages } from "./asset-scan";

export type LibraryImage = {
  url: string;
  label: string;
  source: "asset" | "project" | "award";
};

export async function listLibraryImagesAction(search?: string): Promise<LibraryImage[]> {
  const [assets, owned] = await Promise.all([
    listAssetsAdmin({ type: "image" }),
    scanOwnedImages(),
  ]);

  const fromAssets: LibraryImage[] = assets.map((a) => ({
    url: a.url,
    label: a.label || a.filename,
    source: "asset",
  }));

  const fromOwned: LibraryImage[] = owned.map((o) => ({
    url: o.url,
    label: o.owner.label,
    source: o.owner.kind,
  }));

  const all = [...fromAssets, ...fromOwned];

  if (!search?.trim()) return all;
  const needle = search.trim().toLowerCase();
  return all.filter((img) => img.label.toLowerCase().includes(needle));
}

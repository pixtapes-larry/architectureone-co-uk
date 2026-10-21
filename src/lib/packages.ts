// The 3 fixed-price Permitted Development packages — single source of
// truth, reused by the Permitted Development category page and all 4 of
// its sub-type pages (previously duplicated separately in category-pages.ts
// and sub-type-pages.ts), and by the Package detail page itself.

export type PackageTier = {
  slug: string;
  name: string;
  price: string;
  featured?: boolean;
  bullets: string[];
};

// TODO: scope bullets are placeholders — Luke wants these war-gamed
// against real project experience before they go public (see the
// project brief). Prices are working guide figures, not locked.
export const PD_PACKAGE_TIERS: PackageTier[] = [
  {
    slug: "starter",
    name: "Starter",
    price: "£1,199",
    bullets: ["Scope to be confirmed", "Scope to be confirmed", "Scope to be confirmed"],
  },
  {
    slug: "standard",
    name: "Standard",
    price: "£1,799",
    featured: true,
    bullets: ["Scope to be confirmed", "Scope to be confirmed", "Scope to be confirmed"],
  },
  {
    slug: "extended",
    name: "Extended",
    price: "£2,499",
    bullets: ["Scope to be confirmed", "Scope to be confirmed", "Scope to be confirmed"],
  },
];

export const PD_PACKAGE_NOTE =
  "All exclude planning/structural/other third-party fees. Working guide prices only — not yet locked.";

export function findPackageTier(slug: string): PackageTier | undefined {
  return PD_PACKAGE_TIERS.find((t) => t.slug === slug);
}

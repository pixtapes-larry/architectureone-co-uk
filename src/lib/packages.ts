// The 3 fixed-price Permitted Development packages — single source of
// truth, reused by the Permitted Development category page and all 4 of
// its sub-type pages (previously duplicated separately in category-pages.ts
// and sub-type-pages.ts), and by the Package detail page itself.

// A quantifiable scope item — "count: null" means genuinely not decided
// yet, rendered as an honest "TBC" rather than a guessed number.
export type ExpectationItem = { label: string; count: number | null };

export type PackageTier = {
  slug: string;
  name: string;
  price: string;
  featured?: boolean;
  bullets: string[];
  expectations: ExpectationItem[];
};

// TODO: none of these counts are decided yet — each tier should end up
// with its own real numbers (Extended presumably allowing more of each
// than Starter), not identical placeholders. Filled in once scope is
// war-gamed against real project experience, same caveat as the bullets.
const UNCONFIRMED_EXPECTATIONS: ExpectationItem[] = [
  { label: "Meetings", count: null },
  { label: "Deliverables", count: null },
  { label: "Submissions", count: null },
  { label: "Reworks", count: null },
  { label: "Amendments", count: null },
];

// TODO: scope bullets are placeholders — Luke wants these war-gamed
// against real project experience before they go public (see the
// project brief). Prices are working guide figures, not locked.
export const PD_PACKAGE_TIERS: PackageTier[] = [
  {
    slug: "starter",
    name: "Starter",
    price: "£1,199",
    bullets: ["Scope to be confirmed", "Scope to be confirmed", "Scope to be confirmed"],
    expectations: UNCONFIRMED_EXPECTATIONS,
  },
  {
    slug: "standard",
    name: "Standard",
    price: "£1,799",
    featured: true,
    bullets: ["Scope to be confirmed", "Scope to be confirmed", "Scope to be confirmed"],
    expectations: UNCONFIRMED_EXPECTATIONS,
  },
  {
    slug: "extended",
    name: "Extended",
    price: "£2,499",
    bullets: ["Scope to be confirmed", "Scope to be confirmed", "Scope to be confirmed"],
    expectations: UNCONFIRMED_EXPECTATIONS,
  },
];

export const PD_PACKAGE_NOTE =
  "All exclude planning/structural/other third-party fees. Working guide prices only — not yet locked.";

export function findPackageTier(slug: string): PackageTier | undefined {
  return PD_PACKAGE_TIERS.find((t) => t.slug === slug);
}

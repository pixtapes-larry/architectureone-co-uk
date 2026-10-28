// Pure string helpers only — no DB import here. LocalAuthorityMap.tsx is a
// client component that needs localAuthorityBoundarySlug; importing it
// from local-authorities.ts (which pulls in the Prisma client at module
// scope) breaks the client bundle with a "node:module not supported"
// Turbopack error, since ES modules bundle the whole file a named import
// comes from, not just the one function used.

export function localAuthoritySlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Display names don't always match the ONS LAD25NM used to name files
// under public/boundaries/by-la — e.g. we show "Braintree Borough
// Council" but the boundary file is braintree.geojson. Map the
// mismatches here rather than changing the display copy.
const BOUNDARY_SLUG_ALIASES: Record<string, string> = {
  "Braintree Borough Council": "braintree",
  "Ipswich Borough": "ipswich",
  "Chelmsford City Council": "chelmsford",
};

// Slug to use when fetching public/boundaries/by-la/<slug>.geojson for a
// given display name — distinct from localAuthoritySlug(), which drives the
// /local-authority/<slug> page route and must stay keyed to the display name.
export function localAuthorityBoundarySlug(name: string): string {
  return BOUNDARY_SLUG_ALIASES[name] ?? localAuthoritySlug(name);
}

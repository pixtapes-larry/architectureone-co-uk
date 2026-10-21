// Small brand-wide copy snippets reused verbatim across multiple pages
// (category pages' closing panel, the About page) — kept in one place so
// they can't quietly drift apart.

// TODO: placeholder only — confirm the real contact inbox before launch.
// Shown on-page as unconfirmed (see Contact/Book a Consultation), not
// presented as a live, checked address.
export const PLACEHOLDER_CONTACT_EMAIL = "hello@architectureone.co.uk";

// Real address, from the practice's Google Business Profile. Coordinates
// are the IP7 outcode anchor already used for postcode search on the map
// (see lib/mock-projects.ts) — an approximation, not real geocoding, same
// honesty caveat as everywhere else that anchor is used. Swap for a real
// postcodes.io lookup once that's wired up.
export const ARCHITECTURE_ONE_OFFICE = {
  line1: "26a High Street",
  place: "Hadleigh, Suffolk",
  postcode: "IP7 5AP",
  phone: "01473 807754",
  latitude: 52.0456,
  longitude: 0.9592,
};

export const ARCHITECTURE_ONE_PROMISE = [
  "Clear, fixed-fee architectural quotations",
  "Drawings ready in 7–10 working days",
  "Personal and local expertise",
  "Honest & transparent interactions",
  "Trusted by our customers [confirm rating]",
  "Protection: professional indemnity [confirm figure]",
] as const;

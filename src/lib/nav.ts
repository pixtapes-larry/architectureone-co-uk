// Shared nav structure — single source of truth so every page's header
// stays in sync. Route paths here are the real App Router paths.

export const NAV_LINKS = [
  { label: "Permitted Development", href: "/permitted-development" },
  { label: "Large Extensions", href: "/large-extensions" },
  { label: "New Builds & Developments", href: "/new-builds-developments" },
] as const;

export const EXPLORE_PROJECTS_HREF = "/projects";
export const ABOUT_HREF = "/about";
export const ABOUT_SERVICES_HREF = "/about/services";
export const HOME_HREF = "/";
export const BOOK_CONSULTATION_HREF = "/book-a-consultation";
export const CONTACT_HREF = "/contact";

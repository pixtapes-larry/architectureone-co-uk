import { prisma } from "../prisma";
import { getAdminNavCounts } from "./nav-counts";

export type SiteMapNode = {
  label: string;
  href: string;
  kind: "page" | "list"; // page = one editable record; list = many, links to a list screen
  note?: string; // e.g. "shared template — layout fixed, text editable" or a cross-link callout
  children?: SiteMapNode[];
};

export async function getSiteMapTree(): Promise<SiteMapNode[]> {
  const [counts, categoryCount, subTypeCount] = await Promise.all([
    getAdminNavCounts(),
    prisma.categoryPage.count(),
    prisma.subTypePage.count(),
  ]);

  return [
    {
      label: "Home",
      href: "/admin/home-content",
      kind: "page",
      children: [
        {
          label: `Project categories (${categoryCount})`,
          href: "/admin/category-pages",
          kind: "list",
          note: "Shared template — layout fixed, text editable",
          children: [
            {
              label: `Project types (${subTypeCount})`,
              href: "/admin/sub-type-pages",
              kind: "list",
              note: "Shared template — layout fixed, text editable",
            },
          ],
        },
        {
          label: "About",
          href: "/admin/about-content",
          kind: "page",
          children: [
            { label: "Services intro", href: "/admin/services-page-content", kind: "page" },
            {
              label: `Services catalog (${counts["/admin/services"]})`,
              href: "/admin/services",
              kind: "list",
            },
            {
              label: `Team members (${counts["/admin/team-members"]})`,
              href: "/admin/team-members",
              kind: "list",
            },
          ],
        },
        { label: "Projects map", href: "/admin/projects-map-content", kind: "page" },
        {
          label: "Testimonials",
          href: "/admin/testimonials-page-content",
          kind: "page",
          note: "Linked from: Home, and project pages with an attached testimonial",
        },
        {
          label: "Awards",
          href: "/admin/awards-page-content",
          kind: "page",
          note: "Home hero's live award count is linked from here",
          children: [
            {
              label: `Awards list (${counts["/admin/awards"]})`,
              href: "/admin/awards",
              kind: "list",
              note: "Each one can link to a project",
            },
          ],
        },
        { label: "Book a consultation", href: "/admin/book-consultation-content", kind: "page" },
        { label: "Contact", href: "/admin/settings", kind: "page", note: "Copy lives in Settings" },
        { label: "Privacy", href: "/admin/privacy-content", kind: "page" },
        {
          label: `Projects (${counts["/admin/projects"]})`,
          href: "/admin/projects",
          kind: "list",
          note: "Each one can link to a Testimonial and a Local Authority page",
        },
        {
          label: `Packages (${counts["/admin/packages"]})`,
          href: "/admin/packages",
          kind: "list",
          note: "Linked from: Project categories, Project types",
        },
        {
          label: `Local authorities (${counts["/admin/local-authorities"]})`,
          href: "/admin/local-authorities",
          kind: "list",
          note: "One page per authority used on a project",
        },
      ],
    },
  ];
}

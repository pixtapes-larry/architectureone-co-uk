"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/app/admin/login/actions";
import styles from "./AdminShell.module.css";

type NavItem = {
  label: string;
  href?: string; // omitted = not built yet, rendered disabled with a "Soon" tag
  children?: NavItem[];
};

// Grouped so someone new to the admin can scan the sidebar and guess where
// something lives, rather than parsing one flat alphabetical-ish list.
// "Page copy" is ordered and nested to mirror the public site's own
// structure (which page's words live where), while "Content library" is
// the flat list of record types (projects, packages, etc.) that don't
// belong to one single page.
const NAV_GROUPS: { title: string; items: NavItem[] }[] = [
  {
    title: "Overview",
    items: [{ label: "Dashboard", href: "/admin" }],
  },
  {
    // The words on specific public pages — usually one form per page,
    // not a list of records. Nesting follows the site's own page
    // hierarchy (e.g. Project Types pages hang off Project Categories,
    // which hangs off Home).
    title: "Page copy",
    items: [
      {
        label: "Home",
        href: "/admin/home-content",
        children: [
          {
            label: "Project categories",
            href: "/admin/category-pages",
            children: [{ label: "Project types", href: "/admin/sub-type-pages" }],
          },
        ],
      },
      {
        label: "About",
        href: "/admin/about-content",
        children: [{ label: "Services intro", href: "/admin/services-page-content" }],
      },
      { label: "Projects map", href: "/admin/projects-map-content" },
      { label: "Testimonials", href: "/admin/testimonials-page-content" },
      { label: "Book a consultation" }, // not built yet
      { label: "Contact", href: "/admin/settings" }, // copy lives in Settings
      { label: "Privacy", href: "/admin/privacy-content" },
    ],
  },
  {
    // Things with many individual entries — records you add, edit and
    // delete one at a time, not tied to a single page's copy.
    title: "Content library",
    items: [
      { label: "Projects", href: "/admin/projects" },
      { label: "Packages", href: "/admin/packages" },
      { label: "Services", href: "/admin/services" },
      { label: "Team members", href: "/admin/team-members" },
      { label: "Testimonials", href: "/admin/testimonials" },
      { label: "Local authorities", href: "/admin/local-authorities" },
    ],
  },
  {
    title: "Site setup",
    items: [
      { label: "Navigation menu", href: "/admin/nav" },
      { label: "Settings", href: "/admin/settings" },
    ],
  },
];

function isActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavItemRow({
  item,
  pathname,
  depth,
  navCounts,
}: {
  item: NavItem;
  pathname: string;
  depth: number;
  navCounts?: Record<string, number>;
}) {
  const style = { paddingLeft: 12 + depth * 14 };
  const count = item.href ? navCounts?.[item.href] : undefined;
  const label = count !== undefined ? `${item.label} (${count})` : item.label;

  return (
    <>
      {item.href ? (
        <Link
          href={item.href}
          style={style}
          className={[styles.navLink, isActive(pathname, item.href) ? styles.navLinkActive : ""]
            .filter(Boolean)
            .join(" ")}
        >
          {label}
        </Link>
      ) : (
        <span style={style} className={styles.navLinkSoon} title="Not built yet">
          {item.label}
          <span className={styles.soonTag}>Soon</span>
        </span>
      )}
      {item.children?.map((child) => (
        <NavItemRow key={child.label} item={child} pathname={pathname} depth={depth + 1} navCounts={navCounts} />
      ))}
    </>
  );
}

export default function AdminShell({
  user,
  navCounts,
  children,
}: {
  user: { name: string; email: string };
  navCounts?: Record<string, number>;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.wordmark}>
          <span className={styles.logoMark}>AO</span>
          <span className={styles.title}>Admin</span>
        </div>

        <nav className={styles.nav}>
          {NAV_GROUPS.map((group) => (
            <div key={group.title} className={styles.navGroup}>
              <div className={styles.navGroupTitle}>{group.title}</div>
              {group.items.map((item) => (
                <NavItemRow key={item.label} item={item} pathname={pathname} depth={0} navCounts={navCounts} />
              ))}
            </div>
          ))}
        </nav>

        <div className={styles.footer}>
          <div className={styles.userName}>{user.name}</div>
          <div className={styles.userEmail}>{user.email}</div>
          <form action={logoutAction}>
            <button type="submit" className={styles.logoutBtn}>
              Log out
            </button>
          </form>
        </div>
      </aside>

      <main className={styles.main}>{children}</main>
    </div>
  );
}

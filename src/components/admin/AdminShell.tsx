import Link from "next/link";
import { logoutAction } from "@/app/admin/login/actions";
import styles from "./AdminShell.module.css";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin" },
  { label: "Projects", href: "/admin/projects" },
  { label: "Packages", href: "/admin/packages" },
  { label: "Services", href: "/admin/services" },
  { label: "Local Authorities", href: "/admin/local-authorities" },
  { label: "Category Pages", href: "/admin/category-pages" },
  { label: "Sub-Type Pages", href: "/admin/sub-type-pages" },
  { label: "Home Content", href: "/admin/home-content" },
  { label: "About Content", href: "/admin/about-content" },
  { label: "Team Members", href: "/admin/team-members" },
  { label: "Testimonials", href: "/admin/testimonials" },
  { label: "Privacy Content", href: "/admin/privacy-content" },
  { label: "Projects Map Content", href: "/admin/projects-map-content" },
  { label: "Nav", href: "/admin/nav" },
  { label: "Settings", href: "/admin/settings" },
];

export default function AdminShell({
  user,
  children,
}: {
  user: { name: string; email: string };
  children: React.ReactNode;
}) {
  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.wordmark}>
          <span className={styles.logoMark}>AO</span>
          <span className={styles.title}>Admin</span>
        </div>

        <nav className={styles.nav}>
          {NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href} className={styles.navLink}>
              {item.label}
            </Link>
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

import Link from "next/link";
import styles from "./SiteHeader.module.css";
import {
  NAV_LINKS,
  EXPLORE_PROJECTS_HREF,
  ABOUT_HREF,
  ABOUT_SERVICES_HREF,
  HOME_HREF,
  BOOK_CONSULTATION_HREF,
} from "@/lib/nav";

export default function SiteHeader() {
  return (
    <header className={styles.nav}>
      <Link href={HOME_HREF} className={styles.wordmark}>
        <span className={styles.logoMark}>AO</span>
        <span className={styles.logoText}>Architecture ONE</span>
      </Link>

      <nav className={styles.navlinks}>
        <div className={styles.navItem}>
          <Link href={ABOUT_HREF}>About ▾</Link>
          <div className={styles.submenu}>
            <Link href={ABOUT_SERVICES_HREF}>Services</Link>
          </div>
        </div>
        <Link href={EXPLORE_PROJECTS_HREF}>Explore Projects</Link>
        {NAV_LINKS.map((link) => (
          <Link key={link.href} href={link.href}>
            {link.label}
          </Link>
        ))}
      </nav>

      <div className={styles.actions}>
        <Link href="/contact" className={styles.contactLink}>
          Contact Us
        </Link>
        <Link href={BOOK_CONSULTATION_HREF} className={styles.btnPrimary}>
          Book a Consultation
        </Link>
      </div>
    </header>
  );
}

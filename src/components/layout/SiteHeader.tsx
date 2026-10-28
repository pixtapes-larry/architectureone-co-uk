"use client";

import { Fragment, useState } from "react";
import Link from "next/link";
import styles from "./SiteHeader.module.css";
import type { NavItemSummary } from "@/lib/nav-items";
import {
  EXPLORE_PROJECTS_HREF,
  HOME_HREF,
  BOOK_CONSULTATION_HREF,
  CONTACT_HREF,
} from "@/lib/nav";

// Two/three-word nav labels break onto a fixed second line in the desktop
// nav to keep the whole bar compact — not a bug, a deliberate space saver.
// Keyed by href (stable regardless of admin reordering), the mobile
// dropdown panel uses the plain label instead, where a single line reads
// fine at full panel width.
const DESKTOP_LABEL_BREAKS: Record<string, [string, string]> = {
  [EXPLORE_PROJECTS_HREF]: ["Explore", "Projects"],
  "/permitted-development": ["Permitted", "Development"],
  "/large-extensions": ["Large", "Extensions"],
  "/new-builds-developments": ["New Builds &", "Developments"],
};

export default function SiteHeader({ navItems }: { navItems: NavItemSummary[] }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={styles.nav}>
      <Link href={HOME_HREF} className={styles.wordmark}>
        <span className={styles.logoMark}>AO</span>
        <span className={styles.logoText}>Architecture ONE</span>
      </Link>

      <nav className={styles.navlinks}>
        {navItems.map((item) => {
          const lines = DESKTOP_LABEL_BREAKS[item.href];

          if (item.children.length > 0) {
            return (
              <div key={item.id} className={styles.navItem}>
                <Link href={item.href}>{item.label} ▾</Link>
                <div className={styles.submenu}>
                  {item.children.map((child) => (
                    <Link key={child.id} href={child.href}>
                      {child.label}
                    </Link>
                  ))}
                </div>
              </div>
            );
          }

          return (
            <Link
              key={item.id}
              href={item.href}
              className={lines ? styles.navLabel : undefined}
            >
              {lines ? (
                <>
                  <span>{lines[0]}</span>
                  <span>{lines[1]}</span>
                </>
              ) : (
                item.label
              )}
            </Link>
          );
        })}
      </nav>

      <div className={styles.actions}>
        <Link href={CONTACT_HREF} className={styles.contactLink}>
          Contact Us
        </Link>
        <Link href={BOOK_CONSULTATION_HREF} className={styles.btnPrimary}>
          Book a Consultation
        </Link>
      </div>

      <div className={styles.mobileActions}>
        <Link href={BOOK_CONSULTATION_HREF} className={styles.btnPrimary}>
          Book a Consultation
        </Link>
        <button
          type="button"
          className={styles.burgerBtn}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className={menuOpen ? styles.burgerLineOpenTop : styles.burgerLine} />
          <span className={menuOpen ? styles.burgerLineOpenMid : styles.burgerLine} />
          <span className={menuOpen ? styles.burgerLineOpenBtm : styles.burgerLine} />
        </button>
      </div>

      {menuOpen && (
        <nav className={styles.mobilePanel}>
          {navItems.map((item) => (
            <Fragment key={item.id}>
              <Link href={item.href} onClick={closeMenu}>
                {item.label}
              </Link>
              {item.children.map((child) => (
                <Link
                  key={child.id}
                  href={child.href}
                  onClick={closeMenu}
                  className={styles.mobileSubLink}
                >
                  {child.label}
                </Link>
              ))}
            </Fragment>
          ))}
          <Link href={CONTACT_HREF} onClick={closeMenu}>
            Contact Us
          </Link>
        </nav>
      )}
    </header>
  );
}

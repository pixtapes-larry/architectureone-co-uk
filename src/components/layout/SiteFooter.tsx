import Link from "next/link";
import styles from "./SiteFooter.module.css";

export default function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.copy}>
        © Architecture ONE · East of England · 01473 807754
      </div>
      <div className={styles.links}>
        <Link href="/resources">Free guides</Link>
        <Link href="/privacy">Privacy</Link>
        <a href="https://instagram.com" target="_blank" rel="noreferrer">
          Instagram
        </a>
      </div>
    </footer>
  );
}

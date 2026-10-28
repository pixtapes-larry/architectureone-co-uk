import { getSiteMapTree } from "@/lib/admin/site-map";
import SiteMapTree from "@/components/admin/SiteMapTree";
import styles from "./site-map.module.css";

export const instant = false;

export default async function SiteMapAdminPage() {
  const tree = await getSiteMapTree();

  return (
    <>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Site map</h1>
      <p style={{ fontSize: 13, color: "var(--color-muted)", marginBottom: 24, maxWidth: 640 }}>
        How the public site is actually structured — click any box to jump straight
        to editing it. A small note under a box calls out anything worth knowing:
        a shared template, or a real link from somewhere else on the site.
      </p>

      <div className={styles.legend}>
        <span className={styles.legendItem}>
          <span className={`${styles.swatch} ${styles.swatchPage}`} />
          Editable page
        </span>
        <span className={styles.legendItem}>
          <span className={`${styles.swatch} ${styles.swatchList}`} />
          List of records (click through to see them)
        </span>
      </div>

      <SiteMapTree roots={tree} />
    </>
  );
}

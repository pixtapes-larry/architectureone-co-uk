import Link from "next/link";
import { listPackagesAdmin, getPackageSettingsAdmin } from "@/lib/admin/packages";
import { saveNoteAction } from "./actions";
import DeletePackageButton from "./DeletePackageButton";
import formStyles from "@/components/forms/forms.module.css";
import styles from "../projects/projects.module.css";

export const instant = false;

export default async function AdminPackagesPage() {
  const [packages, settings] = await Promise.all([
    listPackagesAdmin(),
    getPackageSettingsAdmin(),
  ]);

  return (
    <>
      <div className={styles.header}>
        <h1 className={styles.title}>Packages ({packages.length})</h1>
        <Link href="/admin/packages/new" className={styles.newBtn}>
          + New package
        </Link>
      </div>

      {packages.length === 0 ? (
        <div className={styles.empty}>No packages yet.</div>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Slug</th>
              <th>Order</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {packages.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.price}</td>
                <td>{p.slug}</td>
                <td>{p.sortOrder}</td>
                <td>
                  {p.featured && (
                    <span className={styles.featuredBadge}>Featured</span>
                  )}
                </td>
                <td>
                  <div className={styles.rowActions}>
                    <Link
                      href={`/admin/packages/${p.id}/edit`}
                      className={styles.editLink}
                    >
                      Edit
                    </Link>
                    <DeletePackageButton id={p.id} name={p.name} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <section style={{ marginTop: 32 }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 12 }}>
          Shared pricing note
        </h2>
        <p style={{ fontSize: 13, color: "var(--color-muted)", marginBottom: 12 }}>
          Shown under every package&apos;s pricing, on the category page, each
          sub-type page, and each package&apos;s own detail page.
        </p>
        <form action={saveNoteAction}>
          <textarea
            name="note"
            defaultValue={settings?.note ?? ""}
            className={formStyles.textarea}
            style={{ minHeight: 80, width: "100%", maxWidth: 560 }}
          />
          <div style={{ marginTop: 12 }}>
            <button type="submit" className={formStyles.submitBtn}>
              Save note
            </button>
          </div>
        </form>
      </section>
    </>
  );
}

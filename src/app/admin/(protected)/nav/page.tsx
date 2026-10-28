import Link from "next/link";
import { listNavItemsAdmin } from "@/lib/admin/nav-items";
import { toggleNavItemVisibleFormAction, moveNavItemFormAction } from "./actions";
import DeleteNavItemButton from "./DeleteNavItemButton";
import styles from "../projects/projects.module.css";

export const instant = false;

export default async function AdminNavPage() {
  const items = await listNavItemsAdmin();

  return (
    <>
      <div className={styles.header}>
        <h1 className={styles.title}>Header nav ({items.length})</h1>
        <Link href="/admin/nav/new" className={styles.newBtn}>
          + New item
        </Link>
      </div>
      <p style={{ fontSize: 13, color: "var(--color-muted)", marginBottom: 20 }}>
        Order and visibility here drive the live site header. Indented rows
        are dropdown items nested under the row above them.
      </p>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Label</th>
            <th>Href</th>
            <th>Visible</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td style={{ paddingLeft: item.depth > 0 ? 32 : undefined }}>
                {item.depth > 0 && "↳ "}
                {item.label}
              </td>
              <td>{item.href}</td>
              <td>
                <form action={toggleNavItemVisibleFormAction}>
                  <input type="hidden" name="id" value={item.id} />
                  <button type="submit" className={styles.deleteBtn}>
                    {item.visible ? "Visible" : "Hidden"}
                  </button>
                </form>
              </td>
              <td>
                <div className={styles.rowActions}>
                  <form action={moveNavItemFormAction}>
                    <input type="hidden" name="id" value={item.id} />
                    <input type="hidden" name="direction" value="up" />
                    <button type="submit" className={styles.deleteBtn} aria-label="Move up">
                      ↑
                    </button>
                  </form>
                  <form action={moveNavItemFormAction}>
                    <input type="hidden" name="id" value={item.id} />
                    <input type="hidden" name="direction" value="down" />
                    <button type="submit" className={styles.deleteBtn} aria-label="Move down">
                      ↓
                    </button>
                  </form>
                </div>
              </td>
              <td>
                <div className={styles.rowActions}>
                  <Link href={`/admin/nav/${item.id}/edit`} className={styles.editLink}>
                    Edit
                  </Link>
                  <DeleteNavItemButton id={item.id} label={item.label} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

import Link from "next/link";
import { listCategoryPagesAdmin } from "@/lib/admin/category-pages";
import styles from "../projects/projects.module.css";

export const instant = false;

export default async function AdminCategoryPagesPage() {
  const pages = await listCategoryPagesAdmin();

  return (
    <>
      <div className={styles.header}>
        <h1 className={styles.title}>Project categories ({pages.length})</h1>
      </div>
      <p style={{ fontSize: 13, color: "var(--color-muted)", marginBottom: 20 }}>
        The 3 top-level category pages — hero copy, sub-type teaser cards,
        planning route, fees, considerations and closing panel.
      </p>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Category</th>
            <th>Hero title</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {pages.map((p) => (
            <tr key={p.id}>
              <td>{p.category}</td>
              <td>{p.heroTitle}</td>
              <td>
                <Link href={`/admin/category-pages/${p.category}/edit`} className={styles.editLink}>
                  Edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

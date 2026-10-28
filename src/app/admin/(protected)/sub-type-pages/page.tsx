import Link from "next/link";
import { listSubTypePagesAdmin } from "@/lib/admin/sub-type-pages";
import { PROJECT_TYPE_LABELS } from "@/lib/project-labels";
import styles from "../projects/projects.module.css";

export const instant = false;

export default async function AdminSubTypePagesPage() {
  const pages = await listSubTypePagesAdmin();

  return (
    <>
      <div className={styles.header}>
        <h1 className={styles.title}>Sub-type pages ({pages.length})</h1>
      </div>
      <p style={{ fontSize: 13, color: "var(--color-muted)", marginBottom: 20 }}>
        The project-type pages one level below each category (e.g. Permitted
        Development → Loft Conversions).
      </p>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Project type</th>
            <th>Hero title</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {pages.map((p) => (
            <tr key={p.id}>
              <td>{PROJECT_TYPE_LABELS[p.projectType]}</td>
              <td>{p.heroTitle}</td>
              <td>
                <Link href={`/admin/sub-type-pages/${p.projectType}/edit`} className={styles.editLink}>
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

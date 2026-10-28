import Link from "next/link";
import { listLocalAuthorityBlurbsAdmin } from "@/lib/admin/local-authorities";
import styles from "../projects/projects.module.css";

export const instant = false;

export default async function AdminLocalAuthoritiesPage() {
  const rows = await listLocalAuthorityBlurbsAdmin();

  return (
    <>
      <div className={styles.header}>
        <h1 className={styles.title}>Local Authorities ({rows.length})</h1>
      </div>
      <p style={{ fontSize: 13, color: "var(--color-muted)", marginBottom: 20 }}>
        Every local authority with at least one project. Add a custom intro
        blurb to override the computed &quot;X projects and counting&quot;
        line on that authority&apos;s showcase page.
      </p>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Local authority</th>
            <th>Blurb</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name}>
              <td>{row.name}</td>
              <td>
                {row.blurb ? (
                  row.blurb.length > 80 ? `${row.blurb.slice(0, 80)}…` : row.blurb
                ) : (
                  <span style={{ color: "var(--color-muted)" }}>
                    Using computed line
                  </span>
                )}
              </td>
              <td>
                <Link
                  href={`/admin/local-authorities/${encodeURIComponent(row.name)}/edit`}
                  className={styles.editLink}
                >
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

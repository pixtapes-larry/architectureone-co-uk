import Link from "next/link";
import { listLocalAuthoritiesAdmin, listUnusedBoundarySlugsAdmin } from "@/lib/admin/local-authorities";
import styles from "../projects/projects.module.css";

export const instant = false;

export default async function AdminLocalAuthoritiesPage() {
  const [rows, unusedBoundaries] = await Promise.all([
    listLocalAuthoritiesAdmin(),
    listUnusedBoundarySlugsAdmin(),
  ]);

  return (
    <>
      <div className={styles.header}>
        <h1 className={styles.title}>Local Authorities ({rows.length})</h1>
      </div>
      <p style={{ fontSize: 13, color: "var(--color-muted)", marginBottom: 12 }}>
        Every local authority below already has a live page at
        /local-authority/&lt;slug&gt; — a page exists automatically for any
        local authority name used on a project, nothing to create by hand.
        <strong> To add a new one</strong>, give a project that exact local
        authority name on its edit page; the showcase page appears the
        moment it&apos;s saved.
      </p>
      <p style={{ fontSize: 13, color: "var(--color-muted)", marginBottom: 20 }}>
        Add a custom intro blurb to override the computed &quot;X projects
        and counting&quot; line. &quot;Map boundary&quot; shows whether a
        geo-boundary file exists for that authority&apos;s map overlay —
        missing one just means no shaded outline on the map, the page still
        works.
      </p>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Local authority</th>
            <th>Slug</th>
            <th>Projects</th>
            <th>Map boundary</th>
            <th>Blurb</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name}>
              <td>{row.name}</td>
              <td style={{ fontFamily: "monospace", fontSize: 12, color: "var(--color-muted)" }}>
                {row.slug}
              </td>
              <td>{row.projectCount}</td>
              <td>
                {row.hasBoundary ? (
                  <span style={{ color: "var(--color-coral)", fontWeight: 700 }}>✓ {row.boundarySlug}</span>
                ) : (
                  <span style={{ color: "var(--color-muted)" }}>— none</span>
                )}
              </td>
              <td>
                {row.blurb ? (
                  row.blurb.length > 60 ? `${row.blurb.slice(0, 60)}…` : row.blurb
                ) : (
                  <span style={{ color: "var(--color-muted)" }}>Using computed line</span>
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

      {unusedBoundaries.length > 0 && (
        <>
          <div className={styles.header} style={{ marginTop: 40 }}>
            <h1 className={styles.title}>
              Unused boundary files ({unusedBoundaries.length})
            </h1>
          </div>
          <p style={{ fontSize: 13, color: "var(--color-muted)", marginBottom: 20 }}>
            Geo-boundary files that exist under public/boundaries/by-la but
            aren&apos;t matched to any local authority currently used on a
            project — not a problem, just unused until a project references
            that authority.
          </p>
          <p style={{ fontSize: 13, fontFamily: "monospace", color: "var(--color-muted-dark)" }}>
            {unusedBoundaries.join(", ")}
          </p>
        </>
      )}
    </>
  );
}

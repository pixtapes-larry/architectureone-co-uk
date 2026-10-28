import Link from "next/link";
import { listProjectsAdmin } from "@/lib/admin/projects";
import { PROJECT_TYPE_LABELS } from "@/lib/project-labels";
import DeleteProjectButton from "./DeleteProjectButton";
import styles from "./projects.module.css";

export const instant = false;

export default async function AdminProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const projects = await listProjectsAdmin(q);

  return (
    <>
      <div className={styles.header}>
        <h1 className={styles.title}>Projects ({projects.length})</h1>
        <Link href="/admin/projects/new" className={styles.newBtn}>
          + New project
        </Link>
      </div>

      <form className={styles.searchForm}>
        <input
          type="search"
          name="q"
          defaultValue={q ?? ""}
          placeholder="Search address, place, postcode, authority…"
          className={styles.searchInput}
        />
      </form>

      {projects.length === 0 ? (
        <div className={styles.empty}>No projects match.</div>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th></th>
              <th>Address</th>
              <th>Local authority</th>
              <th>Type</th>
              <th>Instructed</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p.id}>
                <td>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.coverPhotoUrl} alt="" className={styles.thumb} />
                </td>
                <td>
                  {p.address}
                  <br />
                  <span style={{ color: "var(--color-muted)", fontSize: 12 }}>
                    {p.place}
                  </span>
                </td>
                <td>{p.localAuthority}</td>
                <td>{PROJECT_TYPE_LABELS[p.projectType]}</td>
                <td>{p.instructionDate.toISOString().slice(0, 10)}</td>
                <td>
                  {p.featured && (
                    <span className={styles.featuredBadge}>Featured</span>
                  )}
                </td>
                <td>
                  <div className={styles.rowActions}>
                    <Link
                      href={`/admin/projects/${p.id}/edit`}
                      className={styles.editLink}
                    >
                      Edit
                    </Link>
                    <DeleteProjectButton id={p.id} address={p.address} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}

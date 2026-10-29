import Link from "next/link";
import { listAwardsAdmin } from "@/lib/admin/awards";
import DeleteAwardButton from "./DeleteAwardButton";
import styles from "../projects/projects.module.css";

export const instant = false;

export default async function AdminAwardsPage() {
  const awards = await listAwardsAdmin();

  return (
    <>
      <div className={styles.header}>
        <h1 className={styles.title}>Awards ({awards.length})</h1>
        <Link href="/admin/awards/new" className={styles.newBtn}>
          + New award
        </Link>
      </div>
      <p style={{ fontSize: 13, color: "var(--color-muted)", marginBottom: 20 }}>
        Shown on the /awards page and counted live in the home page hero
        (&quot;X awards won&quot;).
      </p>

      {awards.length === 0 ? (
        <div className={styles.empty}>No awards yet.</div>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Award</th>
              <th>Year</th>
              <th>Link</th>
              <th>Project</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {awards.map((award) => (
              <tr key={award.id}>
                <td>{award.name}</td>
                <td>{award.year}</td>
                <td>
                  {award.sourceUrl ? (
                    <a href={award.sourceUrl} target="_blank" rel="noreferrer" className={styles.editLink}>
                      View ↗
                    </a>
                  ) : (
                    <span style={{ color: "var(--color-muted)" }}>—</span>
                  )}
                </td>
                <td>
                  {award.project ? (
                    <Link href={`/admin/projects/${award.project.id}/edit`} className={styles.editLink}>
                      {award.project.address}
                    </Link>
                  ) : (
                    <span style={{ color: "var(--color-muted)" }}>—</span>
                  )}
                </td>
                <td>
                  <div className={styles.rowActions}>
                    <Link href={`/admin/awards/${award.id}/edit`} className={styles.editLink}>
                      Edit
                    </Link>
                    <DeleteAwardButton id={award.id} />
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

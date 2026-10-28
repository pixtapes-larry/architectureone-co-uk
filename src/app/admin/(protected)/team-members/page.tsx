import Link from "next/link";
import { listTeamMembersAdmin } from "@/lib/admin/about-content";
import { moveTeamMemberFormAction } from "./actions";
import DeleteTeamMemberButton from "./DeleteTeamMemberButton";
import styles from "../projects/projects.module.css";

export const instant = false;

export default async function AdminTeamMembersPage() {
  const members = await listTeamMembersAdmin();

  return (
    <>
      <div className={styles.header}>
        <h1 className={styles.title}>Team members ({members.length})</h1>
        <Link href="/admin/team-members/new" className={styles.newBtn}>
          + New team member
        </Link>
      </div>
      <p style={{ fontSize: 13, color: "var(--color-muted)", marginBottom: 20 }}>
        The first member below renders as the large lead bio on the About
        page; the rest render in the grid.
      </p>

      {members.length === 0 ? (
        <div className={styles.empty}>No team members yet.</div>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.id}>
                <td>{m.name}</td>
                <td>{m.role}</td>
                <td>
                  <div className={styles.rowActions}>
                    <form action={moveTeamMemberFormAction}>
                      <input type="hidden" name="id" value={m.id} />
                      <input type="hidden" name="direction" value="up" />
                      <button type="submit" className={styles.deleteBtn} aria-label="Move up">
                        ↑
                      </button>
                    </form>
                    <form action={moveTeamMemberFormAction}>
                      <input type="hidden" name="id" value={m.id} />
                      <input type="hidden" name="direction" value="down" />
                      <button type="submit" className={styles.deleteBtn} aria-label="Move down">
                        ↓
                      </button>
                    </form>
                  </div>
                </td>
                <td>
                  <div className={styles.rowActions}>
                    <Link href={`/admin/team-members/${m.id}/edit`} className={styles.editLink}>
                      Edit
                    </Link>
                    <DeleteTeamMemberButton id={m.id} name={m.name} />
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

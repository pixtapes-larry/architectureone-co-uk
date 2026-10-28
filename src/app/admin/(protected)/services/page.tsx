import Link from "next/link";
import { listServicesAdmin } from "@/lib/admin/services";
import DeleteServiceButton from "./DeleteServiceButton";
import styles from "../projects/projects.module.css";

export const instant = false;

export default async function AdminServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const services = await listServicesAdmin();

  return (
    <>
      <div className={styles.header}>
        <h1 className={styles.title}>Services ({services.length})</h1>
        <Link href="/admin/services/new" className={styles.newBtn}>
          + New service
        </Link>
      </div>

      {error === "in-use" && (
        <p style={{ color: "#c0392b", marginBottom: 16, fontSize: 13.5 }}>
          Can&apos;t delete that service — it&apos;s still used by a project
          or package. Remove it from those first.
        </p>
      )}

      {services.length === 0 ? (
        <div className={styles.empty}>No services yet.</div>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Group</th>
              <th>Slug</th>
              <th>Order</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {services.map((s) => (
              <tr key={s.id}>
                <td>{s.title}</td>
                <td>{s.group}</td>
                <td>{s.slug}</td>
                <td>{s.sortOrder}</td>
                <td>
                  <div className={styles.rowActions}>
                    <Link
                      href={`/admin/services/${s.id}/edit`}
                      className={styles.editLink}
                    >
                      Edit
                    </Link>
                    <DeleteServiceButton id={s.id} title={s.title} />
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

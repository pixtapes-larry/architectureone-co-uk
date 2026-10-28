import Link from "next/link";
import { listTestimonialsAdmin } from "@/lib/admin/testimonials";
import { listProjectTestimonialsAdmin } from "@/lib/admin/projects";
import TestimonialsTable from "@/components/admin/TestimonialsTable";
import styles from "../projects/projects.module.css";

export const instant = false;

export default async function AdminTestimonialsPage() {
  const [testimonials, projectTestimonials] = await Promise.all([
    listTestimonialsAdmin(),
    listProjectTestimonialsAdmin(),
  ]);

  return (
    <>
      <div className={styles.header}>
        <h1 className={styles.title}>Testimonials ({testimonials.length})</h1>
        <Link href="/admin/testimonials/new" className={styles.newBtn}>
          + New testimonial
        </Link>
      </div>
      <p style={{ fontSize: 13, color: "var(--color-muted)", marginBottom: 20 }}>
        The home page shows the first row below marked as featured (★) in its
        quote bubble. The About page lists all of them, in this order — drag
        the handle on the right to reorder.
      </p>

      <TestimonialsTable testimonials={testimonials} />

      <div className={styles.header} style={{ marginTop: 40 }}>
        <h1 className={styles.title}>
          From project case studies ({projectTestimonials.length})
        </h1>
      </div>
      <p style={{ fontSize: 13, color: "var(--color-muted)", marginBottom: 20 }}>
        Quotes entered directly on a project (its own &quot;A note from the
        team&quot; field) — shown here for visibility, but edited on that
        project, not here.
      </p>

      {projectTestimonials.length === 0 ? (
        <div className={styles.empty}>No project testimonials yet.</div>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Quote</th>
              <th>Customer</th>
              <th>Project</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {projectTestimonials.map((p) => (
              <tr key={p.id}>
                <td>
                  {p.testimonial && p.testimonial.length > 70
                    ? `${p.testimonial.slice(0, 70)}…`
                    : p.testimonial}
                </td>
                <td>
                  {p.customerName ? (
                    <>
                      {p.customerName}
                      {!p.customerConsent && (
                        <span style={{ color: "var(--color-muted)", fontSize: 11, display: "block" }}>
                          No public-naming consent
                        </span>
                      )}
                    </>
                  ) : (
                    <span style={{ color: "var(--color-muted)" }}>Not named</span>
                  )}
                </td>
                <td>
                  {p.address}
                  <br />
                  <span style={{ color: "var(--color-muted)", fontSize: 12 }}>{p.place}</span>
                </td>
                <td>
                  <Link href={`/admin/projects/${p.id}/edit`} className={styles.editLink}>
                    Edit on project →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}

import { notFound } from "next/navigation";
import { getLocalAuthorityBlurbAdmin, listLocalAuthoritiesAdmin } from "@/lib/admin/local-authorities";
import { saveLocalAuthorityBlurbAction } from "../../actions";
import formStyles from "@/components/forms/forms.module.css";
import styles from "@/components/admin/ProjectForm.module.css";
import SeoFields from "@/components/admin/SeoFields";
import TemplateNote from "@/components/admin/TemplateNote";

export const instant = false;

export default async function EditLocalAuthorityPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name: encodedName } = await params;
  const name = decodeURIComponent(encodedName);

  const [rows, info] = await Promise.all([
    listLocalAuthoritiesAdmin(),
    getLocalAuthorityBlurbAdmin(name),
  ]);
  const row = rows.find((r) => r.name === name);

  if (!row) {
    notFound();
  }

  return (
    <>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>
        Edit blurb — {name}
      </h1>
      <p style={{ fontSize: 13, color: "var(--color-muted)", marginBottom: 24 }}>
        Page: <code>/local-authority/{row.slug}</code> · {row.projectCount}{" "}
        project{row.projectCount === 1 ? "" : "s"} ·{" "}
        {row.hasBoundary ? (
          <span style={{ color: "var(--color-coral)" }}>
            map boundary found ({row.boundarySlug}.geojson)
          </span>
        ) : (
          <span>no map boundary file — the page works, just no shaded outline on the map</span>
        )}
      </p>
      <form action={saveLocalAuthorityBlurbAction} className={styles.form}>
        <TemplateNote templateName="Local Authority" />
        <input type="hidden" name="name" value={name} />
        <section className={styles.section}>
          <div className={formStyles.field}>
            <label className={formStyles.label} htmlFor="blurb">
              Intro blurb (leave blank to use the computed &quot;X projects
              and counting&quot; line instead)
            </label>
            <textarea
              id="blurb"
              name="blurb"
              defaultValue={info?.blurb ?? ""}
              className={formStyles.textarea}
              style={{ minHeight: 120 }}
            />
          </div>
        </section>
        <SeoFields metaTitle={info?.metaTitle} metaDescription={info?.metaDescription} />
        <div className={styles.actions}>
          <button type="submit" className={formStyles.submitBtn}>
            Save
          </button>
        </div>
      </form>
    </>
  );
}

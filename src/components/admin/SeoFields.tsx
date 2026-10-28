// Shared "SEO" section reused at the bottom of every page-copy admin form
// — the meta title/description shown in browser tabs and search results.
// Both are optional; leaving them blank falls back to a sensible default
// built from that page's own content (see src/lib/seo.ts).
import formStyles from "@/components/forms/forms.module.css";
import styles from "./ProjectForm.module.css";

export default function SeoFields({
  metaTitle,
  metaDescription,
}: {
  metaTitle?: string | null;
  metaDescription?: string | null;
}) {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>SEO</h2>
      <div className={formStyles.field}>
        <label className={formStyles.label} htmlFor="metaTitle">
          Meta title (optional — browser tab &amp; search result title;
          falls back to a sensible default when blank)
        </label>
        <input
          id="metaTitle"
          name="metaTitle"
          defaultValue={metaTitle ?? ""}
          className={formStyles.input}
        />
      </div>
      <div className={formStyles.field}>
        <label className={formStyles.label} htmlFor="metaDescription">
          Meta description (optional — the snippet shown under the title in
          search results; falls back to a sensible default when blank)
        </label>
        <textarea
          id="metaDescription"
          name="metaDescription"
          defaultValue={metaDescription ?? ""}
          className={formStyles.textarea}
        />
      </div>
    </section>
  );
}

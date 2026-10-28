"use client";

import { useState } from "react";
import type { getServicesPageContentAdmin } from "@/lib/admin/services-page-content";
import { saveServicesPageContentAction } from "@/app/admin/(protected)/services-page-content/actions";
import formStyles from "@/components/forms/forms.module.css";
import styles from "./ProjectForm.module.css";
import SeoFields from "./SeoFields";

type ServicesPageContentRecord = NonNullable<
  Awaited<ReturnType<typeof getServicesPageContentAdmin>>
>;

export default function ServicesPageContentForm({
  content,
}: {
  content: ServicesPageContentRecord;
}) {
  const [paragraphs, setParagraphs] = useState<string[]>(
    content.introParagraphs as string[],
  );

  return (
    <form action={saveServicesPageContentAction} className={styles.form}>
      <p style={{ fontSize: 13, color: "var(--color-muted)", marginBottom: 16 }}>
        This is the /about/services page&apos;s own framing copy — the
        individual services shown on it (grouped by category) are managed
        separately, under Content Library → Services.
      </p>

      <section className={styles.section}>
        <div className={formStyles.field}>
          <label className={formStyles.label} htmlFor="heading">Heading</label>
          <input id="heading" name="heading" required defaultValue={content.heading} className={formStyles.input} />
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Intro (a paragraph or two above the service list)</h2>
        {paragraphs.map((para, i) => (
          <div key={i} className={styles.awardsRow}>
            <textarea
              name="introParagraph"
              defaultValue={para}
              placeholder="Paragraph"
              className={formStyles.textarea}
            />
            <button
              type="button"
              className={styles.removeBtn}
              aria-label="Remove"
              onClick={() => setParagraphs((prev) => prev.filter((_, idx) => idx !== i))}
            >
              ×
            </button>
          </div>
        ))}
        <button
          type="button"
          className={styles.smallBtn}
          onClick={() => setParagraphs((prev) => [...prev, ""])}
        >
          + Add paragraph
        </button>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Closing CTA</h2>
        <div className={formStyles.field}>
          <label className={formStyles.label} htmlFor="finalCtaHeading">Heading</label>
          <textarea id="finalCtaHeading" name="finalCtaHeading" required defaultValue={content.finalCtaHeading} className={formStyles.textarea} />
        </div>
        <div className={formStyles.field}>
          <label className={formStyles.label} htmlFor="finalCtaLead">Lead</label>
          <textarea id="finalCtaLead" name="finalCtaLead" required defaultValue={content.finalCtaLead} className={formStyles.textarea} />
        </div>
      </section>

      <SeoFields metaTitle={content.metaTitle} metaDescription={content.metaDescription} />

      <div className={styles.actions}>
        <button type="submit" className={formStyles.submitBtn}>
          Save changes
        </button>
      </div>
    </form>
  );
}

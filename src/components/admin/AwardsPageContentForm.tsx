"use client";

import { useState } from "react";
import type { getAwardsPageContentAdmin } from "@/lib/admin/awards-page-content";
import { saveAwardsPageContentAction } from "@/app/admin/(protected)/awards-page-content/actions";
import formStyles from "@/components/forms/forms.module.css";
import styles from "./ProjectForm.module.css";
import SeoFields from "./SeoFields";

type AwardsPageContentRecord = NonNullable<Awaited<ReturnType<typeof getAwardsPageContentAdmin>>>;

export default function AwardsPageContentForm({ content }: { content: AwardsPageContentRecord }) {
  const [paragraphs, setParagraphs] = useState<string[]>(content.introParagraphs as string[]);

  return (
    <form action={saveAwardsPageContentAction} className={styles.form}>
      <p style={{ fontSize: 13, color: "var(--color-muted)", marginBottom: 16 }}>
        This is the /awards page&apos;s own intro copy, shown above the
        full list. The awards themselves are managed separately, under
        Content Library → Awards.
      </p>

      <section className={styles.section}>
        <div className={formStyles.field}>
          <label className={formStyles.label} htmlFor="heading">Heading</label>
          <input id="heading" name="heading" required defaultValue={content.heading} className={formStyles.input} />
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Intro</h2>
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

      <SeoFields metaTitle={content.metaTitle} metaDescription={content.metaDescription} />

      <div className={styles.actions}>
        <button type="submit" className={formStyles.submitBtn}>
          Save changes
        </button>
      </div>
    </form>
  );
}

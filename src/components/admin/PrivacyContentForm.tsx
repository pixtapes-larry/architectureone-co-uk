"use client";

import { useState } from "react";
import type { getPrivacyPageContentAdmin } from "@/lib/admin/privacy-content";
import { savePrivacyContentAction } from "@/app/admin/(protected)/privacy-content/actions";
import formStyles from "@/components/forms/forms.module.css";
import styles from "./ProjectForm.module.css";
import SeoFields from "./SeoFields";

type PrivacyContentRecord = NonNullable<Awaited<ReturnType<typeof getPrivacyPageContentAdmin>>>;

export default function PrivacyContentForm({ content }: { content: PrivacyContentRecord }) {
  const [paragraphs, setParagraphs] = useState<string[]>(
    content.bodyParagraphs as string[],
  );

  return (
    <form action={savePrivacyContentAction} className={styles.form}>
      <p style={{ fontSize: 13, color: "var(--color-muted)", marginBottom: 16 }}>
        This is draft, placeholder copy — not legal advice. Get it reviewed
        by a solicitor before launch.
      </p>

      <section className={styles.section}>
        <div className={formStyles.field}>
          <label className={formStyles.label} htmlFor="heading">Heading</label>
          <textarea id="heading" name="heading" required defaultValue={content.heading} className={formStyles.textarea} />
        </div>
        <div className={formStyles.field}>
          <label className={formStyles.label} htmlFor="intro">
            Draft note (shown in a highlighted box above the policy)
          </label>
          <textarea id="intro" name="intro" required defaultValue={content.intro} className={formStyles.textarea} />
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Body paragraphs</h2>
        {paragraphs.map((para, i) => (
          <div key={i} className={styles.awardsRow}>
            <textarea
              name="bodyParagraph"
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
        <div className={formStyles.field}>
          <label className={formStyles.label} htmlFor="lastUpdatedNote">Last-updated note</label>
          <textarea id="lastUpdatedNote" name="lastUpdatedNote" required defaultValue={content.lastUpdatedNote} className={formStyles.textarea} />
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

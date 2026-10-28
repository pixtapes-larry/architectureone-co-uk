"use client";

import { useState } from "react";
import type { getBookConsultationPageContentAdmin } from "@/lib/admin/book-consultation-content";
import { saveBookConsultationPageContentAction } from "@/app/admin/(protected)/book-consultation-content/actions";
import formStyles from "@/components/forms/forms.module.css";
import styles from "./ProjectForm.module.css";
import SeoFields from "./SeoFields";

type BookConsultationPageContentRecord = NonNullable<
  Awaited<ReturnType<typeof getBookConsultationPageContentAdmin>>
>;

export default function BookConsultationPageContentForm({
  content,
}: {
  content: BookConsultationPageContentRecord;
}) {
  const [items, setItems] = useState<string[]>(content.includesList as string[]);

  return (
    <form action={saveBookConsultationPageContentAction} className={styles.form}>
      <section className={styles.section}>
        <div className={formStyles.field}>
          <label className={formStyles.label} htmlFor="heading">Heading</label>
          <input id="heading" name="heading" required defaultValue={content.heading} className={formStyles.input} />
        </div>
        <div className={formStyles.field}>
          <label className={formStyles.label} htmlFor="lead">Lead</label>
          <textarea id="lead" name="lead" required defaultValue={content.lead} className={formStyles.textarea} />
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>&quot;What&apos;s included&quot; sidebar</h2>
        <div className={formStyles.field}>
          <label className={formStyles.label} htmlFor="includesHeading">Heading</label>
          <input
            id="includesHeading"
            name="includesHeading"
            required
            defaultValue={content.includesHeading}
            className={formStyles.input}
          />
        </div>
        {items.map((item, i) => (
          <div key={i} className={styles.awardsRow}>
            <input
              name="includesItem"
              defaultValue={item}
              placeholder="List item"
              className={formStyles.input}
            />
            <button
              type="button"
              className={styles.removeBtn}
              aria-label="Remove"
              onClick={() => setItems((prev) => prev.filter((_, idx) => idx !== i))}
            >
              ×
            </button>
          </div>
        ))}
        <button
          type="button"
          className={styles.smallBtn}
          onClick={() => setItems((prev) => [...prev, ""])}
        >
          + Add item
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

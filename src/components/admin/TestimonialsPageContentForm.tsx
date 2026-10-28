"use client";

import { useState } from "react";
import type { getTestimonialsPageContentAdmin } from "@/lib/admin/testimonials-page-content";
import { saveTestimonialsPageContentAction } from "@/app/admin/(protected)/testimonials-page-content/actions";
import formStyles from "@/components/forms/forms.module.css";
import styles from "./ProjectForm.module.css";
import SeoFields from "./SeoFields";

type TestimonialsPageContentRecord = NonNullable<
  Awaited<ReturnType<typeof getTestimonialsPageContentAdmin>>
>;

export default function TestimonialsPageContentForm({
  content,
}: {
  content: TestimonialsPageContentRecord;
}) {
  const [paragraphs, setParagraphs] = useState<string[]>(
    content.introParagraphs as string[],
  );

  return (
    <form action={saveTestimonialsPageContentAction} className={styles.form}>
      <p style={{ fontSize: 13, color: "var(--color-muted)", marginBottom: 16 }}>
        This is the /testimonials page&apos;s own intro copy, shown above
        the full list. The testimonials themselves (quote, stars, source)
        are managed separately, under Content Library → Testimonials.
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

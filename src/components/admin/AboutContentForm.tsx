"use client";

import { useState } from "react";
import type { getAboutPageContentAdmin } from "@/lib/admin/about-content";
import { saveAboutContentAction } from "@/app/admin/(protected)/about-content/actions";
import formStyles from "@/components/forms/forms.module.css";
import styles from "./ProjectForm.module.css";
import SeoFields from "./SeoFields";

type AboutContentRecord = NonNullable<Awaited<ReturnType<typeof getAboutPageContentAdmin>>>;

export default function AboutContentForm({ content }: { content: AboutContentRecord }) {
  const [storyParagraphs, setStoryParagraphs] = useState<string[]>(
    content.storyParagraphs as string[],
  );

  return (
    <form action={saveAboutContentAction} className={styles.form}>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Hero</h2>
        <div className={formStyles.field}>
          <label className={formStyles.label} htmlFor="heroTagline">Tagline</label>
          <textarea id="heroTagline" name="heroTagline" required defaultValue={content.heroTagline} className={formStyles.textarea} />
        </div>
        <div className={formStyles.field}>
          <label className={formStyles.label} htmlFor="heroPhotoLabel">Photo placeholder label</label>
          <textarea id="heroPhotoLabel" name="heroPhotoLabel" required defaultValue={content.heroPhotoLabel} className={formStyles.textarea} />
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Our story</h2>
        {storyParagraphs.map((para, i) => (
          <div key={i} className={styles.awardsRow}>
            <textarea
              name="storyParagraph"
              defaultValue={para}
              placeholder="Paragraph"
              className={formStyles.textarea}
            />
            <button
              type="button"
              className={styles.removeBtn}
              aria-label="Remove"
              onClick={() => setStoryParagraphs((prev) => prev.filter((_, idx) => idx !== i))}
            >
              ×
            </button>
          </div>
        ))}
        <button
          type="button"
          className={styles.smallBtn}
          onClick={() => setStoryParagraphs((prev) => [...prev, ""])}
        >
          + Add paragraph
        </button>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Services teaser</h2>
        <div className={formStyles.field}>
          <label className={formStyles.label} htmlFor="servicesTeaserLead">Lead</label>
          <textarea id="servicesTeaserLead" name="servicesTeaserLead" required defaultValue={content.servicesTeaserLead} className={formStyles.textarea} />
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Reviews section</h2>
        <div className={formStyles.field}>
          <label className={formStyles.label} htmlFor="reviewsHeading">Heading</label>
          <textarea id="reviewsHeading" name="reviewsHeading" required defaultValue={content.reviewsHeading} className={formStyles.textarea} />
        </div>
        <div className={formStyles.field}>
          <label className={formStyles.label} htmlFor="reviewsLead">Lead</label>
          <textarea id="reviewsLead" name="reviewsLead" required defaultValue={content.reviewsLead} className={formStyles.textarea} />
        </div>
        <div className={formStyles.field}>
          <label className={formStyles.label} htmlFor="reviewsPlaceholderNote">Placeholder note (shown until real reviews are wired up)</label>
          <textarea id="reviewsPlaceholderNote" name="reviewsPlaceholderNote" required defaultValue={content.reviewsPlaceholderNote} className={formStyles.textarea} />
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Final CTA</h2>
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

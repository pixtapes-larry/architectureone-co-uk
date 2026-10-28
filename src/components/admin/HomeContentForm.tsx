"use client";

import { useState } from "react";
import type { getHomePageContentAdmin } from "@/lib/admin/home-content";
import { saveHomeContentAction } from "@/app/admin/(protected)/home-content/actions";
import formStyles from "@/components/forms/forms.module.css";
import styles from "./ProjectForm.module.css";
import SeoFields from "./SeoFields";

type HomeContentRecord = NonNullable<Awaited<ReturnType<typeof getHomePageContentAdmin>>>;

export default function HomeContentForm({ content }: { content: HomeContentRecord }) {
  const [awardNames, setAwardNames] = useState<string[]>(content.awardNames as string[]);

  return (
    <form action={saveHomeContentAction} className={styles.form}>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Hero</h2>
        <div className={formStyles.field}>
          <label className={formStyles.label} htmlFor="heroPill">Pill text</label>
          <textarea id="heroPill" name="heroPill" required defaultValue={content.heroPill} className={formStyles.textarea} />
        </div>
        <div className={formStyles.row}>
          <div className={formStyles.field}>
            <label className={formStyles.label} htmlFor="heroHeadingAccent">
              Heading — highlighted part (use the literal token
              &quot;{"{projectCount}"}&quot; for the live project count)
            </label>
            <textarea id="heroHeadingAccent" name="heroHeadingAccent" required defaultValue={content.heroHeadingAccent} className={formStyles.textarea} />
          </div>
          <div className={formStyles.field}>
            <label className={formStyles.label} htmlFor="heroHeadingRest">Heading — rest</label>
            <textarea id="heroHeadingRest" name="heroHeadingRest" required defaultValue={content.heroHeadingRest} className={formStyles.textarea} />
          </div>
        </div>
        <div className={formStyles.field}>
          <label className={formStyles.label} htmlFor="heroLead">Lead</label>
          <textarea id="heroLead" name="heroLead" required defaultValue={content.heroLead} className={formStyles.textarea} />
        </div>
        <div className={formStyles.field}>
          <label className={formStyles.label} htmlFor="heroPhotoLabel">Photo placeholder label</label>
          <textarea id="heroPhotoLabel" name="heroPhotoLabel" required defaultValue={content.heroPhotoLabel} className={formStyles.textarea} />
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Stats line</h2>
        <p style={{ fontSize: 13, color: "var(--color-muted)", marginBottom: 12 }}>
          The hero&apos;s featured-quote bubble is edited on the Testimonials
          page, not here — it shows the first testimonial marked
          &quot;Featured&quot;.
        </p>
        <div className={formStyles.row}>
          <div className={formStyles.field}>
            <label className={formStyles.label} htmlFor="statsFoundedYear">Founded year</label>
            <input id="statsFoundedYear" name="statsFoundedYear" type="number" required defaultValue={content.statsFoundedYear} className={formStyles.input} />
          </div>
          <div className={formStyles.field}>
            <label className={formStyles.label} htmlFor="statsRating">Rating (e.g. 4.9)</label>
            <input id="statsRating" name="statsRating" type="number" step="0.1" required defaultValue={content.statsRating} className={formStyles.input} />
          </div>
        </div>
        <div className={formStyles.row}>
          <div className={formStyles.field}>
            <label className={formStyles.label} htmlFor="statsReviewCount">Review count</label>
            <input id="statsReviewCount" name="statsReviewCount" type="number" required defaultValue={content.statsReviewCount} className={formStyles.input} />
          </div>
          <div className={formStyles.field}>
            <label className={formStyles.label} htmlFor="statsAwardsWon">Awards won</label>
            <input id="statsAwardsWon" name="statsAwardsWon" type="number" required defaultValue={content.statsAwardsWon} className={formStyles.input} />
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>&quot;Which project sounds like yours?&quot; section</h2>
        <p style={{ fontSize: 13, color: "var(--color-muted)", marginBottom: 12 }}>
          The 3 teaser cards themselves are edited per-category in Category
          Pages, not here.
        </p>
        <div className={formStyles.field}>
          <label className={formStyles.label} htmlFor="audienceHeading">Heading</label>
          <textarea id="audienceHeading" name="audienceHeading" required defaultValue={content.audienceHeading} className={formStyles.textarea} />
        </div>
        <div className={formStyles.field}>
          <label className={formStyles.label} htmlFor="audienceLead">Lead</label>
          <textarea id="audienceLead" name="audienceLead" required defaultValue={content.audienceLead} className={formStyles.textarea} />
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Map teaser</h2>
        <div className={formStyles.field}>
          <label className={formStyles.label} htmlFor="mapTeaserPillText">
            Pill text (can use the &quot;{"{projectCount}"}&quot; token)
          </label>
          <textarea id="mapTeaserPillText" name="mapTeaserPillText" required defaultValue={content.mapTeaserPillText} className={formStyles.textarea} />
        </div>
        <div className={formStyles.field}>
          <label className={formStyles.label} htmlFor="mapTeaserTitle">Title</label>
          <textarea id="mapTeaserTitle" name="mapTeaserTitle" required defaultValue={content.mapTeaserTitle} className={formStyles.textarea} />
        </div>
        <div className={formStyles.field}>
          <label className={formStyles.label} htmlFor="mapTeaserLead">Lead</label>
          <textarea id="mapTeaserLead" name="mapTeaserLead" required defaultValue={content.mapTeaserLead} className={formStyles.textarea} />
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Free guide download</h2>
        <div className={formStyles.field}>
          <label className={formStyles.label} htmlFor="guideCoverText">Cover placeholder text</label>
          <textarea id="guideCoverText" name="guideCoverText" required defaultValue={content.guideCoverText} className={formStyles.textarea} />
        </div>
        <div className={formStyles.row}>
          <div className={formStyles.field}>
            <label className={formStyles.label} htmlFor="guideTag">Tag</label>
            <textarea id="guideTag" name="guideTag" required defaultValue={content.guideTag} className={formStyles.textarea} />
          </div>
          <div className={formStyles.field}>
            <label className={formStyles.label} htmlFor="guideButtonLabel">Button label</label>
            <textarea id="guideButtonLabel" name="guideButtonLabel" required defaultValue={content.guideButtonLabel} className={formStyles.textarea} />
          </div>
        </div>
        <div className={formStyles.field}>
          <label className={formStyles.label} htmlFor="guideHeading">Heading</label>
          <textarea id="guideHeading" name="guideHeading" required defaultValue={content.guideHeading} className={formStyles.textarea} />
        </div>
        <div className={formStyles.field}>
          <label className={formStyles.label} htmlFor="guideLead">Lead</label>
          <textarea id="guideLead" name="guideLead" required defaultValue={content.guideLead} className={formStyles.textarea} />
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Featured projects section</h2>
        <div className={formStyles.field}>
          <label className={formStyles.label} htmlFor="featuredHeading">Heading</label>
          <textarea id="featuredHeading" name="featuredHeading" required defaultValue={content.featuredHeading} className={formStyles.textarea} />
        </div>
        <div className={formStyles.field}>
          <label className={formStyles.label} htmlFor="featuredLead">
            Lead (can use the &quot;{"{projectCount}"}&quot; token)
          </label>
          <textarea id="featuredLead" name="featuredLead" required defaultValue={content.featuredLead} className={formStyles.textarea} />
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Awards strip</h2>
        <div className={formStyles.field}>
          <label className={formStyles.label} htmlFor="awardsLabel">Label</label>
          <textarea id="awardsLabel" name="awardsLabel" required defaultValue={content.awardsLabel} className={formStyles.textarea} />
        </div>
        <div className={formStyles.field}>
          <label className={formStyles.label}>Award names</label>
          {awardNames.map((name, i) => (
            <div key={i} className={styles.awardsRow}>
              <textarea
                name="awardName"
                defaultValue={name}
                placeholder="Award name"
                className={formStyles.textarea}
              />
              <button
                type="button"
                className={styles.removeBtn}
                aria-label="Remove"
                onClick={() => setAwardNames((prev) => prev.filter((_, idx) => idx !== i))}
              >
                ×
              </button>
            </div>
          ))}
          <button
            type="button"
            className={styles.smallBtn}
            onClick={() => setAwardNames((prev) => [...prev, ""])}
          >
            + Add award name
          </button>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Team teaser</h2>
        <p style={{ fontSize: 13, color: "var(--color-muted)", marginBottom: 12 }}>
          The team roster itself is edited on the About Content page, not
          here.
        </p>
        <div className={formStyles.field}>
          <label className={formStyles.label} htmlFor="teamTeaserHeading">Heading</label>
          <textarea id="teamTeaserHeading" name="teamTeaserHeading" required defaultValue={content.teamTeaserHeading} className={formStyles.textarea} />
        </div>
        <div className={formStyles.field}>
          <label className={formStyles.label} htmlFor="teamTeaserLead">Lead</label>
          <textarea id="teamTeaserLead" name="teamTeaserLead" required defaultValue={content.teamTeaserLead} className={formStyles.textarea} />
        </div>
        <div className={formStyles.field}>
          <label className={formStyles.label} htmlFor="teamTeaserButtonLabel">Button label</label>
          <textarea id="teamTeaserButtonLabel" name="teamTeaserButtonLabel" required defaultValue={content.teamTeaserButtonLabel} className={formStyles.textarea} />
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

"use client";

import { useState } from "react";
import type { getSiteSettingsAdmin } from "@/lib/admin/site-settings";
import { saveSiteSettingsAction } from "@/app/admin/(protected)/settings/actions";
import formStyles from "@/components/forms/forms.module.css";
import styles from "./ProjectForm.module.css";
import SeoFields from "./SeoFields";

type SiteSettingsRecord = NonNullable<Awaited<ReturnType<typeof getSiteSettingsAdmin>>>;

export default function SiteSettingsForm({
  settings,
}: {
  settings: SiteSettingsRecord;
}) {
  const [bullets, setBullets] = useState<string[]>(
    (settings.promiseBullets as string[] | null) ?? [],
  );

  return (
    <form action={saveSiteSettingsAction} className={styles.form}>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Contact</h2>
        <div className={formStyles.field}>
          <label className={formStyles.label} htmlFor="contactEmail">
            Contact email
          </label>
          <input
            id="contactEmail"
            name="contactEmail"
            type="email"
            required
            defaultValue={settings.contactEmail}
            className={formStyles.input}
          />
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Contact page copy</h2>
        <div className={formStyles.row}>
          <div className={formStyles.field}>
            <label className={formStyles.label} htmlFor="contactHeading">
              Heading
            </label>
            <textarea
              id="contactHeading"
              name="contactHeading"
              required
              defaultValue={settings.contactHeading}
              className={formStyles.textarea}
            />
          </div>
          <div className={formStyles.field}>
            <label className={formStyles.label} htmlFor="contactSidebarHeading">
              Sidebar heading
            </label>
            <textarea
              id="contactSidebarHeading"
              name="contactSidebarHeading"
              required
              defaultValue={settings.contactSidebarHeading}
              className={formStyles.textarea}
            />
          </div>
        </div>
        <div className={formStyles.field}>
          <label className={formStyles.label} htmlFor="contactLead">
            Lead
          </label>
          <textarea
            id="contactLead"
            name="contactLead"
            required
            defaultValue={settings.contactLead}
            className={formStyles.textarea}
          />
        </div>
        <div className={formStyles.field}>
          <label className={formStyles.label} htmlFor="contactEmailUnconfirmedNote">
            Note under the email address
          </label>
          <textarea
            id="contactEmailUnconfirmedNote"
            name="contactEmailUnconfirmedNote"
            required
            defaultValue={settings.contactEmailUnconfirmedNote}
            className={formStyles.textarea}
          />
        </div>
      </section>

      <p style={{ fontSize: 13, color: "var(--color-muted)", margin: "0 0 -8px" }}>
        The section below is SEO for the Contact page specifically.
      </p>
      <SeoFields metaTitle={settings.contactMetaTitle} metaDescription={settings.contactMetaDescription} />

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Reviews</h2>
        <div className={formStyles.field}>
          <label className={formStyles.label} htmlFor="googleReviewsUrl">
            Google Business Profile reviews URL (shown as &quot;See all
            reviews on Google&quot; on the About page — leave blank to hide
            that link)
          </label>
          <input
            id="googleReviewsUrl"
            name="googleReviewsUrl"
            type="url"
            defaultValue={settings.googleReviewsUrl ?? ""}
            placeholder="https://g.page/r/..."
            className={formStyles.input}
          />
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Office</h2>
        <div className={formStyles.row}>
          <div className={formStyles.field}>
            <label className={formStyles.label} htmlFor="officeLine1">
              Address line 1
            </label>
            <input
              id="officeLine1"
              name="officeLine1"
              required
              defaultValue={settings.officeLine1}
              className={formStyles.input}
            />
          </div>
          <div className={formStyles.field}>
            <label className={formStyles.label} htmlFor="officePlace">
              Place (town, county)
            </label>
            <input
              id="officePlace"
              name="officePlace"
              required
              defaultValue={settings.officePlace}
              className={formStyles.input}
            />
          </div>
        </div>
        <div className={formStyles.row}>
          <div className={formStyles.field}>
            <label className={formStyles.label} htmlFor="officePostcode">
              Postcode
            </label>
            <input
              id="officePostcode"
              name="officePostcode"
              required
              defaultValue={settings.officePostcode}
              className={formStyles.input}
            />
          </div>
          <div className={formStyles.field}>
            <label className={formStyles.label} htmlFor="officePhone">
              Phone
            </label>
            <input
              id="officePhone"
              name="officePhone"
              required
              defaultValue={settings.officePhone}
              className={formStyles.input}
            />
          </div>
        </div>
        <div className={formStyles.row}>
          <div className={formStyles.field}>
            <label className={formStyles.label} htmlFor="officeLatitude">
              Latitude
            </label>
            <input
              id="officeLatitude"
              name="officeLatitude"
              type="number"
              step="any"
              required
              defaultValue={settings.officeLatitude}
              className={formStyles.input}
            />
          </div>
          <div className={formStyles.field}>
            <label className={formStyles.label} htmlFor="officeLongitude">
              Longitude
            </label>
            <input
              id="officeLongitude"
              name="officeLongitude"
              type="number"
              step="any"
              required
              defaultValue={settings.officeLongitude}
              className={formStyles.input}
            />
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          The Architecture ONE Promise (shown on category pages &amp; About)
        </h2>
        {bullets.map((bullet, i) => (
          <div key={i} className={styles.awardsRow}>
            <input
              name="promiseBullet"
              defaultValue={bullet}
              placeholder="Promise bullet"
              className={formStyles.input}
            />
            <button
              type="button"
              className={styles.removeBtn}
              aria-label="Remove bullet"
              onClick={() =>
                setBullets((prev) => prev.filter((_, idx) => idx !== i))
              }
            >
              ×
            </button>
          </div>
        ))}
        <button
          type="button"
          className={styles.smallBtn}
          onClick={() => setBullets((prev) => [...prev, ""])}
        >
          + Add bullet
        </button>
      </section>

      <div className={styles.actions}>
        <button type="submit" className={formStyles.submitBtn}>
          Save settings
        </button>
      </div>
    </form>
  );
}

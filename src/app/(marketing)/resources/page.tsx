import Link from "next/link";
import GuideDownloadForm from "@/components/forms/GuideDownloadForm";
import { getHomePageContent } from "@/lib/home-content";
import { getSiteSettings } from "@/lib/site-settings";
import { HOME_HREF } from "@/lib/nav";
import styles from "./page.module.css";

export const instant = false;

// Placeholder page — a real resources/guides library is planned before
// launch; this just makes the existing "download the free guide" links
// (home page, footer) lead somewhere real instead of 404ing.
export default async function ResourcesPage() {
  const [content, settings] = await Promise.all([getHomePageContent(), getSiteSettings()]);

  return (
    <div className={styles.page}>
      <div className={styles.crumb}>
        <Link href={HOME_HREF}>Home</Link> / Resources
      </div>

      <div className={styles.intro}>
        <h1 className={styles.title}>Free guides</h1>
        <p className={styles.lead}>
          Practical guides to help you plan a project, before you even talk to us.
        </p>
      </div>

      <div className={styles.layout}>
        <div className={styles.cover}>{content.guideCoverText}</div>
        <div className={styles.formCol}>
          <span className={styles.tagCoral}>{content.guideTag}</span>
          <h2 className={styles.title} style={{ fontSize: 24, marginBottom: 10 }}>
            {content.guideHeading}
          </h2>
          <p className={styles.lead} style={{ marginBottom: 20 }}>
            {content.guideLead}
          </p>
          <GuideDownloadForm
            contactEmail={settings.contactEmail}
            buttonLabel={content.guideButtonLabel}
          />
        </div>
      </div>
    </div>
  );
}

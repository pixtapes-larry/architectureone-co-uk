import type { Metadata } from "next";
import Link from "next/link";
import ConsultationForm from "@/components/forms/ConsultationForm";
import { getSiteSettings } from "@/lib/site-settings";
import { getBookConsultationPageContent } from "@/lib/book-consultation-content";
import { pageMetadata } from "@/lib/seo";
import { HOME_HREF, CONTACT_HREF } from "@/lib/nav";
import styles from "./page.module.css";

export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  const content = await getBookConsultationPageContent();
  return pageMetadata({
    metaTitle: content.metaTitle,
    metaDescription: content.metaDescription,
    fallbackTitle: content.heading,
    fallbackDescription: content.lead,
  });
}

export default async function BookAConsultationPage() {
  const [settings, content] = await Promise.all([
    getSiteSettings(),
    getBookConsultationPageContent(),
  ]);

  return (
    <div className={styles.page}>
      <div className={styles.crumb}>
        <Link href={HOME_HREF}>Home</Link> / Book a Consultation
      </div>

      <div className={styles.intro}>
        <h1 className={styles.title}>{content.heading}</h1>
        <p className={styles.lead}>{content.lead}</p>
      </div>

      <div className={styles.layout}>
        <div className={styles.formCard}>
          <ConsultationForm contactEmail={settings.contactEmail} />
        </div>

        <div className={styles.sidebar}>
          <div className={styles.includesCard}>
            <h3>{content.includesHeading}</h3>
            <ul className={styles.includesList}>
              {content.includesList.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
            <p className={styles.contactNote}>
              Have a question first?{" "}
              <Link href={CONTACT_HREF}>Contact us</Link> instead.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

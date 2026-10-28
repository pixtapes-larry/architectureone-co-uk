import type { Metadata } from "next";
import Link from "next/link";
import ContactForm from "@/components/forms/ContactForm";
import OfficeMapLoader from "@/components/map/OfficeMapLoader";
import { getSiteSettings } from "@/lib/site-settings";
import { pageMetadata } from "@/lib/seo";
import { HOME_HREF } from "@/lib/nav";
import styles from "./page.module.css";

export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return pageMetadata({
    metaTitle: settings.contact.metaTitle,
    metaDescription: settings.contact.metaDescription,
    fallbackTitle: "Contact Us",
    fallbackDescription: settings.contact.lead,
  });
}

export default async function ContactPage() {
  const settings = await getSiteSettings();
  const office = settings.office;

  return (
    <div className={styles.page}>
      <div className={styles.crumb}>
        <Link href={HOME_HREF}>Home</Link> / Contact
      </div>

      <div className={styles.intro}>
        <h1 className={styles.title}>{settings.contact.heading}</h1>
        <p className={styles.lead}>{settings.contact.lead}</p>
      </div>

      <div className={styles.layout}>
        <div className={styles.formCard}>
          <ContactForm contactEmail={settings.contactEmail} />
        </div>

        <div className={styles.sidebar}>
          <div className={styles.detailsCard}>
            <h3>{settings.contact.sidebarHeading}</h3>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Phone</span>
              <span className={styles.detailValue}>
                <a href={`tel:${office.phone.replace(/\s/g, "")}`}>
                  {office.phone}
                </a>
              </span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Email</span>
              <span className={styles.detailValue}>
                <a href={`mailto:${settings.contactEmail}`}>
                  {settings.contactEmail}
                </a>
              </span>
              <span className={styles.unconfirmedNote}>
                {settings.contact.emailUnconfirmedNote}
              </span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Office</span>
              <span className={styles.detailValue}>
                {office.line1}
                <br />
                {office.place}
                <br />
                {office.postcode}
              </span>
            </div>
          </div>

          <div className={styles.mapCard}>
            <OfficeMapLoader
              latitude={office.latitude}
              longitude={office.longitude}
              label={`Architecture ONE — ${office.line1}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

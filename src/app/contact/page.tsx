import Link from "next/link";
import ContactForm from "@/components/forms/ContactForm";
import OfficeMapLoader from "@/components/map/OfficeMapLoader";
import {
  ARCHITECTURE_ONE_OFFICE,
  PLACEHOLDER_CONTACT_EMAIL,
} from "@/lib/site-content";
import { HOME_HREF } from "@/lib/nav";
import styles from "./page.module.css";

export default function ContactPage() {
  const office = ARCHITECTURE_ONE_OFFICE;

  return (
    <div className={styles.page}>
      <div className={styles.crumb}>
        <Link href={HOME_HREF}>Home</Link> / Contact
      </div>

      <div className={styles.intro}>
        <h1 className={styles.title}>Contact Us</h1>
        <p className={styles.lead}>
          Have a question before booking a consultation? Send us a
          message and we&apos;ll get back to you.
        </p>
      </div>

      <div className={styles.layout}>
        <div className={styles.formCard}>
          <ContactForm />
        </div>

        <div className={styles.sidebar}>
          <div className={styles.detailsCard}>
            <h3>Get in touch</h3>
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
                <a href={`mailto:${PLACEHOLDER_CONTACT_EMAIL}`}>
                  {PLACEHOLDER_CONTACT_EMAIL}
                </a>
              </span>
              <span className={styles.unconfirmedNote}>
                Unconfirmed — unused inbox until we set this up properly.
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

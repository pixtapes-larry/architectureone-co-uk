import Link from "next/link";
import { getServiceGroups } from "@/lib/services";
import { HOME_HREF, ABOUT_HREF, BOOK_CONSULTATION_HREF } from "@/lib/nav";
import styles from "./page.module.css";

export const instant = false;

export default async function ServicesPage() {
  const serviceGroups = await getServiceGroups();
  return (
    <>
      <div className={styles.page}>
        <div className={styles.crumb}>
          <Link href={HOME_HREF}>Home</Link> /{" "}
          <Link href={ABOUT_HREF}>About</Link> / Services
        </div>

        <div className={styles.intro}>
          <h1 className={styles.title}>Services</h1>
          <p className={styles.lead}>
            From first sketch to a finished build, here&apos;s the full
            range of what we do.
          </p>
        </div>

        <div className={styles.groupGrid}>
          {serviceGroups.map((group) => (
            <div key={group.heading} className={styles.groupCard}>
              <h2 className={styles.groupHeading}>{group.heading}</h2>
              {group.note && (
                <p className={styles.groupNote}>{group.note}</p>
              )}
              <ul className={styles.serviceList}>
                {group.services.map((service) => (
                  <li key={service.id}>
                    <div className={styles.serviceTitle}>{service.title}</div>
                    <p className={styles.serviceDescription}>
                      {service.description}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <section className={styles.ctaBand} id="book">
        <h2 className={styles.h2}>Ready to talk about your project?</h2>
        <p className={styles.ctaLead}>
          Book a conversation with us — we&apos;ll help you work out
          what&apos;s possible, honestly, before you commit to anything.
        </p>
        <Link href={BOOK_CONSULTATION_HREF} className={styles.btnPrimary}>
          Book a Consultation
        </Link>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { getServiceGroups } from "@/lib/services";
import { getServicesPageContent } from "@/lib/services-page-content";
import { pageMetadata } from "@/lib/seo";
import { HOME_HREF, ABOUT_HREF, BOOK_CONSULTATION_HREF } from "@/lib/nav";
import styles from "./page.module.css";

export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  const content = await getServicesPageContent();
  return pageMetadata({
    metaTitle: content.metaTitle,
    metaDescription: content.metaDescription,
    fallbackTitle: content.heading,
    fallbackDescription: content.introParagraphs[0] ?? "",
  });
}

export default async function ServicesPage() {
  const [serviceGroups, content] = await Promise.all([
    getServiceGroups(),
    getServicesPageContent(),
  ]);
  return (
    <>
      <div className={styles.page}>
        <div className={styles.crumb}>
          <Link href={HOME_HREF}>Home</Link> /{" "}
          <Link href={ABOUT_HREF}>About</Link> / Services
        </div>

        <div className={styles.intro}>
          <h1 className={styles.title}>{content.heading}</h1>
          {content.introParagraphs.map((para, i) => (
            <p key={i} className={styles.lead}>
              {para}
            </p>
          ))}
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
        <h2 className={styles.h2}>{content.finalCtaHeading}</h2>
        <p className={styles.ctaLead}>{content.finalCtaLead}</p>
        <Link href={BOOK_CONSULTATION_HREF} className={styles.btnPrimary}>
          Book a Consultation
        </Link>
      </section>
    </>
  );
}

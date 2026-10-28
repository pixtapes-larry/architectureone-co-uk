import type { Metadata } from "next";
import Link from "next/link";
import { getAllAwards } from "@/lib/awards";
import { getAwardsPageContent } from "@/lib/awards-page-content";
import { pageMetadata } from "@/lib/seo";
import { HOME_HREF } from "@/lib/nav";
import styles from "./page.module.css";

export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  const content = await getAwardsPageContent();
  return pageMetadata({
    metaTitle: content.metaTitle,
    metaDescription: content.metaDescription,
    fallbackTitle: content.heading,
    fallbackDescription: content.introParagraphs[0] ?? "",
  });
}

export default async function AwardsPage() {
  const [content, awards] = await Promise.all([getAwardsPageContent(), getAllAwards()]);

  return (
    <div className={styles.page}>
      <div className={styles.crumb}>
        <Link href={HOME_HREF}>Home</Link> / Awards
      </div>

      <div className={styles.intro}>
        <h1 className={styles.title}>{content.heading}</h1>
        {content.introParagraphs.map((para, i) => (
          <p key={i} className={styles.lead}>
            {para}
          </p>
        ))}
      </div>

      {awards.length === 0 ? (
        <p className={styles.lead}>No awards yet.</p>
      ) : (
        <div className={styles.list}>
          {awards.map((award) => (
            <div key={award.id} className={styles.card}>
              <div className={styles.year}>{award.year}</div>
              <div className={styles.name}>{award.name}</div>
              {award.project && (
                award.project.slug ? (
                  <Link href={`/work/${award.project.slug}`} className={styles.projectLink}>
                    {award.project.address}, {award.project.place} →
                  </Link>
                ) : (
                  <span className={styles.projectLabel}>
                    {award.project.address}, {award.project.place}
                  </span>
                )
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

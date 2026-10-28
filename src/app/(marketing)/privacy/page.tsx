import type { Metadata } from "next";
import Link from "next/link";
import { getPrivacyPageContent } from "@/lib/privacy-content";
import { pageMetadata } from "@/lib/seo";
import { HOME_HREF } from "@/lib/nav";
import styles from "./page.module.css";

export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPrivacyPageContent();
  return pageMetadata({
    metaTitle: content.metaTitle,
    metaDescription: content.metaDescription,
    fallbackTitle: "Privacy Policy",
    fallbackDescription: content.intro,
  });
}

export default async function PrivacyPage() {
  const content = await getPrivacyPageContent();

  return (
    <div className={styles.page}>
      <div className={styles.crumb}>
        <Link href={HOME_HREF}>Home</Link> / Privacy
      </div>

      <h1 className={styles.title}>{content.heading}</h1>

      <div className={styles.draftNote}>{content.intro}</div>

      <div className={styles.body}>
        {content.bodyParagraphs.map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>

      <p className={styles.lastUpdated}>{content.lastUpdatedNote}</p>
    </div>
  );
}

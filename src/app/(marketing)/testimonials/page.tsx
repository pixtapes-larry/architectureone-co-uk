import type { Metadata } from "next";
import Link from "next/link";
import { getAllTestimonials } from "@/lib/testimonials";
import { getTestimonialsPageContent } from "@/lib/testimonials-page-content";
import { pageMetadata } from "@/lib/seo";
import { HOME_HREF } from "@/lib/nav";
import TestimonialCard from "./TestimonialCard";
import styles from "./page.module.css";

export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  const content = await getTestimonialsPageContent();
  return pageMetadata({
    metaTitle: content.metaTitle,
    metaDescription: content.metaDescription,
    fallbackTitle: content.heading,
    fallbackDescription: content.introParagraphs[0] ?? "",
  });
}

export default async function TestimonialsPage() {
  const [content, testimonials] = await Promise.all([
    getTestimonialsPageContent(),
    getAllTestimonials(),
  ]);

  const count = testimonials.length;
  const average =
    count > 0 ? testimonials.reduce((sum, t) => sum + t.stars, 0) / count : 0;

  return (
    <div className={styles.page}>
      <div className={styles.crumb}>
        <Link href={HOME_HREF}>Home</Link> / Testimonials
      </div>

      <div className={styles.intro}>
        <h1 className={styles.title}>{content.heading}</h1>
        {content.introParagraphs.map((para, i) => (
          <p key={i} className={styles.lead}>
            {para}
          </p>
        ))}
        {count > 0 && (
          <div className={styles.summary}>
            <span className={styles.summaryStars}>{"★".repeat(Math.round(average))}</span>
            <span className={styles.summaryText}>
              {average.toFixed(1)} average from {count} review{count === 1 ? "" : "s"}
            </span>
          </div>
        )}
      </div>

      {count === 0 ? (
        <p className={styles.lead}>No testimonials yet.</p>
      ) : (
        <div className={styles.grid}>
          {testimonials.map((t) => (
            <TestimonialCard
              key={t.id}
              testimonial={{
                id: t.id,
                quote: t.quote,
                stars: t.stars,
                authorName: t.authorName,
                source: t.source,
                sourceUrl: t.sourceUrl,
                project: t.project,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

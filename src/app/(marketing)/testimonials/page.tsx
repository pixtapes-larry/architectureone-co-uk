import type { Metadata } from "next";
import Link from "next/link";
import { getAllTestimonials } from "@/lib/testimonials";
import { getTestimonialsPageContent } from "@/lib/testimonials-page-content";
import { pageMetadata } from "@/lib/seo";
import { HOME_HREF } from "@/lib/nav";
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
      </div>

      {testimonials.length === 0 ? (
        <p className={styles.lead}>No testimonials yet.</p>
      ) : (
        <div className={styles.list}>
          {testimonials.map((t) => (
            <div key={t.id} id={`testimonial-${t.id}`} className={styles.card}>
              <div className={styles.stars}>{"★".repeat(t.stars)}</div>
              <p className={styles.quote}>&quot;{t.quote}&quot;</p>
              <div className={styles.meta}>
                {t.authorName && <span className={styles.author}>{t.authorName}</span>}
                {t.source && (
                  <span className={styles.source}>
                    {t.sourceUrl ? (
                      <a href={t.sourceUrl} target="_blank" rel="noreferrer" className={styles.sourceLink}>
                        via {t.source}
                      </a>
                    ) : (
                      `via ${t.source}`
                    )}
                  </span>
                )}
                {t.project && (
                  <span className={styles.project}>
                    {t.project.slug ? (
                      <Link href={`/work/${t.project.slug}`} className={styles.sourceLink}>
                        {t.project.address}, {t.project.place}
                      </Link>
                    ) : (
                      `${t.project.address}, ${t.project.place}`
                    )}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

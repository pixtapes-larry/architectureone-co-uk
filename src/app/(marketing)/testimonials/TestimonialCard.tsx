"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";

export type TestimonialCardData = {
  id: number;
  quote: string;
  stars: number;
  authorName: string | null;
  source: string | null;
  sourceUrl: string | null;
  project: { address: string; place: string; slug: string | null } | null;
};

function sourceLinkLabel(source: string) {
  const s = source.trim().toLowerCase();
  if (s === "google") return "See on Google";
  if (s === "facebook") return "See on Facebook";
  return `via ${source}`;
}

export default function TestimonialCard({ testimonial: t }: { testimonial: TestimonialCardData }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div id={`testimonial-${t.id}`} className={styles.card}>
      <div className={styles.stars}>{"★".repeat(t.stars)}</div>
      <p className={expanded ? styles.quote : `${styles.quote} ${styles.quoteClamp}`}>
        &quot;{t.quote}&quot;
      </p>
      <button
        type="button"
        className={styles.readMoreBtn}
        onClick={() => setExpanded((prev) => !prev)}
      >
        {expanded ? "Show less" : "Read more"}
      </button>

      <div className={styles.meta}>
        {t.authorName && <span className={styles.author}>{t.authorName}</span>}
        {t.source &&
          (t.sourceUrl ? (
            <a href={t.sourceUrl} target="_blank" rel="noreferrer" className={styles.sourceLink}>
              {sourceLinkLabel(t.source)}
            </a>
          ) : (
            <span>{sourceLinkLabel(t.source)}</span>
          ))}
        {t.project?.slug && (
          <Link href={`/work/${t.project.slug}`} className={styles.sourceLink}>
            See the project
          </Link>
        )}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import type { DragEvent } from "react";
import Link from "next/link";
import {
  toggleTestimonialFeaturedFormAction,
  reorderTestimonialsAction,
} from "@/app/admin/(protected)/testimonials/actions";
import DeleteTestimonialButton from "@/app/admin/(protected)/testimonials/DeleteTestimonialButton";
import tableStyles from "@/app/admin/(protected)/projects/projects.module.css";
import styles from "./TestimonialsTable.module.css";

export type TestimonialRow = {
  id: number;
  quote: string;
  authorName: string | null;
  stars: number;
  featured: boolean;
  source: string | null;
  sourceUrl: string | null;
  project: { id: number; address: string; place: string } | null;
};

// Google's badge uses its four brand colors as a conic-gradient ring behind
// the letter, rather than one flat color, so it reads as "Google" at a
// glance and stays visually distinct from Facebook's single-color badge.
const GOOGLE_GRADIENT =
  "conic-gradient(#4285F4 0deg 90deg, #34A853 90deg 180deg, #FBBC05 180deg 270deg, #EA4335 270deg 360deg)";
const SOURCE_BACKGROUNDS: Record<string, string> = {
  google: GOOGLE_GRADIENT,
  facebook: "#1877F2",
};

function SourceBadge({ source, sourceUrl }: { source: string | null; sourceUrl: string | null }) {
  if (!source) return <span style={{ color: "var(--color-muted)" }}>—</span>;

  const letter = source.trim().charAt(0).toUpperCase();
  const background = SOURCE_BACKGROUNDS[source.trim().toLowerCase()] ?? "var(--color-muted-dark)";
  const badge = (
    <span className={styles.sourceBadge} style={{ background }} title={source}>
      {letter}
    </span>
  );

  return sourceUrl ? (
    <a href={sourceUrl} target="_blank" rel="noreferrer">
      {badge}
    </a>
  ) : (
    badge
  );
}

export default function TestimonialsTable({ testimonials }: { testimonials: TestimonialRow[] }) {
  const [items, setItems] = useState(testimonials);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const dragAllowed = useRef(false);

  useEffect(() => {
    setItems(testimonials);
  }, [testimonials]);

  function handleDragStart(e: DragEvent<HTMLTableRowElement>, index: number) {
    if (!dragAllowed.current) {
      e.preventDefault();
      return;
    }
    setDragIndex(index);
    e.dataTransfer.effectAllowed = "move";
  }

  function handleDragOver(e: DragEvent<HTMLTableRowElement>, index: number) {
    e.preventDefault();
    setOverIndex(index);
    if (dragIndex === null || dragIndex === index) return;
    setItems((prev) => {
      const next = [...prev];
      const [moved] = next.splice(dragIndex, 1);
      next.splice(index, 0, moved);
      return next;
    });
    setDragIndex(index);
  }

  function handleDragEnd() {
    setDragIndex(null);
    setOverIndex(null);
    dragAllowed.current = false;
    void reorderTestimonialsAction(items.map((t) => t.id));
  }

  if (items.length === 0) {
    return <div className={tableStyles.empty}>No testimonials yet.</div>;
  }

  return (
    <table className={tableStyles.table}>
      <thead>
        <tr>
          <th></th>
          <th>Quote</th>
          <th>Author</th>
          <th>Stars</th>
          <th>Source</th>
          <th>Project</th>
          <th>Featured</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {items.map((t, index) => (
          <tr
            key={t.id}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={(e) => e.preventDefault()}
            onDragEnd={handleDragEnd}
            className={[
              dragIndex === index ? styles.draggingRow : "",
              overIndex === index && dragIndex !== index ? styles.dragOverRow : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <td className={styles.handleCell}>
              <span
                className={styles.dragHandle}
                onMouseDown={() => (dragAllowed.current = true)}
                onMouseUp={() => (dragAllowed.current = false)}
                aria-label="Drag to reorder"
                title="Drag to reorder"
              >
                ⠿
              </span>
            </td>
            <td>{t.quote.length > 70 ? `${t.quote.slice(0, 70)}…` : t.quote}</td>
            <td>{t.authorName ?? <span style={{ color: "var(--color-muted)" }}>Anonymous</span>}</td>
            <td>{"★".repeat(t.stars)}</td>
            <td>
              <SourceBadge source={t.source} sourceUrl={t.sourceUrl} />
            </td>
            <td>
              {t.project ? (
                <Link href={`/admin/projects/${t.project.id}/edit`} className={tableStyles.editLink}>
                  {t.project.address}
                </Link>
              ) : (
                <span style={{ color: "var(--color-muted)" }}>—</span>
              )}
            </td>
            <td>
              <form action={toggleTestimonialFeaturedFormAction}>
                <input type="hidden" name="id" value={t.id} />
                <button
                  type="submit"
                  className={[styles.starBtn, t.featured ? styles.featured : ""].join(" ")}
                  aria-label={t.featured ? "Featured — click to unfeature" : "Click to feature"}
                  title={t.featured ? "Featured — click to unfeature" : "Click to feature"}
                >
                  {t.featured ? "★" : "☆"}
                </button>
              </form>
            </td>
            <td>
              <div className={tableStyles.rowActions}>
                <Link href={`/admin/testimonials/${t.id}/edit`} className={tableStyles.editLink}>
                  Edit
                </Link>
                <DeleteTestimonialButton id={t.id} />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

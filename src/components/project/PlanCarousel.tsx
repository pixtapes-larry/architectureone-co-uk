"use client";

import { useState } from "react";
import { useLightbox } from "./Lightbox";
import styles from "./PlanCarousel.module.css";

export default function PlanCarousel({
  heading,
  before,
  after,
}: {
  heading: string;
  before?: string;
  after?: string;
}) {
  const { open } = useLightbox();
  // Defaults to showing "After" — falls back to whichever one exists.
  const [showingBefore, setShowingBefore] = useState(false);

  if (!before && !after) return null;

  const hasBoth = !!before && !!after;
  const showBefore = showingBefore || !after;
  const current = showBefore ? before! : after!;
  const label = showBefore ? "Before" : "After";

  const images = [
    ...(before ? [{ url: before, caption: `${heading} — Before` }] : []),
    ...(after ? [{ url: after, caption: `${heading} — After` }] : []),
  ];
  const currentIndex = showBefore ? 0 : images.length - 1;

  return (
    <div className={styles.wrap}>
      <button
        className={styles.imageButton}
        onClick={() => open(images, currentIndex)}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className={styles.image} src={current} alt={`${heading} — ${label}`} />
      </button>
      <span className={styles.pill}>{label}</span>
      {hasBoth && (
        <>
          <button
            className={`${styles.nav} ${styles.navPrev}`}
            onClick={(e) => {
              e.stopPropagation();
              setShowingBefore((b) => !b);
            }}
            aria-label={showBefore ? "Show after" : "Show before"}
          >
            ←
          </button>
          <button
            className={`${styles.nav} ${styles.navNext}`}
            onClick={(e) => {
              e.stopPropagation();
              setShowingBefore((b) => !b);
            }}
            aria-label={showBefore ? "Show after" : "Show before"}
          >
            →
          </button>
        </>
      )}
    </div>
  );
}

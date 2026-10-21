"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import styles from "./Lightbox.module.css";

type LightboxImage = { url: string; caption?: string };

type LightboxContextValue = {
  open: (images: LightboxImage[], index: number) => void;
};

const LightboxContext = createContext<LightboxContextValue | null>(null);

export function useLightbox() {
  const ctx = useContext(LightboxContext);
  if (!ctx) {
    throw new Error("useLightbox must be used inside a LightboxProvider");
  }
  return ctx;
}

export function LightboxProvider({ children }: { children: React.ReactNode }) {
  const [images, setImages] = useState<LightboxImage[] | null>(null);
  const [index, setIndex] = useState(0);

  const open = useCallback((imgs: LightboxImage[], i: number) => {
    setImages(imgs);
    setIndex(i);
  }, []);
  const close = useCallback(() => setImages(null), []);
  const prev = useCallback(
    () => setIndex((i) => (images ? (i - 1 + images.length) % images.length : i)),
    [images],
  );
  const next = useCallback(
    () => setIndex((i) => (images ? (i + 1) % images.length : i)),
    [images],
  );

  useEffect(() => {
    if (!images) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [images, close, prev, next]);

  const value = useMemo(() => ({ open }), [open]);
  const current = images?.[index];

  return (
    <LightboxContext.Provider value={value}>
      {children}
      {current && (
        <div className={styles.scrim} onClick={close}>
          <button
            className={styles.close}
            onClick={close}
            aria-label="Close"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M1.5 1.5l11 11M12.5 1.5l-11 11"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </button>
          {images && images.length > 1 && (
            <button
              className={`${styles.nav} ${styles.navPrev}`}
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              aria-label="Previous image"
            >
              <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                <path
                  d="M10 3L5 8l5 5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}
          <div className={styles.imageWrap} onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className={styles.image}
              src={current.url}
              alt={current.caption ?? ""}
            />
            {current.caption && (
              <div className={styles.caption}>{current.caption}</div>
            )}
          </div>
          {images && images.length > 1 && (
            <button
              className={`${styles.nav} ${styles.navNext}`}
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              aria-label="Next image"
            >
              <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                <path
                  d="M6 3l5 5-5 5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}
        </div>
      )}
    </LightboxContext.Provider>
  );
}

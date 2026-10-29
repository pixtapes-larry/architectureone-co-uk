"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DeleteAssetButton from "./DeleteAssetButton";
import tableStyles from "../projects/projects.module.css";
import styles from "./browser.module.css";

export type AssetRow = {
  key: string;
  filename: string;
  url: string;
  isImage: boolean;
  typeLabel: string;
  category: string | null;
  dimensions: string | null;
  sizeLabel: string;
  dateLabel: string;
  sourceLabel: string;
  label: string | null;
  useLabel: string;
  assetId: number | null;
  editHref: string | null;
};

type View = "tiles" | "rows";

function loadView(): View {
  try {
    const saved = window.localStorage.getItem("admin-assets-view");
    return saved === "rows" ? "rows" : "tiles";
  } catch {
    return "tiles";
  }
}

export default function AssetBrowser({ rows }: { rows: AssetRow[] }) {
  const [view, setView] = useState<View>("tiles");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    setView(loadView());
  }, []);

  function setAndSaveView(next: View) {
    setView(next);
    try {
      window.localStorage.setItem("admin-assets-view", next);
    } catch {
      // private browsing / blocked storage — just don't persist
    }
  }

  const imageRows = rows.filter((r) => r.isImage);

  function openLightboxFor(row: AssetRow) {
    const i = imageRows.findIndex((r) => r.key === row.key);
    if (i >= 0) setLightboxIndex(i);
  }

  useEffect(() => {
    if (lightboxIndex === null) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowLeft") setLightboxIndex((i) => (i === null ? i : (i - 1 + imageRows.length) % imageRows.length));
      if (e.key === "ArrowRight") setLightboxIndex((i) => (i === null ? i : (i + 1) % imageRows.length));
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightboxIndex, imageRows.length]);

  const current = lightboxIndex !== null ? imageRows[lightboxIndex] : null;

  return (
    <>
      <div className={styles.toolbar}>
        <div className={styles.viewToggle}>
          <button
            type="button"
            className={view === "tiles" ? styles.viewBtnActive : styles.viewBtn}
            onClick={() => setAndSaveView("tiles")}
          >
            Tiles
          </button>
          <button
            type="button"
            className={view === "rows" ? styles.viewBtnActive : styles.viewBtn}
            onClick={() => setAndSaveView("rows")}
          >
            Rows
          </button>
        </div>
      </div>

      {view === "tiles" ? (
        <div className={styles.tileGrid}>
          {rows.map((a) => (
            <div key={a.key} className={styles.tile}>
              <button
                type="button"
                className={styles.tileThumbBtn}
                onClick={() => (a.isImage ? openLightboxFor(a) : undefined)}
                disabled={!a.isImage}
              >
                {a.isImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={a.url} alt="" className={styles.tileThumb} />
                ) : (
                  <span className={styles.tileThumbPlaceholder}>{a.typeLabel}</span>
                )}
              </button>
              <div className={styles.tileBody}>
                <a href={a.url} target="_blank" rel="noreferrer" className={styles.tileFilename} title={a.filename}>
                  {a.filename}
                </a>
                {a.label && <span className={styles.tileLabel}>{a.label}</span>}
                <span className={styles.tileMeta}>
                  {a.sourceLabel} · {a.dimensions ?? a.typeLabel} · {a.sizeLabel}
                </span>
                <span className={styles.tileMeta}>
                  {a.dateLabel} · {a.useLabel}
                </span>
              </div>
              <div className={styles.tileActions}>
                {a.assetId !== null ? (
                  <DeleteAssetButton id={a.assetId} />
                ) : a.editHref ? (
                  <Link href={a.editHref} className={tableStyles.editLink}>
                    Edit →
                  </Link>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <table className={tableStyles.table}>
          <thead>
            <tr>
              <th></th>
              <th>Filename</th>
              <th>Source</th>
              <th>Type</th>
              <th>Category</th>
              <th>Dimensions</th>
              <th>Size</th>
              <th>Added</th>
              <th>Used</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((a) => (
              <tr key={a.key}>
                <td>
                  {a.isImage ? (
                    <button type="button" className={styles.rowThumbBtn} onClick={() => openLightboxFor(a)}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={a.url} alt="" className={tableStyles.thumb} />
                    </button>
                  ) : (
                    <span style={{ color: "var(--color-muted)", fontSize: 11, fontWeight: 700 }}>{a.typeLabel}</span>
                  )}
                </td>
                <td>
                  <a href={a.url} target="_blank" rel="noreferrer" className={tableStyles.editLink}>
                    {a.filename}
                  </a>
                  {a.label && (
                    <span style={{ color: "var(--color-muted)", fontSize: 11, display: "block" }}>{a.label}</span>
                  )}
                </td>
                <td>{a.sourceLabel}</td>
                <td>{a.typeLabel}</td>
                <td>{a.category ?? <span style={{ color: "var(--color-muted)" }}>—</span>}</td>
                <td>{a.dimensions ?? <span style={{ color: "var(--color-muted)" }}>—</span>}</td>
                <td>{a.sizeLabel}</td>
                <td>{a.dateLabel}</td>
                <td>{a.useLabel === "Unused" ? <span style={{ color: "var(--color-muted)" }}>Unused</span> : a.useLabel}</td>
                <td>
                  {a.assetId !== null ? (
                    <DeleteAssetButton id={a.assetId} />
                  ) : a.editHref ? (
                    <Link href={a.editHref} className={tableStyles.editLink}>
                      Edit →
                    </Link>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {current && (
        <div className={styles.lightboxScrim} onClick={() => setLightboxIndex(null)}>
          <button className={styles.lightboxClose} onClick={() => setLightboxIndex(null)} aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
              <path d="M1.5 1.5l11 11M12.5 1.5l-11 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
          {imageRows.length > 1 && (
            <button
              className={`${styles.lightboxNav} ${styles.lightboxNavPrev}`}
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((i) => (i === null ? i : (i - 1 + imageRows.length) % imageRows.length));
              }}
              aria-label="Previous image"
            >
              <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
                <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}
          <div className={styles.lightboxImageWrap} onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={current.url} alt="" className={styles.lightboxImage} />
            <div className={styles.lightboxCaption}>
              {current.filename}
              {current.dimensions ? ` — ${current.dimensions}` : ""} · {current.sizeLabel}
              {current.label ? ` — ${current.label}` : ""}
            </div>
          </div>
          {imageRows.length > 1 && (
            <button
              className={`${styles.lightboxNav} ${styles.lightboxNavNext}`}
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((i) => (i === null ? i : (i + 1) % imageRows.length));
              }}
              aria-label="Next image"
            >
              <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
                <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}
        </div>
      )}
    </>
  );
}

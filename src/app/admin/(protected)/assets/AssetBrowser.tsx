"use client";

import { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import DeleteAssetButton from "./DeleteAssetButton";
import { deleteOwnedImageAction } from "./actions";
import tableStyles from "../projects/projects.module.css";
import styles from "./browser.module.css";

export type DerivativeRow = {
  key: string;
  url: string;
  role: string;
  roleLabel: string;
  ownerLabel: string;
  editHref: string;
  ownerKind: "project" | "award";
  ownerId: number;
  dimensions: string | null;
  sizeLabel: string;
};

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
  label: string | null;
  // Set only for a retained original (a real Asset table row) — its "Delete"
  // removes the original itself, separate from any of its derivatives
  // below. A legacy owned file (no original) has nothing to delete at this
  // level; its one usage, with its own delete, lives in `derivatives`.
  assetId: number | null;
  derivatives: DerivativeRow[];
};

// "Edit →" was misleading here — clicking it doesn't edit the image, it
// navigates away to the project/award record that owns it, where the image
// is just one of many fields. Name the link after what it actually does.
function openOwnerLabel(kind: "project" | "award") {
  return kind === "award" ? "Open award →" : "Open project →";
}

// Cover photos can't be cleared here — Project.coverPhotoUrl is required,
// so there's nothing a delete could leave it as other than broken. Every
// other owned-image role (gallery, floorplan, elevation, badge) is a
// genuinely optional field and can be removed directly.
function isDeletable(role: string | null) {
  return role !== null && role !== "cover";
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      className={styles.chevron}
      style={{ transform: open ? "rotate(90deg)" : "rotate(0deg)" }}
    >
      <path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Every row — a retained original with 0, 1 or many derivatives, or a
// legacy owned file that's always exactly one usage — expands the same
// way, so there's one consistent place to find "where is this used".
function ExpandToggle({ open, count, onClick }: { open: boolean; count: number; onClick: () => void }) {
  return (
    <button type="button" className={open ? styles.expandToggleOpen : styles.expandToggle} onClick={onClick}>
      <Chevron open={open} />
      {count} place{count === 1 ? "" : "s"}
    </button>
  );
}

function DeleteOwnedButton({
  ownerKind,
  ownerId,
  role,
  url,
}: {
  ownerKind: "project" | "award";
  ownerId: number;
  role: string;
  url: string;
}) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [pending, setPending] = useState(false);

  if (!confirming) {
    return (
      <button type="button" className={tableStyles.deleteBtn} onClick={() => setConfirming(true)}>
        Delete
      </button>
    );
  }

  return (
    <div className={tableStyles.rowActions}>
      <span style={{ fontSize: 12, color: "var(--color-muted)" }}>Delete this image?</span>
      <button
        type="button"
        className={tableStyles.deleteBtn}
        disabled={pending}
        onClick={async () => {
          setPending(true);
          await deleteOwnedImageAction(ownerKind, ownerId, role, url);
          router.refresh();
        }}
      >
        {pending ? "Deleting…" : "Confirm"}
      </button>
      <button type="button" className={tableStyles.deleteBtn} onClick={() => setConfirming(false)}>
        Cancel
      </button>
    </div>
  );
}

type View = "tiles" | "rows";

function loadView(): View {
  try {
    const saved = window.localStorage.getItem("admin-assets-view");
    return saved === "tiles" ? "tiles" : "rows";
  } catch {
    return "rows";
  }
}

export default function AssetBrowser({ rows }: { rows: AssetRow[] }) {
  const [view, setView] = useState<View>("rows");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  // Only one row expanded at a time — picking a different one closes
  // whichever was open, shared between both views.
  const [expandedKey, setExpandedKey] = useState<string | null>(null);

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

  function toggleExpanded(key: string) {
    setExpandedKey((prev) => (prev === key ? null : key));
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
          {rows.map((a) => {
            const isOpen = expandedKey === a.key;
            return (
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
                  {a.category && <span className={styles.tileLabel}>{a.category}</span>}
                  <span className={styles.tileMeta}>
                    {[a.dimensions ?? a.typeLabel, a.sizeLabel].filter(Boolean).join(" · ")}
                  </span>
                  <span className={styles.tileMeta}>{a.dateLabel}</span>
                </div>
                <ExpandToggle open={isOpen} count={a.derivatives.length} onClick={() => toggleExpanded(a.key)} />
                {isOpen && a.derivatives.length === 0 && (
                  <p className={styles.tileEmptyState}>Not used anywhere yet.</p>
                )}
                {isOpen && a.derivatives.length > 0 && (
                  <ul className={styles.tileDerivativeList}>
                    {a.derivatives.map((d) => (
                      <li key={d.key} className={styles.tileDerivativeItem}>
                        <span className={styles.tileDerivativeRole}>{d.roleLabel}</span>
                        <Link href={d.editHref} className={styles.tileDerivativeOwner}>
                          {d.ownerLabel}
                        </Link>
                        <span className={styles.tileDerivativeMeta}>
                          {[d.dimensions, d.sizeLabel].filter(Boolean).join(" · ")}
                        </span>
                        {isDeletable(d.role) && (
                          <div className={styles.tileActionsRow}>
                            <DeleteOwnedButton ownerKind={d.ownerKind} ownerId={d.ownerId} role={d.role} url={d.url} />
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
                {a.assetId !== null && (
                  <div className={styles.tileActions}>
                    <DeleteAssetButton id={a.assetId} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <table className={`${tableStyles.table} ${styles.rowsTable}`}>
          <thead>
            <tr>
              <th></th>
              <th>Filename</th>
              <th className={styles.numCol}>Dimensions</th>
              <th className={styles.numCol}>Size</th>
              <th>Added</th>
              <th>Used in</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((a) => {
              const isOpen = expandedKey === a.key;
              return (
                <Fragment key={a.key}>
                  <tr className={isOpen ? styles.rowOpen : styles.row}>
                    <td>
                      {a.isImage ? (
                        <button type="button" className={styles.rowThumbBtn} onClick={() => openLightboxFor(a)}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={a.url} alt="" className={styles.rowThumb} />
                        </button>
                      ) : (
                        <span className={styles.rowThumbPlaceholder}>{a.typeLabel}</span>
                      )}
                    </td>
                    <td>
                      <a href={a.url} target="_blank" rel="noreferrer" className={styles.rowFilename}>
                        {a.filename}
                      </a>
                      {a.label && <span className={styles.rowSubline}>{a.label}</span>}
                      {a.category && <span className={styles.rowSubline}>{a.category}</span>}
                    </td>
                    <td className={styles.numCol}>{a.dimensions ?? <span style={{ color: "var(--color-muted)" }}>—</span>}</td>
                    <td className={styles.numCol}>{a.sizeLabel}</td>
                    <td>{a.dateLabel}</td>
                    <td>
                      <ExpandToggle open={isOpen} count={a.derivatives.length} onClick={() => toggleExpanded(a.key)} />
                    </td>
                    <td>{a.assetId !== null && <DeleteAssetButton id={a.assetId} />}</td>
                  </tr>
                  {isOpen && a.derivatives.length === 0 && (
                    <tr className={styles.derivativeRow}>
                      <td></td>
                      <td colSpan={5} style={{ color: "var(--color-muted)", fontSize: 13 }}>
                        Not used anywhere yet.
                      </td>
                      <td></td>
                    </tr>
                  )}
                  {isOpen &&
                    a.derivatives.map((d) => (
                      <tr key={d.key} className={styles.derivativeRow}>
                        <td></td>
                        <td colSpan={5}>
                          <span className={styles.rowDerivativeRole}>{d.roleLabel}</span>
                          <Link href={d.editHref} className={styles.rowDerivativeOwner}>
                            {d.ownerLabel}
                          </Link>
                          <span className={styles.rowDerivativeMeta}>
                            {[d.dimensions, d.sizeLabel].filter(Boolean).join(" · ")}
                          </span>
                        </td>
                        <td>
                          <div className={styles.rowActionsStack}>
                            <Link href={d.editHref} className={tableStyles.editLink}>
                              {openOwnerLabel(d.ownerKind)}
                            </Link>
                            {isDeletable(d.role) && (
                              <DeleteOwnedButton ownerKind={d.ownerKind} ownerId={d.ownerId} role={d.role} url={d.url} />
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                </Fragment>
              );
            })}
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

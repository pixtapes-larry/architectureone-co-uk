"use client";

import { useEffect, useState } from "react";
import { listOriginalImagesAction, type OriginalImage } from "@/lib/admin/original-images";
import styles from "./ImageUploadField.module.css";

export default function OriginalLibraryPicker({
  open,
  onClose,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (image: OriginalImage) => void;
}) {
  const [images, setImages] = useState<OriginalImage[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    listOriginalImagesAction(search)
      .then(setImages)
      .finally(() => setLoading(false));
  }, [open, search]);

  if (!open) return null;

  return (
    <div className={styles.cropOverlay} onClick={onClose}>
      <div className={styles.libraryPanel} onClick={(e) => e.stopPropagation()}>
        <div className={styles.libraryHeader}>
          <input
            type="text"
            placeholder="Search the library…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.librarySearch}
            autoFocus
          />
          <button type="button" className={styles.cropCancel} onClick={onClose}>
            Close
          </button>
        </div>
        <p className={styles.dropzoneText} style={{ padding: "0 2px" }}>
          Pick an image to crop for this spot. Only images with a retained
          original can be re-cropped — floorplans, elevations and badges
          aren&apos;t listed here.
        </p>
        {loading ? (
          <p className={styles.dropzoneText}>Loading…</p>
        ) : images.length === 0 ? (
          <p className={styles.dropzoneText}>No matching images in the library.</p>
        ) : (
          <div className={styles.libraryGrid}>
            {images.map((img) => (
              <button
                key={img.id}
                type="button"
                className={styles.libraryItem}
                onClick={() => {
                  onSelect(img);
                  onClose();
                }}
                title={img.label}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.url} alt="" className={styles.libraryThumb} />
                <span className={styles.libraryItemLabel}>{img.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

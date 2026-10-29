"use client";

import { useRef, useState } from "react";
import AssetLibraryPicker from "./AssetLibraryPicker";
import type { LibraryImage } from "@/lib/admin/library-images";
import formStyles from "@/components/forms/forms.module.css";
import styles from "./ImageUploadField.module.css";

type Entry =
  | { id: string; kind: "file"; file: File; previewUrl: string }
  | { id: string; kind: "library"; url: string; label: string };

export default function MultiImageUploadField({ name, label }: { name: string; label: string }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);

  function syncFileInput(next: Entry[]) {
    const dt = new DataTransfer();
    for (const entry of next) {
      if (entry.kind === "file") dt.items.add(entry.file);
    }
    if (fileInputRef.current) fileInputRef.current.files = dt.files;
  }

  function addFiles(files: FileList) {
    const added: Entry[] = Array.from(files).map((file) => ({
      id: `${file.name}-${file.size}-${Math.random()}`,
      kind: "file",
      file,
      previewUrl: URL.createObjectURL(file),
    }));
    setEntries((prev) => {
      const next = [...prev, ...added];
      syncFileInput(next);
      return next;
    });
  }

  function addLibraryImage(image: LibraryImage) {
    setEntries((prev) => {
      const next: Entry[] = [
        ...prev,
        { id: `lib-${image.url}`, kind: "library", url: image.url, label: image.label },
      ];
      syncFileInput(next);
      return next;
    });
  }

  function removeEntry(id: string) {
    setEntries((prev) => {
      const next = prev.filter((e) => e.id !== id);
      syncFileInput(next);
      return next;
    });
  }

  return (
    <div className={formStyles.field}>
      <label className={formStyles.label}>{label}</label>
      <input
        ref={fileInputRef}
        type="file"
        name={name}
        accept="image/*"
        multiple
        className={styles.hiddenInput}
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) addFiles(e.target.files);
        }}
      />
      {entries
        .filter((e): e is Extract<Entry, { kind: "library" }> => e.kind === "library")
        .map((e) => (
          <input key={e.id} type="hidden" name={`${name}LibraryUrls`} value={e.url} />
        ))}
      <div
        className={[styles.dropzone, isDragging ? styles.dropzoneActive : ""].join(" ")}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (e.dataTransfer.files.length > 0) addFiles(e.dataTransfer.files);
        }}
      >
        {entries.length > 0 ? (
          <div className={styles.multiPreviewGrid}>
            {entries.map((entry) => (
              <div key={entry.id} className={styles.multiPreviewItem}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={entry.kind === "file" ? entry.previewUrl : entry.url}
                  alt=""
                  className={styles.multiPreviewThumb}
                />
                <button
                  type="button"
                  className={styles.multiPreviewRemove}
                  onClick={(e) => {
                    e.stopPropagation();
                    removeEntry(entry.id);
                  }}
                  title="Remove"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        ) : (
          <span className={styles.dropzoneText}>Drag images here, or click to browse — multiple OK</span>
        )}
      </div>
      <div className={styles.fieldActions}>
        {entries.length > 0 && (
          <button type="button" className={styles.replaceLabel} onClick={() => fileInputRef.current?.click()}>
            Add more images
          </button>
        )}
        <button type="button" className={styles.replaceLabel} onClick={() => setPickerOpen(true)}>
          Choose from library
        </button>
      </div>

      <AssetLibraryPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={addLibraryImage}
      />
    </div>
  );
}

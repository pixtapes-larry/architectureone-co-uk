"use client";

import { useRef, useState } from "react";
import formStyles from "@/components/forms/forms.module.css";
import styles from "./ImageUploadField.module.css";

export default function MultiImageUploadField({ name, label }: { name: string; label: string }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]);

  function setFiles(files: FileList) {
    if (fileInputRef.current) fileInputRef.current.files = files;
    setPreviews(Array.from(files).map((f) => URL.createObjectURL(f)));
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
          if (e.target.files && e.target.files.length > 0) setFiles(e.target.files);
        }}
      />
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
          if (e.dataTransfer.files.length > 0) setFiles(e.dataTransfer.files);
        }}
      >
        {previews.length > 0 ? (
          <div className={styles.multiPreviewGrid}>
            {previews.map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={i} src={src} alt="" className={styles.multiPreviewThumb} />
            ))}
          </div>
        ) : (
          <span className={styles.dropzoneText}>Drag images here, or click to browse — multiple OK</span>
        )}
      </div>
      {previews.length > 0 && (
        <button
          type="button"
          className={styles.replaceLabel}
          onClick={() => fileInputRef.current?.click()}
        >
          Choose different images
        </button>
      )}
    </div>
  );
}

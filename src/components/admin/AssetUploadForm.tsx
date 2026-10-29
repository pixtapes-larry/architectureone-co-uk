"use client";

import { useActionState, useRef, useState } from "react";
import { uploadAssetsAction, type AssetUploadState } from "@/app/admin/(protected)/assets/actions";
import formStyles from "@/components/forms/forms.module.css";
import styles from "./ImageUploadField.module.css";

const initialState: AssetUploadState = {};

export default function AssetUploadForm({ existingCategories }: { existingCategories: string[] }) {
  const [state, formAction, pending] = useActionState(uploadAssetsAction, initialState);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileNames, setFileNames] = useState<string[]>([]);

  function setFiles(files: FileList) {
    if (fileInputRef.current) fileInputRef.current.files = files;
    setFileNames(Array.from(files).map((f) => f.name));
  }

  return (
    <form action={formAction} className={formStyles.form}>
      <div className={formStyles.field}>
        <label className={formStyles.label}>Files</label>
        <input
          ref={fileInputRef}
          type="file"
          name="files"
          multiple
          accept="image/*,application/pdf,video/*"
          className={styles.hiddenInput}
          onChange={(e) => {
            if (e.target.files) setFiles(e.target.files);
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
          {fileNames.length > 0 ? (
            <span className={styles.dropzoneText}>{fileNames.join(", ")}</span>
          ) : (
            <span className={styles.dropzoneText}>
              Drag images, PDFs or video here, or click to browse — multiple files OK
            </span>
          )}
        </div>
      </div>

      <div className={formStyles.row}>
        <div className={formStyles.field}>
          <label className={formStyles.label} htmlFor="label">
            Label (optional)
          </label>
          <input id="label" name="label" className={formStyles.input} placeholder="e.g. 2024 brochure" />
        </div>
        <div className={formStyles.field}>
          <label className={formStyles.label} htmlFor="category">
            Category (optional — pick an existing one or type a new one)
          </label>
          <input
            id="category"
            name="category"
            list="asset-category-options"
            className={formStyles.input}
            placeholder="e.g. Brochures"
          />
          <datalist id="asset-category-options">
            {existingCategories.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </div>
      </div>
      <p className={formStyles.formNote}>Applied to every file in this batch.</p>

      {state.error && <p style={{ color: "var(--color-coral)", fontSize: 13 }}>{state.error}</p>}

      <button type="submit" disabled={pending} className={formStyles.submitBtn}>
        {pending ? "Uploading…" : "Upload"}
      </button>
    </form>
  );
}

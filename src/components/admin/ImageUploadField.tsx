"use client";

import { useRef, useState } from "react";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";
import "react-easy-crop/react-easy-crop.css";
import { cropImageToFile, type PixelCrop } from "@/lib/image-crop";
import formStyles from "@/components/forms/forms.module.css";
import styles from "./ImageUploadField.module.css";

export default function ImageUploadField({
  name,
  label,
  existingUrl,
  aspectRatio,
}: {
  name: string;
  label: string;
  existingUrl?: string | null;
  // When set, a dropped/selected image opens the crop tool locked to this
  // ratio (width / height) before it's attached to the form. Omit for
  // fields where cropping would damage the content — floorplans,
  // elevations, certificate-style badge graphics.
  aspectRatio?: number;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  function attachFile(file: File) {
    const dt = new DataTransfer();
    dt.items.add(file);
    if (fileInputRef.current) fileInputRef.current.files = dt.files;
  }

  function handleFile(file: File) {
    if (!file.type.startsWith("image/")) return;

    if (aspectRatio) {
      const reader = new FileReader();
      reader.onload = () => setCropSrc(reader.result as string);
      reader.readAsDataURL(file);
      return;
    }

    attachFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  }

  async function confirmCrop() {
    if (!cropSrc || !croppedAreaPixels) return;
    const file = await cropImageToFile(cropSrc, croppedAreaPixels as PixelCrop, `${name}.jpg`);
    attachFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setCropSrc(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  }

  const displayUrl = previewUrl ?? existingUrl ?? null;

  return (
    <div className={formStyles.field}>
      <label className={formStyles.label}>{label}</label>
      <input
        ref={fileInputRef}
        type="file"
        name={name}
        accept="image/*"
        className={styles.hiddenInput}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
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
          const file = e.dataTransfer.files?.[0];
          if (file) handleFile(file);
        }}
      >
        {displayUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={displayUrl} alt="" className={styles.preview} />
        ) : (
          <span className={styles.dropzoneText}>Drag an image here, or click to browse</span>
        )}
      </div>
      {previewUrl && (
        <button
          type="button"
          className={styles.replaceLabel}
          onClick={() => fileInputRef.current?.click()}
        >
          Choose a different image
        </button>
      )}

      {cropSrc && (
        <div className={styles.cropOverlay}>
          <div className={styles.cropPanel}>
            <div className={styles.cropStage}>
              <Cropper
                image={cropSrc}
                crop={crop}
                zoom={zoom}
                aspect={aspectRatio}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={(_area, pixels) => setCroppedAreaPixels(pixels)}
              />
            </div>
            <div className={styles.cropControls}>
              <input
                type="range"
                min={1}
                max={3}
                step={0.01}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className={styles.zoomSlider}
              />
              <div className={styles.cropActions}>
                <button type="button" className={styles.cropCancel} onClick={() => setCropSrc(null)}>
                  Cancel
                </button>
                <button type="button" className={styles.cropConfirm} onClick={confirmCrop}>
                  Use this crop
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

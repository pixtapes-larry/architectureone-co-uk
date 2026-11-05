"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";
import "react-easy-crop/react-easy-crop.css";
import OriginalLibraryPicker from "./OriginalLibraryPicker";
import type { OriginalImage } from "@/lib/admin/original-images";
import { uploadOriginalAction, applyGalleryCropAction } from "@/app/admin/(protected)/projects/actions";
import { CROP_TARGETS } from "@/lib/admin/crop-targets";
import formStyles from "@/components/forms/forms.module.css";
import styles from "./ImageUploadField.module.css";

// Gallery photos display at 4:3 (object-fit: cover) on the public project
// page, same as the cover photo — crop to that ratio here so what's picked
// is what shows, instead of an arbitrary auto-crop at render time.
const GALLERY_ASPECT = 4 / 3;
const TARGET = CROP_TARGETS.gallery;

type CropTarget = { assetId: number; url: string };

export default function InstantGalleryField({
  projectId,
  isBefore,
  label,
}: {
  projectId: number;
  isBefore: boolean;
  label: string;
}) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [queue, setQueue] = useState<File[]>([]);

  const [cropTarget, setCropTarget] = useState<CropTarget | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPercent, setCroppedAreaPercent] = useState<Area | null>(null);
  const [naturalSize, setNaturalSize] = useState<{ w: number; h: number } | null>(null);

  function loadNaturalSize(url: string) {
    setNaturalSize(null);
    const img = new window.Image();
    img.onload = () => setNaturalSize({ w: img.naturalWidth, h: img.naturalHeight });
    img.src = url;
  }

  async function openCropFor(file: File) {
    setBusy(true);
    const original = await uploadOriginalAction(file);
    setBusy(false);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    loadNaturalSize(original.url);
    setCropTarget({ assetId: original.assetId, url: original.url });
  }

  function enqueue(files: FileList) {
    const arr = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (arr.length === 0) return;
    const [first, ...rest] = arr;
    setQueue(rest);
    openCropFor(first);
  }

  async function confirmCrop() {
    if (!cropTarget || !croppedAreaPercent) return;
    setBusy(true);
    await applyGalleryCropAction(projectId, isBefore, cropTarget.assetId, {
      x: croppedAreaPercent.x / 100,
      y: croppedAreaPercent.y / 100,
      width: croppedAreaPercent.width / 100,
      height: croppedAreaPercent.height / 100,
    });
    setBusy(false);
    setCropTarget(null);
    router.refresh();

    const [next, ...rest] = queue;
    setQueue(rest);
    if (next) openCropFor(next);
  }

  function cancelCrop() {
    setCropTarget(null);
    const [next, ...rest] = queue;
    setQueue(rest);
    if (next) openCropFor(next);
  }

  function handleLibrarySelect(image: OriginalImage) {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    loadNaturalSize(image.url);
    setCropTarget({ assetId: image.id, url: image.url });
  }

  return (
    <div className={formStyles.field}>
      <label className={formStyles.label}>{label}</label>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className={styles.hiddenInput}
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) enqueue(e.target.files);
          e.target.value = "";
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
          if (e.dataTransfer.files.length > 0) enqueue(e.dataTransfer.files);
        }}
      >
        <span className={styles.dropzoneText}>
          {busy ? "Working…" : "Drag images here, or click to browse — crop, then added straight away"}
        </span>
      </div>
      <div className={styles.fieldActions}>
        <button type="button" className={styles.replaceLabel} onClick={() => setPickerOpen(true)}>
          Choose from library
        </button>
      </div>

      <OriginalLibraryPicker open={pickerOpen} onClose={() => setPickerOpen(false)} onSelect={handleLibrarySelect} />

      {cropTarget && (
        <div className={styles.cropOverlay}>
          <div className={styles.cropPanel}>
            <div className={styles.cropStage}>
              <Cropper
                image={cropTarget.url}
                crop={crop}
                zoom={zoom}
                aspect={GALLERY_ASPECT}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={(area) => setCroppedAreaPercent(area)}
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
              {naturalSize && croppedAreaPercent && (() => {
                const gotW = Math.round((naturalSize.w * croppedAreaPercent.width) / 100);
                const gotH = Math.round((naturalSize.h * croppedAreaPercent.height) / 100);
                const low = gotW < TARGET.width * 0.98 || gotH < TARGET.height * 0.98;
                return (
                  <p className={low ? styles.qualityLow : styles.qualityGood}>
                    {low
                      ? `Low resolution for the gallery — this crop gives ${gotW}×${gotH}px, ideally ${TARGET.width}×${TARGET.height}px.`
                      : `Good quality — ${gotW}×${gotH}px.`}
                  </p>
                );
              })()}
              <div className={styles.cropActions}>
                <button type="button" className={styles.cropCancel} onClick={cancelCrop}>
                  Cancel
                </button>
                <button type="button" className={styles.cropConfirm} onClick={confirmCrop} disabled={busy}>
                  {busy ? "Adding…" : `Add photo${queue.length > 0 ? ` (${queue.length + 1} left)` : ""}`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

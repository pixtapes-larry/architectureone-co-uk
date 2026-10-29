"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";
import "react-easy-crop/react-easy-crop.css";
import OriginalLibraryPicker from "./OriginalLibraryPicker";
import type { OriginalImage } from "@/lib/admin/original-images";
import { uploadOriginalAction, applyCoverCropAction } from "@/app/admin/(protected)/projects/actions";
import formStyles from "@/components/forms/forms.module.css";
import styles from "./ImageUploadField.module.css";

// Matches the public card/pin aspect ratio — see InstantGalleryField for
// why gallery photos share this same ratio.
const COVER_ASPECT = 4 / 3;

export default function CoverPhotoField({
  projectId,
  existingUrl,
}: {
  projectId: number;
  existingUrl: string | null;
}) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const [cropTarget, setCropTarget] = useState<{ assetId: number; url: string } | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPercent, setCroppedAreaPercent] = useState<Area | null>(null);

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/")) return;
    setBusy(true);
    const original = await uploadOriginalAction(file);
    setBusy(false);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCropTarget({ assetId: original.assetId, url: original.url });
  }

  function handleLibrarySelect(image: OriginalImage) {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCropTarget({ assetId: image.id, url: image.url });
  }

  async function confirmCrop() {
    if (!cropTarget || !croppedAreaPercent) return;
    setBusy(true);
    await applyCoverCropAction(projectId, cropTarget.assetId, {
      x: croppedAreaPercent.x / 100,
      y: croppedAreaPercent.y / 100,
      width: croppedAreaPercent.width / 100,
      height: croppedAreaPercent.height / 100,
    });
    setBusy(false);
    setCropTarget(null);
    router.refresh();
  }

  function cancelCrop() {
    setCropTarget(null);
  }

  return (
    <div className={formStyles.field}>
      <label className={formStyles.label}>Cover photo</label>
      <p className={formStyles.formNote}>
        Changes here apply immediately — no need to save the rest of the form.
      </p>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className={styles.hiddenInput}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
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
          const file = e.dataTransfer.files?.[0];
          if (file) handleFile(file);
        }}
      >
        {existingUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={existingUrl} alt="" className={styles.preview} />
        ) : (
          <span className={styles.dropzoneText}>{busy ? "Working…" : "Drag an image here, or click to browse"}</span>
        )}
      </div>
      <div className={styles.fieldActions}>
        {existingUrl && (
          <button type="button" className={styles.replaceLabel} onClick={() => fileInputRef.current?.click()}>
            Replace cover photo
          </button>
        )}
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
                aspect={COVER_ASPECT}
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
              <div className={styles.cropActions}>
                <button type="button" className={styles.cropCancel} onClick={cancelCrop}>
                  Cancel
                </button>
                <button type="button" className={styles.cropConfirm} onClick={confirmCrop} disabled={busy}>
                  {busy ? "Saving…" : "Use this crop"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

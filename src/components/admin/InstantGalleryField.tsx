"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";
import "react-easy-crop/react-easy-crop.css";
import { cropImageToFile, type PixelCrop } from "@/lib/image-crop";
import AssetLibraryPicker from "./AssetLibraryPicker";
import type { LibraryImage } from "@/lib/admin/library-images";
import { addGalleryPhotoAction } from "@/app/admin/(protected)/projects/actions";
import formStyles from "@/components/forms/forms.module.css";
import styles from "./ImageUploadField.module.css";

// Gallery photos display at 4:3 (object-fit: cover) on the public project
// page, same as the cover photo — crop to that ratio here so what's picked
// is what shows, instead of an arbitrary auto-crop at render time.
const GALLERY_ASPECT = 4 / 3;

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

  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  function openCropFor(file: File) {
    const reader = new FileReader();
    reader.onload = () => setCropSrc(reader.result as string);
    reader.readAsDataURL(file);
  }

  function enqueue(files: FileList) {
    const arr = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (arr.length === 0) return;
    const [first, ...rest] = arr;
    setQueue(rest);
    openCropFor(first);
  }

  async function confirmCrop() {
    if (!cropSrc || !croppedAreaPixels) return;
    const file = await cropImageToFile(cropSrc, croppedAreaPixels as PixelCrop, `${projectId}-gallery.jpg`);
    setCropSrc(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setBusy(true);
    await addGalleryPhotoAction(projectId, isBefore, file, null);
    setBusy(false);
    router.refresh();

    const [next, ...rest] = queue;
    setQueue(rest);
    if (next) openCropFor(next);
  }

  function cancelCrop() {
    setCropSrc(null);
    const [next, ...rest] = queue;
    setQueue(rest);
    if (next) openCropFor(next);
  }

  async function handleLibrarySelect(image: LibraryImage) {
    setBusy(true);
    await addGalleryPhotoAction(projectId, isBefore, null, image.url);
    setBusy(false);
    router.refresh();
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
          {busy ? "Adding…" : "Drag images here, or click to browse — added straight away, no save needed"}
        </span>
      </div>
      <div className={styles.fieldActions}>
        <button type="button" className={styles.replaceLabel} onClick={() => setPickerOpen(true)}>
          Choose from library
        </button>
      </div>

      <AssetLibraryPicker open={pickerOpen} onClose={() => setPickerOpen(false)} onSelect={handleLibrarySelect} />

      {cropSrc && (
        <div className={styles.cropOverlay}>
          <div className={styles.cropPanel}>
            <div className={styles.cropStage}>
              <Cropper
                image={cropSrc}
                crop={crop}
                zoom={zoom}
                aspect={GALLERY_ASPECT}
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
                <button type="button" className={styles.cropCancel} onClick={cancelCrop}>
                  Cancel
                </button>
                <button type="button" className={styles.cropConfirm} onClick={confirmCrop}>
                  Add photo{queue.length > 0 ? ` (${queue.length + 1} left)` : ""}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

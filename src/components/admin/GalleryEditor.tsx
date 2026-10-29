"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteGalleryPhotoAction } from "@/app/admin/(protected)/projects/actions";
import InstantGalleryField from "./InstantGalleryField";
import formStyles from "@/components/forms/forms.module.css";
import styles from "./ProjectForm.module.css";

type Photo = { id: number; url: string; isBefore: boolean; caption: string | null };

export default function GalleryEditor({ projectId, photos }: { projectId: number; photos: Photo[] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  async function handleDelete(photoId: number) {
    setDeletingId(photoId);
    await deleteGalleryPhotoAction(projectId, photoId);
    setDeletingId(null);
    router.refresh();
  }

  return (
    <>
      {photos.length > 0 && (
        <div className={styles.galleryGrid}>
          {photos.map((photo) => (
            <div key={photo.id} className={styles.galleryItem}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo.url} alt={photo.caption ?? ""} />
              <button
                type="button"
                className={styles.galleryDeleteBtn}
                disabled={deletingId === photo.id}
                onClick={() => handleDelete(photo.id)}
              >
                {photo.isBefore ? "Before" : "After"} — {deletingId === photo.id ? "removing…" : "remove"}
              </button>
            </div>
          ))}
        </div>
      )}
      <div className={formStyles.row}>
        <InstantGalleryField projectId={projectId} isBefore label='Add "before" photos' />
        <InstantGalleryField projectId={projectId} isBefore={false} label='Add "after" photos' />
      </div>
    </>
  );
}

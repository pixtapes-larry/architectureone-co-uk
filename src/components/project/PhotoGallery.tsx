"use client";

import { useRef } from "react";
import { useLightbox } from "./Lightbox";
import styles from "./PhotoGallery.module.css";

export default function PhotoGallery({
  images,
}: {
  images: { url: string; caption?: string }[];
}) {
  const { open } = useLightbox();
  const stripRef = useRef<HTMLDivElement>(null);
  const dragState = useRef({ dragging: false, startX: 0, startScroll: 0, moved: 0 });

  function onPointerDown(e: React.PointerEvent) {
    const strip = stripRef.current;
    if (!strip) return;
    dragState.current = {
      dragging: true,
      startX: e.clientX,
      startScroll: strip.scrollLeft,
      moved: 0,
    };
    strip.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent) {
    const strip = stripRef.current;
    const state = dragState.current;
    if (!state.dragging || !strip) return;
    const delta = e.clientX - state.startX;
    state.moved = Math.max(state.moved, Math.abs(delta));
    strip.scrollLeft = state.startScroll - delta;
  }

  function onPointerUp() {
    dragState.current.dragging = false;
  }

  function onImageClick(e: React.MouseEvent, index: number) {
    // A drag that moved more than a few pixels shouldn't also open the
    // lightbox — only a genuine click does.
    if (dragState.current.moved > 6) {
      e.preventDefault();
      return;
    }
    open(images, index);
  }

  return (
    <div
      ref={stripRef}
      className={styles.strip}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
    >
      {images.map((img, i) => (
        <button
          key={i}
          className={styles.thumb}
          onClick={(e) => onImageClick(e, i)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className={styles.thumbImage}
            src={img.url}
            alt={img.caption ?? ""}
            draggable={false}
          />
        </button>
      ))}
    </div>
  );
}

"use client";

import { useRef } from "react";
import { useLightbox } from "./Lightbox";
import styles from "./PhotoGallery.module.css";

const DRAG_THRESHOLD = 5;

export default function PhotoGallery({
  images,
}: {
  images: { url: string; caption?: string }[];
}) {
  const { open } = useLightbox();
  const stripRef = useRef<HTMLDivElement>(null);
  // "down" tracks a press in progress; "dragging" only becomes true once
  // the pointer has actually moved past the threshold — pointer capture
  // is deferred until then too, so a plain click never has the pointer
  // captured out from under the button's native click event.
  const state = useRef({
    down: false,
    dragging: false,
    pointerId: 0,
    startX: 0,
    startScroll: 0,
    moved: 0,
  });

  function onPointerDown(e: React.PointerEvent) {
    const strip = stripRef.current;
    if (!strip) return;
    state.current = {
      down: true,
      dragging: false,
      pointerId: e.pointerId,
      startX: e.clientX,
      startScroll: strip.scrollLeft,
      moved: 0,
    };
  }

  function onPointerMove(e: React.PointerEvent) {
    const strip = stripRef.current;
    const s = state.current;
    if (!s.down || !strip) return;
    const delta = e.clientX - s.startX;
    s.moved = Math.max(s.moved, Math.abs(delta));
    if (!s.dragging && s.moved > DRAG_THRESHOLD) {
      s.dragging = true;
      strip.setPointerCapture(s.pointerId);
    }
    if (s.dragging) {
      strip.scrollLeft = s.startScroll - delta;
    }
  }

  function onPointerUp() {
    const s = state.current;
    if (s.dragging && stripRef.current) {
      stripRef.current.releasePointerCapture(s.pointerId);
    }
    s.down = false;
    s.dragging = false;
  }

  function onImageClick(e: React.MouseEvent, index: number) {
    // A drag that moved more than a few pixels shouldn't also open the
    // lightbox — only a genuine click does.
    if (state.current.moved > DRAG_THRESHOLD) {
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

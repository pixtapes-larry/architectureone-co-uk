"use client";

import { useLightbox } from "./Lightbox";
import styles from "./PlanImage.module.css";

export default function PlanImage({
  src,
  images,
  index,
}: {
  src: string;
  images: { url: string; caption?: string }[];
  index: number;
}) {
  const { open } = useLightbox();
  return (
    <button className={styles.button} onClick={() => open(images, index)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className={styles.image} src={src} alt="" />
    </button>
  );
}

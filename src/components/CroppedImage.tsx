import type { CSSProperties } from "react";
import type { CropRect } from "@/lib/mock-projects";

// Renders one retained original cropped to a rect via CSS alone — no
// derivative file is ever generated for this. background-size scales the
// image up so the chosen rect fills the box; background-position shifts it
// so the rect's corner lands at the box's corner. Every usage of a photo
// can pass its own `crop` without affecting any other usage of the same
// `src`, since nothing here touches the file itself.
//
// When `crop` is absent (mock data, or a photo uploaded before the crop
// tool existed), this just renders a plain object-fit: cover image — the
// same thing it replaces.
export default function CroppedImage({
  src,
  crop,
  alt,
  className,
  style,
  draggable,
}: {
  src: string;
  crop?: CropRect;
  alt: string;
  className?: string;
  style?: CSSProperties;
  draggable?: boolean;
}) {
  // Sizing (width/height) is left to the caller's className, exactly as a
  // plain <img> would be — only object-fit/background mechanics are set
  // here, so this drops into existing card/hero layouts unchanged.
  if (!crop || crop.width <= 0 || crop.height <= 0) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        className={className}
        draggable={draggable}
        style={{ width: "100%", display: "block", objectFit: "cover", ...style }}
      />
    );
  }

  const bgSize = `${100 / crop.width}% ${100 / crop.height}%`;
  const bgX = crop.width >= 1 ? 0 : (crop.x / (1 - crop.width)) * 100;
  const bgY = crop.height >= 1 ? 0 : (crop.y / (1 - crop.height)) * 100;

  return (
    <div
      role="img"
      aria-label={alt}
      className={className}
      style={{
        width: "100%",
        display: "block",
        backgroundImage: `url('${src}')`,
        backgroundSize: bgSize,
        backgroundPosition: `${bgX}% ${bgY}%`,
        backgroundRepeat: "no-repeat",
        ...style,
      }}
    />
  );
}

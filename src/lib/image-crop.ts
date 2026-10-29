// Client-side only — takes a source image + the crop rectangle react-easy-crop
// reports (in source-image pixels) and renders just that rectangle onto a
// canvas, producing a File ready to attach to a form's file input. Cropping
// happens here rather than on the server so the upload itself only ever
// sends the pixels that are actually kept.
export type PixelCrop = { x: number; y: number; width: number; height: number };

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener("load", () => resolve(img));
    img.addEventListener("error", reject);
    img.src = src;
  });
}

export async function cropImageToFile(
  imageSrc: string,
  crop: PixelCrop,
  filename: string,
): Promise<File> {
  const image = await loadImage(imageSrc);
  const canvas = document.createElement("canvas");
  canvas.width = crop.width;
  canvas.height = crop.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");

  ctx.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    crop.width,
    crop.height,
  );

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", 0.92),
  );
  if (!blob) throw new Error("Failed to crop image");

  return new File([blob], filename, { type: "image/jpeg" });
}

// Local-disk image storage for admin uploads — Hostinger is persistent-disk
// hosting (not ephemeral serverless), so this is safe to rely on long-term.
// Everything lives under one namespaced root so it's obviously this app's
// own uploads if the same hosting account ever serves anything else, and
// organized by project → role so a given project's files are easy to find
// by hand on disk, not just via the DB.
import { writeFile, mkdir, unlink } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { randomUUID } from "node:crypto";

const UPLOAD_ROOT = path.join(
  process.cwd(),
  "public",
  "uploads",
  "architectureone",
  "projects",
);

const AWARDS_UPLOAD_ROOT = path.join(
  process.cwd(),
  "public",
  "uploads",
  "architectureone",
  "awards",
);

const ASSETS_UPLOAD_ROOT = path.join(
  process.cwd(),
  "public",
  "uploads",
  "architectureone",
  "assets",
);

export type UploadRole =
  | "cover"
  | "gallery-before"
  | "gallery-after"
  | "floorplan-before"
  | "floorplan-after"
  | "elevation-before"
  | "elevation-after";

// Fractional crop rect (0–1), relative to the original image's own pixel
// dimensions — what the crop UI produces and what gets stored alongside
// the derivative it made, so the same original can be cropped again
// differently for a second use without touching this one.
export type CropRect = { x: number; y: number; width: number; height: number };

// Fixed output size per field type, so every cover photo (and every gallery
// photo) on the site is the same pixel dimensions, aspect and roughly the
// same file size — not just "whatever the source photo happened to be".
export const COVER_TARGET = { width: 1200, height: 900 };
export const GALLERY_TARGET = { width: 1200, height: 900 };

// Max edge length for any stored image — the site never displays project
// photos larger than this, so there's no reason to keep the original
// camera-resolution file around just to serve it smaller every request.
const MAX_DIMENSION = 2000;

function isUploadableFile(value: FormDataEntryValue | null): value is File {
  return value instanceof File && value.size > 0;
}

export { isUploadableFile };

// Saves one uploaded image under its project/role folder, resized and
// re-encoded as a web-friendly JPEG. Returns the public URL path to store
// on the Project/ProjectPhoto record.
export async function saveProjectImage(
  file: File,
  projectId: number,
  role: UploadRole,
): Promise<string> {
  const dir = path.join(UPLOAD_ROOT, String(projectId), role);
  await mkdir(dir, { recursive: true });

  const filename = `${randomUUID()}.jpg`;
  const destPath = path.join(dir, filename);

  const buffer = Buffer.from(await file.arrayBuffer());
  await sharp(buffer)
    .rotate() // apply EXIF orientation, then strip it — avoids sideways photos
    .resize({
      width: MAX_DIMENSION,
      height: MAX_DIMENSION,
      fit: "inside",
      withoutEnlargement: true,
    })
    .jpeg({ quality: 82 })
    .toFile(destPath);

  return `/uploads/architectureone/projects/${projectId}/${role}/${filename}`;
}

// Crops a region out of a retained original (an Asset's own file, stored
// uncropped) and saves it as a field's own derivative — the original on
// disk is never modified, so it can be cropped again differently for
// another field without affecting this one.
export async function saveCroppedDerivative(
  originalUrl: string,
  crop: CropRect,
  projectId: number,
  role: UploadRole,
  target: { width: number; height: number },
): Promise<{ url: string; fileSizeKb: number; width: number; height: number }> {
  const dir = path.join(UPLOAD_ROOT, String(projectId), role);
  await mkdir(dir, { recursive: true });

  const filename = `${randomUUID()}.jpg`;
  const destPath = path.join(dir, filename);
  const sourcePath = path.join(process.cwd(), "public", originalUrl);

  const meta = await sharp(sourcePath).metadata();
  const sw = meta.width ?? 0;
  const sh = meta.height ?? 0;
  const left = Math.max(0, Math.min(sw - 1, Math.round(crop.x * sw)));
  const top = Math.max(0, Math.min(sh - 1, Math.round(crop.y * sh)));
  const width = Math.max(1, Math.min(sw - left, Math.round(crop.width * sw)));
  const height = Math.max(1, Math.min(sh - top, Math.round(crop.height * sh)));

  const info = await sharp(sourcePath)
    .extract({ left, top, width, height })
    .resize({ width: target.width, height: target.height, fit: "cover" })
    .jpeg({ quality: 85 })
    .toFile(destPath);

  return {
    url: `/uploads/architectureone/projects/${projectId}/${role}/${filename}`,
    fileSizeKb: Math.round(info.size / 1024),
    width: info.width,
    height: info.height,
  };
}

// Best-effort delete — called when a photo row is removed or replaced.
// Never throws: a missing file on disk shouldn't block the DB write that
// triggered the cleanup.
export async function deleteProjectImage(publicUrl: string): Promise<void> {
  if (!publicUrl.startsWith("/uploads/architectureone/projects/")) return;
  const filePath = path.join(process.cwd(), "public", publicUrl);
  try {
    await unlink(filePath);
  } catch {
    // already gone, or never existed — fine either way
  }
}

// Award badge/logo images — same storage convention as project photos, one
// flat folder per award since there's only ever one image per award.
export async function saveAwardImage(file: File, awardId: number): Promise<string> {
  const dir = path.join(AWARDS_UPLOAD_ROOT, String(awardId));
  await mkdir(dir, { recursive: true });

  const filename = `${randomUUID()}.jpg`;
  const destPath = path.join(dir, filename);

  const buffer = Buffer.from(await file.arrayBuffer());
  await sharp(buffer)
    .rotate()
    .resize({ width: 800, height: 800, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 85 })
    .toFile(destPath);

  return `/uploads/architectureone/awards/${awardId}/${filename}`;
}

export async function deleteAwardImage(publicUrl: string): Promise<void> {
  if (!publicUrl.startsWith("/uploads/architectureone/awards/")) return;
  const filePath = path.join(process.cwd(), "public", publicUrl);
  try {
    await unlink(filePath);
  } catch {
    // already gone, or never existed — fine either way
  }
}

// General-purpose asset library (brochures, promo video, loose images not
// tied to a project/award). Images still get re-encoded through sharp for
// consistency; PDFs and video are stored byte-for-byte since they can't be
// processed the same way — sharp only understands image formats.
export async function saveAsset(
  file: File,
): Promise<{ url: string; fileSizeKb: number; width?: number; height?: number }> {
  const id = randomUUID();
  const dir = path.join(ASSETS_UPLOAD_ROOT, id);
  await mkdir(dir, { recursive: true });

  const isImage = file.type.startsWith("image/");
  const buffer = Buffer.from(await file.arrayBuffer());

  if (isImage) {
    const filename = "file.jpg";
    const destPath = path.join(dir, filename);
    const info = await sharp(buffer)
      .rotate()
      .resize({ width: MAX_DIMENSION, height: MAX_DIMENSION, fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 85 })
      .toFile(destPath);
    return {
      url: `/uploads/architectureone/assets/${id}/${filename}`,
      fileSizeKb: Math.round(info.size / 1024),
      width: info.width,
      height: info.height,
    };
  }

  // Keep the original extension for non-image files so the browser/OS
  // handles them correctly (e.g. a .pdf has to end in .pdf to preview inline).
  const ext = file.name.includes(".") ? file.name.slice(file.name.lastIndexOf(".")) : "";
  const filename = `file${ext}`;
  const destPath = path.join(dir, filename);
  await writeFile(destPath, buffer);
  return {
    url: `/uploads/architectureone/assets/${id}/${filename}`,
    fileSizeKb: Math.round(buffer.byteLength / 1024),
  };
}

export async function deleteAsset(publicUrl: string): Promise<void> {
  if (!publicUrl.startsWith("/uploads/architectureone/assets/")) return;
  const filePath = path.join(process.cwd(), "public", publicUrl);
  try {
    await unlink(filePath);
  } catch {
    // already gone, or never existed — fine either way
  }
}

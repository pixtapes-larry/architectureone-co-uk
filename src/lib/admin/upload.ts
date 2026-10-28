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

export type UploadRole =
  | "cover"
  | "gallery-before"
  | "gallery-after"
  | "floorplan-before"
  | "floorplan-after"
  | "elevation-before"
  | "elevation-after";

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

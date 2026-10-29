// Read-only disk scan of images already owned by a Project or Award (cover
// photos, gallery shots, floorplans, elevations, badges) — these aren't
// Asset rows, they're columns on their own record, but the asset manager
// still wants to show "what's actually on disk" for a full picture.
import fs from "node:fs/promises";
import path from "node:path";
import { prisma } from "../prisma";

export type ScannedAsset = {
  url: string;
  fileSizeKb: number;
  owner: { kind: "project" | "award"; id: number; label: string; editHref: string };
};

async function walk(dir: string): Promise<string[]> {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }
  const files: string[] = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(full)));
    } else {
      files.push(full);
    }
  }
  return files;
}

export async function scanOwnedImages(): Promise<ScannedAsset[]> {
  const root = path.join(process.cwd(), "public", "uploads", "architectureone");
  const [projectFiles, awardFiles, projects, awards] = await Promise.all([
    walk(path.join(root, "projects")),
    walk(path.join(root, "awards")),
    prisma.project.findMany({ select: { id: true, address: true, place: true } }),
    prisma.award.findMany({ select: { id: true, name: true } }),
  ]);

  const projectById = new Map(projects.map((p) => [p.id, p]));
  const awardById = new Map(awards.map((a) => [a.id, a]));
  const results: ScannedAsset[] = [];

  for (const file of projectFiles) {
    const rel = path.relative(path.join(root, "projects"), file).split(path.sep);
    const projectId = Number(rel[0]);
    const project = projectById.get(projectId);
    if (!project) continue; // orphaned on disk — the project was deleted
    const stat = await fs.stat(file);
    results.push({
      url: `/uploads/architectureone/projects/${rel.join("/")}`,
      fileSizeKb: Math.round(stat.size / 1024),
      owner: {
        kind: "project",
        id: projectId,
        label: `${project.address}, ${project.place}`,
        editHref: `/admin/projects/${projectId}/edit`,
      },
    });
  }

  for (const file of awardFiles) {
    const rel = path.relative(path.join(root, "awards"), file).split(path.sep);
    const awardId = Number(rel[0]);
    const award = awardById.get(awardId);
    if (!award) continue;
    const stat = await fs.stat(file);
    results.push({
      url: `/uploads/architectureone/awards/${rel.join("/")}`,
      fileSizeKb: Math.round(stat.size / 1024),
      owner: { kind: "award", id: awardId, label: award.name, editHref: `/admin/awards/${awardId}/edit` },
    });
  }

  return results;
}

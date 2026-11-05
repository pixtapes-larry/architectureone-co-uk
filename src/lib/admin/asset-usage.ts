// Finds every place a retained original (Asset row) is referenced *directly*
// by its own URL. That's every usage now: cover photo and gallery crops are
// rendered live via CSS (CroppedImage) straight from the original's own
// file, never a generated derivative, so Project.coverPhotoUrl /
// ProjectPhoto.url already equal the asset's url. Floorplan/elevation/badge
// fields work the same way when a "choose from library" pick reuses an
// original verbatim. (A handful of cover/gallery photos cropped before this
// model existed still point at their own baked file instead — those are
// matched separately, by assetId, in asset-scan.ts.)
import { prisma } from "../prisma";

export type DirectAssetReference = {
  url: string;
  role: string;
  roleLabel: string;
  ownerLabel: string;
  ownerId: number;
  editHref: string;
  ownerKind: "project" | "award";
};

export async function getDirectAssetReferences(): Promise<DirectAssetReference[]> {
  const [projects, awards] = await Promise.all([
    prisma.project.findMany({
      select: {
        id: true,
        address: true,
        place: true,
        coverPhotoUrl: true,
        coverPhotoAssetId: true,
        floorplanBeforeImage: true,
        floorplanAfterImage: true,
        elevationBeforeImage: true,
        elevationAfterImage: true,
        photos: { where: { assetId: { not: null } }, select: { url: true, isBefore: true } },
      },
    }),
    prisma.award.findMany({ select: { id: true, name: true, imageUrl: true } }),
  ]);

  const refs: DirectAssetReference[] = [];

  for (const p of projects) {
    const ownerLabel = `${p.address}, ${p.place}`;
    const editHref = `/admin/projects/${p.id}/edit`;
    const ownerKind = "project" as const;
    const ownerId = p.id;
    if (p.coverPhotoAssetId) {
      refs.push({ url: p.coverPhotoUrl, role: "cover", roleLabel: "Cover photo", ownerLabel, ownerId, editHref, ownerKind });
    }
    for (const photo of p.photos) {
      refs.push({
        url: photo.url,
        role: photo.isBefore ? "gallery-before" : "gallery-after",
        roleLabel: photo.isBefore ? "Gallery (before)" : "Gallery (after)",
        ownerLabel,
        ownerId,
        editHref,
        ownerKind,
      });
    }
    if (p.floorplanBeforeImage) refs.push({ url: p.floorplanBeforeImage, role: "floorplan-before", roleLabel: "Floor plan (before)", ownerLabel, ownerId, editHref, ownerKind });
    if (p.floorplanAfterImage) refs.push({ url: p.floorplanAfterImage, role: "floorplan-after", roleLabel: "Floor plan (after)", ownerLabel, ownerId, editHref, ownerKind });
    if (p.elevationBeforeImage) refs.push({ url: p.elevationBeforeImage, role: "elevation-before", roleLabel: "Elevation (before)", ownerLabel, ownerId, editHref, ownerKind });
    if (p.elevationAfterImage) refs.push({ url: p.elevationAfterImage, role: "elevation-after", roleLabel: "Elevation (after)", ownerLabel, ownerId, editHref, ownerKind });
  }

  for (const a of awards) {
    if (a.imageUrl) {
      refs.push({
        url: a.imageUrl,
        role: "badge",
        roleLabel: "Award badge",
        ownerLabel: a.name,
        ownerId: a.id,
        editHref: `/admin/awards/${a.id}/edit`,
        ownerKind: "award",
      });
    }
  }

  return refs;
}

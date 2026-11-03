// Finds every place a retained original (Asset row) is referenced *directly*
// by its own URL — the floorplan/elevation/award-badge fields never go
// through the crop flow, so a "choose from library" pick on one of those
// just copies the original's URL verbatim rather than generating its own
// derivative. Cover photo and gallery derivatives are tracked separately,
// via Project.coverPhotoAssetId / ProjectPhoto.assetId (see asset-scan.ts) —
// this only covers the fields that have no such column.
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
        floorplanBeforeImage: true,
        floorplanAfterImage: true,
        elevationBeforeImage: true,
        elevationAfterImage: true,
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

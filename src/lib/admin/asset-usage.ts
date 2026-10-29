// How many places on the site currently point at a given image — most
// single-image fields are still a plain URL string (not a foreign key), so
// those are only countable by scanning every field that can hold one. Cover
// photos and gallery photos are different: since the asset-backed crop
// model, their stored URL is a *derivative* generated from a retained
// original, not the original's own URL — so a reused original is counted
// by its Asset id instead, via coverPhotoAssetId / ProjectPhoto.assetId.
import { prisma } from "../prisma";

export async function getAssetUsageCounts(): Promise<{
  byUrl: Map<string, number>;
  byAssetId: Map<number, number>;
}> {
  const [projects, awards] = await Promise.all([
    prisma.project.findMany({
      select: {
        coverPhotoUrl: true,
        coverPhotoAssetId: true,
        floorplanBeforeImage: true,
        floorplanAfterImage: true,
        elevationBeforeImage: true,
        elevationAfterImage: true,
        photos: { select: { url: true, assetId: true } },
      },
    }),
    prisma.award.findMany({ select: { imageUrl: true } }),
  ]);

  const byUrl = new Map<string, number>();
  const byAssetId = new Map<number, number>();

  function bumpUrl(url: string | null | undefined) {
    if (!url) return;
    byUrl.set(url, (byUrl.get(url) ?? 0) + 1);
  }
  function bumpAssetId(id: number | null | undefined) {
    if (!id) return;
    byAssetId.set(id, (byAssetId.get(id) ?? 0) + 1);
  }

  for (const p of projects) {
    // The derivative file is always "in use" by its own URL, regardless of
    // whether it also has a retained original behind it — and separately,
    // that original (if any) is "in use" by this derivative, tracked by id.
    bumpUrl(p.coverPhotoUrl);
    bumpAssetId(p.coverPhotoAssetId);
    bumpUrl(p.floorplanBeforeImage);
    bumpUrl(p.floorplanAfterImage);
    bumpUrl(p.elevationBeforeImage);
    bumpUrl(p.elevationAfterImage);
    for (const photo of p.photos) {
      bumpUrl(photo.url);
      bumpAssetId(photo.assetId);
    }
  }
  for (const a of awards) bumpUrl(a.imageUrl);

  return { byUrl, byAssetId };
}

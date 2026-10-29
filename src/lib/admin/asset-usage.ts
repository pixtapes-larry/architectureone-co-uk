// How many places on the site currently point at a given image URL — every
// single-image field is a plain URL string (not a foreign key), so the only
// way to know if a file is "in use" is to scan every field that can hold one.
import { prisma } from "../prisma";

export async function getAssetUsageCounts(): Promise<Map<string, number>> {
  const [projects, awards] = await Promise.all([
    prisma.project.findMany({
      select: {
        coverPhotoUrl: true,
        floorplanBeforeImage: true,
        floorplanAfterImage: true,
        elevationBeforeImage: true,
        elevationAfterImage: true,
        photos: { select: { url: true } },
      },
    }),
    prisma.award.findMany({ select: { imageUrl: true } }),
  ]);

  const counts = new Map<string, number>();
  function bump(url: string | null | undefined) {
    if (!url) return;
    counts.set(url, (counts.get(url) ?? 0) + 1);
  }

  for (const p of projects) {
    bump(p.coverPhotoUrl);
    bump(p.floorplanBeforeImage);
    bump(p.floorplanAfterImage);
    bump(p.elevationBeforeImage);
    bump(p.elevationAfterImage);
    for (const photo of p.photos) bump(photo.url);
  }
  for (const a of awards) bump(a.imageUrl);

  return counts;
}

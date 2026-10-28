// One-off: geocode any existing project missing lat/long (the 2018 archive
// import predates the geocoding wire-up). Run with: npx tsx prisma/backfill-geocode.ts
import { prisma } from "../src/lib/prisma";
import { geocodeAddress } from "../src/lib/geocode";

async function main() {
  const missing = await prisma.project.findMany({
    where: { OR: [{ latitude: null }, { longitude: null }] },
    select: { id: true, address: true, place: true, postcode: true },
  });

  console.log(`${missing.length} project(s) missing coordinates.`);

  let geocoded = 0;
  let failed = 0;

  for (const p of missing) {
    const coords = await geocodeAddress(p.address, p.place, p.postcode);
    if (!coords) {
      failed++;
      console.warn(`  [FAIL] #${p.id} — ${p.address}, ${p.place}, ${p.postcode}`);
      continue;
    }
    await prisma.project.update({
      where: { id: p.id },
      data: { latitude: coords.latitude, longitude: coords.longitude },
    });
    geocoded++;
    console.log(`  [OK]   #${p.id} — ${p.address} → ${coords.latitude}, ${coords.longitude}`);
  }

  console.log(`\nDone. Geocoded ${geocoded}, failed ${failed}.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());

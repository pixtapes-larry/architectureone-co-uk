// One-off: migrates the hardcoded header nav (src/lib/nav.ts NAV_LINKS +
// SiteHeader's hardcoded About/Services/Explore Projects links) into the
// new NavItem table. Run with: npx tsx -r dotenv/config prisma/seed-nav.ts
import { prisma } from "../src/lib/prisma";

async function main() {
  const existing = await prisma.navItem.count();
  if (existing > 0) {
    console.log(`NavItem already has ${existing} row(s) — skipping seed.`);
    return;
  }

  const about = await prisma.navItem.create({
    data: { label: "About", href: "/about", sortOrder: 0 },
  });
  await prisma.navItem.create({
    data: { label: "Services", href: "/about/services", sortOrder: 0, parentId: about.id },
  });
  await prisma.navItem.create({
    data: { label: "Explore Projects", href: "/projects", sortOrder: 1 },
  });
  await prisma.navItem.create({
    data: { label: "Permitted Development", href: "/permitted-development", sortOrder: 2 },
  });
  await prisma.navItem.create({
    data: { label: "Large Extensions", href: "/large-extensions", sortOrder: 3 },
  });
  await prisma.navItem.create({
    data: { label: "New Builds & Developments", href: "/new-builds-developments", sortOrder: 4 },
  });

  console.log("Done. Seeded 6 nav items.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());

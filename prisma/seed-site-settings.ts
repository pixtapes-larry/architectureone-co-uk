// One-off: migrates the hardcoded constants from src/lib/site-content.ts
// into the new SiteSettings singleton row. Run with:
// npx tsx -r dotenv/config prisma/seed-site-settings.ts
import { prisma } from "../src/lib/prisma";

async function main() {
  await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      contactEmail: "hello@architectureone.co.uk",
      officeLine1: "26a High Street",
      officePlace: "Hadleigh, Suffolk",
      officePostcode: "IP7 5AP",
      officePhone: "01473 807754",
      officeLatitude: 52.0456,
      officeLongitude: 0.9592,
      promiseBullets: [
        "Clear, fixed-fee architectural quotations",
        "Drawings ready in 7–10 working days",
        "Personal and local expertise",
        "Honest & transparent interactions",
        "Trusted by our customers [confirm rating]",
        "Protection: professional indemnity [confirm figure]",
      ],
    },
  });
  console.log("Done.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());

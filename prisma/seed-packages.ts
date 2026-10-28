// One-off: migrates the hardcoded PD_PACKAGE_TIERS/PD_PACKAGE_NOTE into the
// new Package/PackageSettings tables. Run with:
// npx tsx -r dotenv/config prisma/seed-packages.ts
import { prisma } from "../src/lib/prisma";

const TIERS = [
  {
    slug: "starter",
    name: "Starter",
    price: "£1,199",
    featured: false,
    sortOrder: 0,
    bullets: ["Scope to be confirmed", "Scope to be confirmed", "Scope to be confirmed"],
  },
  {
    slug: "standard",
    name: "Standard",
    price: "£1,799",
    featured: true,
    sortOrder: 1,
    bullets: ["Scope to be confirmed", "Scope to be confirmed", "Scope to be confirmed"],
  },
  {
    slug: "extended",
    name: "Extended",
    price: "£2,499",
    featured: false,
    sortOrder: 2,
    bullets: ["Scope to be confirmed", "Scope to be confirmed", "Scope to be confirmed"],
  },
];

const EXPECTATIONS = [
  { label: "Meetings", count: null },
  { label: "Deliverables", count: null },
  { label: "Submissions", count: null },
  { label: "Reworks", count: null },
  { label: "Amendments", count: null },
];

const NOTE =
  "All exclude planning/structural/other third-party fees. Working guide prices only — not yet locked.";

async function main() {
  for (const tier of TIERS) {
    await prisma.package.upsert({
      where: { slug: tier.slug },
      update: {},
      create: { ...tier, expectations: EXPECTATIONS },
    });
    console.log(`  [OK] ${tier.name}`);
  }

  await prisma.packageSettings.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, note: NOTE },
  });
  console.log("  [OK] PackageSettings note");

  console.log("\nDone.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());

// One-off: seeds the first Testimonial (migrated from the now-removed
// HomePageContent.testimonialQuote/testimonialStars), seeds
// ProjectsMapContent (previously hardcoded in ProjectsMapExperience.tsx),
// and rewrites the "850" literal project-count copy to use the
// "{projectCount}" live token (see src/lib/project-count.ts). Run with:
// npx tsx -r dotenv/config prisma/seed-testimonials-map.ts
import { prisma } from "../src/lib/prisma";

async function main() {
  const existingTestimonials = await prisma.testimonial.count();
  if (existingTestimonials === 0) {
    await prisma.testimonial.create({
      data: {
        quote: "An exceptional job securing planning permission for our Grade II listed house.",
        authorName: null,
        stars: 5,
        featured: true,
        sortOrder: 0,
      },
    });
    console.log("[OK] Testimonial (migrated from HomePageContent)");
  } else {
    console.log(`Testimonial already has ${existingTestimonials} row(s) — skipping.`);
  }

  await prisma.projectsMapContent.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      searchHeading: "{projectCount}+ projects. One map.",
      searchLead: "Enter a postcode district to see Architecture ONE's work near you.",
      startingNote: "We're starting you off in Hadleigh, Suffolk — search to look elsewhere",
    },
  });
  console.log("[OK] ProjectsMapContent");

  await prisma.homePageContent.update({
    where: { id: 1 },
    data: {
      heroHeadingAccent: "{projectCount}+ projects",
      mapTeaserPillText: "{projectCount} projects, mapped",
      featuredLead: "A sample of the {projectCount} — explore all of them on the map.",
    },
  });
  console.log("[OK] HomePageContent — {projectCount} tokens");

  const about = await prisma.aboutPageContent.findUnique({ where: { id: 1 } });
  if (about) {
    const paragraphs = (about.storyParagraphs as string[]).map((p) =>
      p.replace(
        "with over 850 projects delivered across Suffolk and Essex",
        "with over {projectCount} projects delivered across Suffolk and Essex",
      ),
    );
    await prisma.aboutPageContent.update({
      where: { id: 1 },
      data: {
        heroTagline: "Local, personal, and {projectCount}+ projects delivered across the East of England.",
        storyParagraphs: paragraphs,
      },
    });
    console.log("[OK] AboutPageContent — {projectCount} tokens");
  }

  console.log("\nDone.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());

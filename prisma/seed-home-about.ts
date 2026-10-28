// One-off: migrates the hardcoded Home/About page copy (in
// src/app/(marketing)/page.tsx and src/app/(marketing)/about/page.tsx, at
// the time this script was written) into HomePageContent, AboutPageContent,
// TeamMember, and the 4 new homeTeaser* fields on CategoryPage. Run with:
// npx tsx -r dotenv/config prisma/seed-home-about.ts
import { prisma } from "../src/lib/prisma";

async function main() {
  await prisma.homePageContent.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      heroPill: "Award-winning architecture practice",
      heroHeadingAccent: "850+ projects",
      heroHeadingRest: "delivered across the East of England",
      heroLead:
        "Extensions, loft conversions and new builds — designed and delivered locally, from first sketch to signed-off plans.",
      heroPhotoLabel: "[Hero photo — a recent project, full-bleed]",

      statsFoundedYear: 2015,
      // statsRating/statsReviewCount/statsAwardsWon existed at the time this
      // ran but were later removed in favour of live computed values.

      audienceHeading: "Which project sounds like yours?",
      audienceLead: "Whatever stage your project is at, there's a clear path forward.",

      mapTeaserPillText: "850 projects, mapped",
      mapTeaserTitle: "Discover your next project",
      mapTeaserLead: "Enter your postcode to see Architecture ONE's work near you.",

      guideCoverText: "A Homeowner's Guide to Extending",
      guideTag: "Free download",
      guideHeading: "A Homeowner's Guide to Extending",
      guideLead:
        "Permitted development rules, budgets, and what to expect at each stage — the same guide handed out after every consultation.",
      guideButtonLabel: "Download the free guide",

      featuredHeading: "Featured projects",
      featuredLead: "A sample of the 850 — explore all of them on the map.",

      awardsLabel: "Multi-award-winning",
      awardNames: ["LABC", "FLOURISH", "BEST OF IPSWICH"],

      teamTeaserHeading: "Meet the team behind Architecture ONE",
      teamTeaserLead:
        "A first-person introduction — how long in Suffolk, why this work, what matters on a project. Named relationships with Babergh, Mid Suffolk and Ipswich Borough planning teams.",
      teamTeaserButtonLabel: "▶ Watch a short introduction",

      finalCtaHeading: "Ready to talk about your project?",
      finalCtaLead:
        "Book a paid initial consultation — you'll leave with a written brief covering scope, approach and indicative costs.",
    },
  });
  console.log("[OK] HomePageContent");

  await prisma.aboutPageContent.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      heroTagline: "Local, personal, and 850+ projects delivered across the East of England.",
      heroPhotoLabel: "[Hero photo — Jonathon or the team on site]",

      storyParagraphs: [
        "Architecture ONE was founded in 2015 by Jonathon Bensley-Byham, based in the East of England — bringing international experience from London, Sydney, Dubai and Doha back to a genuinely local practice.",
        "Eleven years on, we're one of the most prolific architectural practices in the area, with over 850 projects delivered across Suffolk and Essex — each one grounded in a genuine relationship with the people who live there. That local knowledge, of the councils, the conservation areas, the quirks of a particular street, is what lets us give honest, personable advice from the very first conversation.",
        "We punch above our weight, too — picking up regional and national awards for both design and building control along the way. But our heads aren't in the clouds — we're still a practice built on people, with design, planning and construction oversight all under one roof, so you only ever have one number to call.",
      ],

      servicesTeaserLead: "From first sketch to a finished build — the full range of what we do, start to finish.",

      reviewsHeading: "What our clients say",
      reviewsLead: "A sample of our Google reviews — see them all on our profile.",
      reviewsPlaceholderNote:
        "Real client reviews are coming once pulled from our Google Business Profile — not shown here yet so nothing is fabricated in the meantime.",

      finalCtaHeading: "Ready to talk about your project?",
      finalCtaLead:
        "Book a paid initial consultation — you'll leave with a written brief covering scope, approach and indicative costs.",
    },
  });
  console.log("[OK] AboutPageContent");

  const existingTeam = await prisma.teamMember.count();
  if (existingTeam === 0) {
    await prisma.teamMember.createMany({
      data: [
        {
          name: "Jonathon Bensley-Byham",
          role: "Project Director",
          bio:
            "After years working in large practices abroad, Jonathon moved back home to England in 2015 and set up Architecture ONE — wanting a more hands-on approach to the design and build process. His multi-disciplinary background means he can help people see the real potential in their space, and for Jonathon nothing beats the satisfaction of helping a client visualise that potential, then working alongside them to see it actually come to life. The problem-solving along the way, working a tricky site or a stubborn planning constraint until it clicks, is still the part he loves most, more than a decade in.\n\nHe's spent as much time on site in boots as at a drawing board, so he designs knowing what something actually costs to build, not just to draw — which is also why planners, builders and engineers across the East of England keep coming back to him. A modest rear extension gets exactly the same care as a multi-house development. Off the clock, he's usually got his head under a bonnet, fixing something that probably didn't need fixing yet.",
          photoLabel: "[Roundel photo — Jonathon]",
          sortOrder: 0,
        },
        {
          name: "Tenielle Bensley-Byham",
          role: "Practice Manager",
          bio:
            "A partner at Architecture ONE, Tenielle played a key role in setting up the studio in 2015 and brings her extensive business experience and meticulous attention to detail to both the architecture and the business side.",
          photoLabel: "[Tenielle]",
          sortOrder: 1,
        },
        {
          name: "Luke MacKay-Morris",
          role: "Barn Conversion / Self Build Consultant",
          bio:
            "Luke first worked alongside Architecture ONE as a client, on his own Class Q barn conversion — a project that won the LABC national award for Best Conversion to a Residential Dwelling in 2023. He now supports clients on the niche legislation, ecology and biodiversity side of conversions.",
          photoLabel: "[Luke]",
          sortOrder: 2,
        },
      ],
    });
    console.log("[OK] TeamMember x3");
  } else {
    console.log(`TeamMember already has ${existingTeam} row(s) — skipping seed.`);
  }

  await prisma.categoryPage.update({
    where: { category: "permitted-development" },
    data: {
      homeTeaserTitle: "Small Extensions & Permitted Development",
      homeTeaserTag: "From £1,199",
      homeTeaserBlurb: "Three fixed-scope packages with guide pricing.",
      homeTeaserLinkLabel: "View packages →",
      homeTeaserPhotoLabel: "[Permitted Development photo]",
    },
  });
  await prisma.categoryPage.update({
    where: { category: "large-extensions" },
    data: {
      // Deliberately distinct from this category's own heroTitle
      // ("Large Extensions") — the home page card calls out Loft
      // Conversions too, since that sub-type lives in Permitted
      // Development but reads as a bigger-transformation project here.
      homeTeaserTitle: "Loft Conversions & Large Extensions",
      homeTeaserTag: "Design-led",
      homeTeaserBlurb: "Bigger transformations, start to sign-off.",
      homeTeaserLinkLabel: "See examples →",
      homeTeaserPhotoLabel: "[Large Extensions photo]",
    },
  });
  await prisma.categoryPage.update({
    where: { category: "new-builds-developments" },
    data: {
      homeTeaserTitle: "New Builds & Developments",
      homeTeaserTag: "Incl. Class Q & barns",
      homeTeaserBlurb: "From feasibility through to consent.",
      homeTeaserLinkLabel: "See examples →",
      homeTeaserPhotoLabel: "[New Builds & Developments photo]",
    },
  });
  console.log("[OK] CategoryPage homeTeaser fields x3");

  console.log("\nDone.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());

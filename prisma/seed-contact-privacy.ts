// One-off: migrates the remaining hardcoded Contact page copy into
// SiteSettings, and seeds a draft PrivacyPageContent row. Run with:
// npx tsx -r dotenv/config prisma/seed-contact-privacy.ts
import { prisma } from "../src/lib/prisma";

async function main() {
  await prisma.siteSettings.update({
    where: { id: 1 },
    data: {
      contactHeading: "Contact Us",
      contactLead:
        "Have a question before booking a consultation? Send us a message and we'll get back to you.",
      contactSidebarHeading: "Get in touch",
      contactEmailUnconfirmedNote: "Unconfirmed — unused inbox until we set this up properly.",
    },
  });
  console.log("[OK] SiteSettings contact fields");

  await prisma.privacyPageContent.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      heading: "Privacy Policy",
      intro:
        "This is a draft placeholder policy — it has not yet been reviewed by a solicitor and should not be relied on. It will be replaced with a proper policy before launch.",
      bodyParagraphs: [
        "Architecture ONE (\"we\", \"us\") is committed to protecting your privacy. This policy explains what information we collect when you use this website or get in touch with us, and how we use it.",
        "What we collect: when you submit the Contact or Book a Consultation forms, we collect the details you provide — your name, email address, phone number, and anything else you choose to include about your project. We don't currently use analytics or tracking cookies beyond what's strictly necessary for the site to function.",
        "How we use it: information submitted through our forms is used only to respond to your enquiry and, where relevant, to deliver the services you've asked us about. We don't sell or share your information with third parties for marketing purposes.",
        "Your rights: you can ask us what information we hold about you, ask us to correct it, or ask us to delete it, at any time — just get in touch using the contact details on our Contact page.",
        "This policy is reviewed periodically and may change as the site and our services evolve.",
      ],
      lastUpdatedNote: "Draft — last updated during initial site build, not yet legally reviewed.",
    },
  });
  console.log("[OK] PrivacyPageContent");

  console.log("\nDone.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());

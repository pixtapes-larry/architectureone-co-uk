// Site-wide copy — DB-backed (see prisma/schema.prisma SiteSettings),
// previously hardcoded as constants in site-content.ts. A single shared
// row (id 1), seeded via prisma/seed-site-settings.ts.
import { prisma } from "./prisma";

export type SiteSettingsData = {
  contactEmail: string;
  office: {
    line1: string;
    place: string;
    postcode: string;
    phone: string;
    latitude: number;
    longitude: number;
  };
  promiseBullets: string[];
  contact: {
    heading: string;
    lead: string;
    sidebarHeading: string;
    emailUnconfirmedNote: string;
    metaTitle: string | null;
    metaDescription: string | null;
  };
  googleReviewsUrl: string | null;
};

export async function getSiteSettings(): Promise<SiteSettingsData> {
  const row = await prisma.siteSettings.findUniqueOrThrow({ where: { id: 1 } });
  return {
    contactEmail: row.contactEmail,
    office: {
      line1: row.officeLine1,
      place: row.officePlace,
      postcode: row.officePostcode,
      phone: row.officePhone,
      latitude: row.officeLatitude,
      longitude: row.officeLongitude,
    },
    promiseBullets: row.promiseBullets as string[],
    contact: {
      heading: row.contactHeading,
      lead: row.contactLead,
      sidebarHeading: row.contactSidebarHeading,
      emailUnconfirmedNote: row.contactEmailUnconfirmedNote,
      metaTitle: row.contactMetaTitle,
      metaDescription: row.contactMetaDescription,
    },
    googleReviewsUrl: row.googleReviewsUrl,
  };
}

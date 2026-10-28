import { prisma } from "../prisma";

export async function getSiteSettingsAdmin() {
  return prisma.siteSettings.findUnique({ where: { id: 1 } });
}

export type SiteSettingsAdminInput = {
  contactEmail: string;
  officeLine1: string;
  officePlace: string;
  officePostcode: string;
  officePhone: string;
  officeLatitude: number;
  officeLongitude: number;
  promiseBullets: string[];

  contactHeading: string;
  contactLead: string;
  contactSidebarHeading: string;
  contactEmailUnconfirmedNote: string;
  contactMetaTitle: string | null;
  contactMetaDescription: string | null;

  googleReviewsUrl: string | null;
};

export async function updateSiteSettingsAdmin(input: SiteSettingsAdminInput) {
  return prisma.siteSettings.upsert({
    where: { id: 1 },
    update: input,
    create: { id: 1, ...input },
  });
}

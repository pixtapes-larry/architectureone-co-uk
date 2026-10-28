import { prisma } from "../prisma";

export async function getHomePageContentAdmin() {
  return prisma.homePageContent.findUnique({ where: { id: 1 } });
}

export type HomePageContentAdminInput = {
  heroPill: string;
  heroHeadingAccent: string;
  heroHeadingRest: string;
  heroLead: string;
  heroPhotoLabel: string;

  statsFoundedYear: number;
  statsRating: number;
  statsReviewCount: number;
  statsAwardsWon: number;

  audienceHeading: string;
  audienceLead: string;

  mapTeaserPillText: string;
  mapTeaserTitle: string;
  mapTeaserLead: string;

  guideCoverText: string;
  guideTag: string;
  guideHeading: string;
  guideLead: string;
  guideButtonLabel: string;

  featuredHeading: string;
  featuredLead: string;

  awardsLabel: string;
  awardNames: string[];

  teamTeaserHeading: string;
  teamTeaserLead: string;
  teamTeaserButtonLabel: string;

  finalCtaHeading: string;
  finalCtaLead: string;
};

export async function updateHomePageContentAdmin(input: HomePageContentAdminInput) {
  return prisma.homePageContent.upsert({
    where: { id: 1 },
    update: input,
    create: { id: 1, ...input },
  });
}

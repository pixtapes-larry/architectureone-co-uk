// Record counts shown in brackets next to each Content Library nav item
// (e.g. "Testimonials (40)") — keyed by that item's href so AdminShell can
// just look up a match, no per-item wiring needed.
import { prisma } from "../prisma";

export async function getAdminNavCounts(): Promise<Record<string, number>> {
  const [projects, packages, teamMembers, testimonials, services, awards, localAuthorities] =
    await Promise.all([
      prisma.project.count(),
      prisma.package.count(),
      prisma.teamMember.count(),
      prisma.testimonial.count(),
      prisma.service.count(),
      prisma.award.count(),
      prisma.project.findMany({ distinct: ["localAuthority"], select: { localAuthority: true } }),
    ]);

  return {
    "/admin/projects": projects,
    "/admin/packages": packages,
    "/admin/team-members": teamMembers,
    "/admin/testimonials": testimonials,
    "/admin/services": services,
    "/admin/awards": awards,
    "/admin/local-authorities": localAuthorities.length,
  };
}

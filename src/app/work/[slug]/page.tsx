import { notFound } from "next/navigation";
import FeaturedProjectTemplate from "@/components/project/FeaturedProjectTemplate";
import { MOCK_PROJECTS } from "@/lib/mock-projects";

// Every featured project's slug is known ahead of time (currently from
// mock data, eventually from `prisma.project.findMany`), so each case
// study page is statically generated at build time rather than looked
// up per request.
export async function generateStaticParams() {
  return MOCK_PROJECTS.filter((p) => p.featured && p.slug).map((p) => ({
    slug: p.slug as string,
  }));
}

// generateStaticParams already makes this route genuinely static (and
// therefore instant) once built — but `next dev` never serves from the
// static cache regardless, so Cache Components' dev-only "instant"
// validator always flags params access here. Opting out avoids a
// misleading warning badge; it has no effect on the production build.
export const instant = false;

export default async function FeaturedProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = MOCK_PROJECTS.find((p) => p.featured && p.slug === slug);

  if (!project) {
    notFound();
  }

  return <FeaturedProjectTemplate project={project} />;
}

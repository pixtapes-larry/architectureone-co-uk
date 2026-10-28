import type { Metadata } from "next";
import { notFound } from "next/navigation";
import FeaturedProjectTemplate from "@/components/project/FeaturedProjectTemplate";
import {
  getProjectBySlug,
  getFeaturedProjects,
  getFeaturedProjectSlugs,
} from "@/lib/projects";
import { PROJECT_TYPE_CATEGORY } from "@/lib/project-labels";
import { pageMetadata } from "@/lib/seo";

// Every featured project's slug is known ahead of time, so each case
// study page is statically generated at build time rather than looked
// up per request.
export async function generateStaticParams() {
  const slugs = await getFeaturedProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

// generateStaticParams already makes this route genuinely static (and
// therefore instant) once built — but `next dev` never serves from the
// static cache regardless, so Cache Components' dev-only "instant"
// validator always flags params access here. Opting out avoids a
// misleading warning badge; it has no effect on the production build.
export const instant = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};

  return pageMetadata({
    metaTitle: project.metaTitle,
    metaDescription: project.metaDescription,
    fallbackTitle: `${project.address}, ${project.place}`,
    fallbackDescription: project.description,
  });
}

export default async function FeaturedProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const category = PROJECT_TYPE_CATEGORY[project.projectType];
  const related = (await getFeaturedProjects())
    .filter(
      (p) =>
        p.slug &&
        p.slug !== project.slug &&
        PROJECT_TYPE_CATEGORY[p.projectType] === category,
    )
    .slice(0, 3);

  return <FeaturedProjectTemplate project={project} related={related} />;
}

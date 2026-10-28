import type { Metadata } from "next";
import MapLoader from "@/components/map/MapLoader";
import { getAllProjects } from "@/lib/projects";
import { getProjectsMapContent } from "@/lib/projects-map-content";
import { getProjectCount, withProjectCount } from "@/lib/project-count";
import { pageMetadata } from "@/lib/seo";

export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  const [content, projectCount] = await Promise.all([getProjectsMapContent(), getProjectCount()]);
  return pageMetadata({
    metaTitle: content.metaTitle,
    metaDescription: content.metaDescription,
    fallbackTitle: "Our Projects",
    fallbackDescription: withProjectCount(content.searchLead, projectCount),
  });
}

export default async function ProjectsPage() {
  const [projects, content, projectCount] = await Promise.all([
    getAllProjects(),
    getProjectsMapContent(),
    getProjectCount(),
  ]);
  return (
    <MapLoader
      projects={projects}
      searchHeading={withProjectCount(content.searchHeading, projectCount)}
      searchLead={content.searchLead}
      startingNote={content.startingNote}
    />
  );
}

import MapLoader from "@/components/map/MapLoader";
import { getAllProjects } from "@/lib/projects";
import { getProjectsMapContent } from "@/lib/projects-map-content";
import { getProjectCount, withProjectCount } from "@/lib/project-count";

export const instant = false;

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

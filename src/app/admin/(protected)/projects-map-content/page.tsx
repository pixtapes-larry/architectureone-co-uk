import { getProjectsMapContentAdmin } from "@/lib/admin/projects-map-content";
import ProjectsMapContentForm from "@/components/admin/ProjectsMapContentForm";

export const instant = false;

export default async function AdminProjectsMapContentPage() {
  const content = await getProjectsMapContentAdmin();

  if (!content) {
    return <p>No projects-map content row found — run prisma/seed-testimonials-map.ts.</p>;
  }

  return (
    <>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>
        Projects map content
      </h1>
      <ProjectsMapContentForm content={content} />
    </>
  );
}

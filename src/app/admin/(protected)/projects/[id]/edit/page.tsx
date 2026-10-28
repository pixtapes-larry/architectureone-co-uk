import { notFound } from "next/navigation";
import { getProjectAdmin } from "@/lib/admin/projects";
import { getServiceGroups } from "@/lib/services";
import ProjectForm from "@/components/admin/ProjectForm";

export const instant = false;

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [project, serviceGroups] = await Promise.all([
    getProjectAdmin(Number(id)),
    getServiceGroups(),
  ]);

  if (!project) {
    notFound();
  }

  return (
    <>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>
        Edit project — {project.address}
      </h1>
      <ProjectForm project={project} serviceGroups={serviceGroups} />
    </>
  );
}

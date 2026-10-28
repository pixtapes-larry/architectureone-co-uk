import ProjectForm from "@/components/admin/ProjectForm";
import { getServiceGroups } from "@/lib/services";

export const instant = false;

export default async function NewProjectPage() {
  const serviceGroups = await getServiceGroups();
  return (
    <>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>
        New project
      </h1>
      <ProjectForm serviceGroups={serviceGroups} />
    </>
  );
}

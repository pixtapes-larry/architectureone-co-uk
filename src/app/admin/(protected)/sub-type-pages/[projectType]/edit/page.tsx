import { notFound } from "next/navigation";
import { getSubTypePageAdmin } from "@/lib/admin/sub-type-pages";
import { PROJECT_TYPE_LABELS } from "@/lib/project-labels";
import type { ProjectType } from "@/generated/prisma/enums";
import SubTypePageForm from "@/components/admin/SubTypePageForm";

export const instant = false;

export default async function EditSubTypePagePage({
  params,
}: {
  params: Promise<{ projectType: string }>;
}) {
  const { projectType } = await params;
  const page = await getSubTypePageAdmin(projectType as ProjectType);

  if (!page) {
    notFound();
  }

  return (
    <>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>
        Edit sub-type page — {PROJECT_TYPE_LABELS[page.projectType]}
      </h1>
      <SubTypePageForm page={page} />
    </>
  );
}

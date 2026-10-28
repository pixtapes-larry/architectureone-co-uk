import { notFound } from "next/navigation";
import { getServiceAdmin, listDistinctServiceGroups } from "@/lib/admin/services";
import ServiceForm from "@/components/admin/ServiceForm";

export const instant = false;

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [service, existingGroups] = await Promise.all([
    getServiceAdmin(Number(id)),
    listDistinctServiceGroups(),
  ]);

  if (!service) {
    notFound();
  }

  return (
    <>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>
        Edit service — {service.title}
      </h1>
      <ServiceForm service={service} existingGroups={existingGroups} />
    </>
  );
}

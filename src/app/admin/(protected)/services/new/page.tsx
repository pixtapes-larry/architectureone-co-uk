import ServiceForm from "@/components/admin/ServiceForm";
import { listDistinctServiceGroups } from "@/lib/admin/services";

export const instant = false;

export default async function NewServicePage() {
  const existingGroups = await listDistinctServiceGroups();
  return (
    <>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>
        New service
      </h1>
      <ServiceForm existingGroups={existingGroups} />
    </>
  );
}

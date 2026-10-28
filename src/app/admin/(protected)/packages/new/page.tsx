import PackageForm from "@/components/admin/PackageForm";
import { getServiceGroups } from "@/lib/services";

export const instant = false;

export default async function NewPackagePage() {
  const serviceGroups = await getServiceGroups();
  return (
    <>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>
        New package
      </h1>
      <PackageForm serviceGroups={serviceGroups} />
    </>
  );
}

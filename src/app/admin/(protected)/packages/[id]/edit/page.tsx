import { notFound } from "next/navigation";
import { getPackageAdmin } from "@/lib/admin/packages";
import { getServiceGroups } from "@/lib/services";
import PackageForm from "@/components/admin/PackageForm";

export const instant = false;

export default async function EditPackagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [pkg, serviceGroups] = await Promise.all([
    getPackageAdmin(Number(id)),
    getServiceGroups(),
  ]);

  if (!pkg) {
    notFound();
  }

  return (
    <>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>
        Edit package — {pkg.name}
      </h1>
      <PackageForm pkg={pkg} serviceGroups={serviceGroups} />
    </>
  );
}

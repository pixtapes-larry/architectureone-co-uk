import { notFound } from "next/navigation";
import { getNavItemAdmin, listTopLevelNavItemsAdmin } from "@/lib/admin/nav-items";
import NavItemForm from "@/components/admin/NavItemForm";

export const instant = false;

export default async function EditNavItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [item, topLevelOptions] = await Promise.all([
    getNavItemAdmin(Number(id)),
    listTopLevelNavItemsAdmin(),
  ]);

  if (!item) {
    notFound();
  }

  return (
    <>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>
        Edit nav item — {item.label}
      </h1>
      <NavItemForm item={item} topLevelOptions={topLevelOptions} />
    </>
  );
}

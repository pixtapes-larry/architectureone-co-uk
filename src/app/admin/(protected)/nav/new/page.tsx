import NavItemForm from "@/components/admin/NavItemForm";
import { listTopLevelNavItemsAdmin } from "@/lib/admin/nav-items";

export const instant = false;

export default async function NewNavItemPage() {
  const topLevelOptions = await listTopLevelNavItemsAdmin();
  return (
    <>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>
        New nav item
      </h1>
      <NavItemForm topLevelOptions={topLevelOptions} />
    </>
  );
}

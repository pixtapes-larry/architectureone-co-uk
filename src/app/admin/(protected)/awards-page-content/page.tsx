import { notFound } from "next/navigation";
import { getAwardsPageContentAdmin } from "@/lib/admin/awards-page-content";
import AwardsPageContentForm from "@/components/admin/AwardsPageContentForm";

export const instant = false;

export default async function AwardsPageContentAdminPage() {
  const content = await getAwardsPageContentAdmin();

  if (!content) {
    notFound();
  }

  return (
    <>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>
        Awards page
      </h1>
      <AwardsPageContentForm content={content} />
    </>
  );
}
